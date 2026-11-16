// @ts-expect-error node:fs has no type declarations in this browser-oriented project
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { addInspectorAppearance, boneRegionBounds, INSPECTOR_BONES } from '../../src/world/InspectorAppearance';

interface SourceDocument {
  nodes: { name?: string }[];
  animations: { name?: string }[];
  images?: unknown[];
  textures?: unknown[];
  materials?: { pbrMetallicRoughness?: { baseColorTexture?: unknown }; normalTexture?: unknown; emissiveTexture?: unknown; occlusionTexture?: unknown }[];
}

/** Load the real bundled rig/geometry/clips; omit texture I/O only for the non-WebGL test runner. */
function loadCharacter(name: string): Promise<GLTF> {
  const source = new Uint8Array(readFileSync(`public/models/kenney/characters/${name}.glb`));
  const sourceView = new DataView(source.buffer);
  const jsonLength = sourceView.getUint32(12, true);
  const document = JSON.parse(new TextDecoder().decode(source.subarray(20, 20 + jsonLength))) as SourceDocument;
  delete document.images; delete document.textures;
  for (const material of document.materials ?? []) {
    if (material.pbrMetallicRoughness) delete material.pbrMetallicRoughness.baseColorTexture;
    delete material.normalTexture; delete material.emissiveTexture; delete material.occlusionTexture;
  }
  const json = new TextEncoder().encode(JSON.stringify(document));
  const padded = Math.ceil(json.length / 4) * 4;
  const binary = source.subarray(20 + jsonLength);
  const result = new Uint8Array(20 + padded + binary.length);
  const header = new DataView(result.buffer);
  header.setUint32(0, 0x46546c67, true); header.setUint32(4, 2, true); header.setUint32(8, result.length, true);
  header.setUint32(12, padded, true); header.setUint32(16, 0x4e4f534a, true);
  result.fill(32, 20, 20 + padded); result.set(json, 20); result.set(binary, 20 + padded);
  return new Promise((resolve, reject) => new GLTFLoader().parse(result.buffer, '', resolve, reject));
}

let source: GLTF;
beforeAll(async () => { source = await loadCharacter('character-female-a'); });

test('the bundled character has the verified bones and original walking/inspection clips', () => {
  for (const name of INSPECTOR_BONES) expect(source.scene.getObjectByName(name)).toBeInstanceOf(THREE.Bone);
  expect(source.scene.getObjectByName('hand-right')).toBeUndefined();
  expect(source.animations.map(clip => clip.name)).toEqual(expect.arrayContaining(['idle', 'walk', 'interact-right', 'sit', 'crouch']));
});

test('PPE is opt-in on a clone, attaches to the measured rig and leaves the source untouched', () => {
  const model = cloneSkinned(source.scene);
  const originalBounds = new THREE.Box3().setFromObject(model);
  const originalBones = INSPECTOR_BONES.map(name => {
    const bone = model.getObjectByName(name)!;
    return { name, position: bone.position.clone(), quaternion: bone.quaternion.clone(), scale: bone.scale.clone() };
  });
  const body = model.getObjectByName('body-mesh') as THREE.Mesh;
  const originalMaterial = body.material;
  const originalGeometry = body.geometry;
  const appearance = addInspectorAppearance(model)!;
  expect(appearance).not.toBeNull();
  expect(model.getObjectByName('inspection-helmet')?.parent?.name).toBe('head');
  expect(model.getObjectByName('inspection-vest')?.parent?.name).toBe('torso');
  expect(model.getObjectByName('inspection-tablet')?.parent?.name).toBe('arm-left');
  expect(appearance.torch.parent?.name).toBe('arm-right');
  expect(appearance.emitter.name).toBe('inspection-torch-emitter');
  expect(body.geometry).toBe(originalGeometry);
  expect(body.material).not.toBe(originalMaterial);
  expect(source.scene.getObjectByName('inspection-helmet')).toBeUndefined();
  for (const { name, position, quaternion, scale } of originalBones) {
    const bone = model.getObjectByName(name)!;
    expect(bone.position.equals(position)).toBe(true);
    expect(bone.quaternion.equals(quaternion)).toBe(true);
    expect(bone.scale.equals(scale)).toBe(true);
  }
  const right = model.getObjectByName('arm-right') as THREE.Bone;
  const region = boneRegionBounds(source.scene, source.scene.getObjectByName('arm-right') as THREE.Bone);
  expect(appearance.torch.position.x).toBeCloseTo(region.min.x + .025, 5);
  expect(right).toBe(appearance.torch.parent);
  model.updateMatrixWorld(true);
  expect(appearance.emitter.getWorldPosition(new THREE.Vector3()).toArray().every(Number.isFinite)).toBe(true);
  appearance.dispose(); appearance.dispose();
  expect(body.material).toBe(originalMaterial);
  expect(model.getObjectByName('inspection-helmet')).toBeUndefined();
  expect(new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).distanceTo(originalBounds.getSize(new THREE.Vector3()))).toBeLessThan(1e-6);
});

test.each(['walk', 'interact-right', 'idle'])('adding equipment preserves the existing %s skeleton animation', pose => {
  const plain = cloneSkinned(source.scene), equipped = cloneSkinned(source.scene);
  const appearance = addInspectorAppearance(equipped)!;
  const a = new THREE.AnimationMixer(plain), b = new THREE.AnimationMixer(equipped);
  const clip = source.animations.find(clip => clip.name === pose)!;
  a.clipAction(clip).play(); b.clipAction(clip).play(); a.update(.42); b.update(.42);
  for (const name of INSPECTOR_BONES) {
    const left = plain.getObjectByName(name)!, right = equipped.getObjectByName(name)!;
    expect(left.position.distanceTo(right.position)).toBeLessThan(1e-8);
    // Imported float32 quaternions may not be exactly unit length; compare components directly.
    expect(left.quaternion.toArray()).toEqual(right.quaternion.toArray());
  }
  a.stopAllAction(); b.stopAllAction(); appearance.dispose();
});

test('unsupported rigs receive no partial equipment or mutations', () => {
  const unsupported = new THREE.Group();
  expect(addInspectorAppearance(unsupported)).toBeNull();
  expect(unsupported.children).toHaveLength(0);
});

test.each(['character-male-b', 'character-male-d', 'character-female-a'])('helmet covers the upper-head corners of %s without changing the rig', async name => {
  const character = await loadCharacter(name);
  const model = cloneSkinned(character.scene);
  const head = model.getObjectByName('head') as THREE.Bone;
  const bounds = boneRegionBounds(model, head);
  const appearance = addInspectorAppearance(model)!;
  model.updateWorldMatrix(true, true);
  const shell = model.getObjectByName('inspection-helmet-shell')!;
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const z of [bounds.min.z, bounds.max.z]) {
      const corner = head.localToWorld(new THREE.Vector3(x, bounds.max.y, z));
      const ray = new THREE.Raycaster(corner.clone().add(new THREE.Vector3(0, .5, 0)), new THREE.Vector3(0, -1, 0));
      const hits = ray.intersectObject(shell);
      expect(hits.length, `${name}: upper corner ${x}, ${z}`).toBeGreaterThan(0);
      expect(hits[0].point.y).toBeGreaterThan(corner.y + .005);
    }
  }
  appearance.dispose();
});
