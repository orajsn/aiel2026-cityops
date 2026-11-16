import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/** Names verified in the bundled Kenney Mini Characters GLBs; there are no hand bones. */
export const INSPECTOR_BONES = ['head', 'torso', 'arm-left', 'arm-right', 'leg-left', 'leg-right'] as const;
type InspectorBone = typeof INSPECTOR_BONES[number];

export interface InspectorAppearance {
  torch: THREE.Group;
  emitter: THREE.Object3D;
  dispose(): void;
}

/** Rest-pose vertices belonging to a bone, expressed in that bone's local coordinates. */
export function boneRegionBounds(model: THREE.Object3D, bone: THREE.Bone): THREE.Box3 {
  model.updateWorldMatrix(true, true);
  const bounds = new THREE.Box3();
  const point = new THREE.Vector3();
  model.traverse(object => {
    if (!(object instanceof THREE.SkinnedMesh)) return;
    const joint = object.skeleton.bones.indexOf(bone);
    if (joint < 0) return;
    const indices = object.geometry.getAttribute('skinIndex');
    const weights = object.geometry.getAttribute('skinWeight');
    const positions = object.geometry.getAttribute('position');
    if (!indices || !weights || !positions) return;
    object.skeleton.update();
    for (let i = 0; i < positions.count; i++) {
      const joints = [indices.getX(i), indices.getY(i), indices.getZ(i), indices.getW(i)];
      const influence = [weights.getX(i), weights.getY(i), weights.getZ(i), weights.getW(i)];
      if (!joints.some((value, k) => value === joint && influence[k] > .5)) continue;
      object.getVertexPosition(i, point).applyMatrix4(object.matrixWorld);
      bounds.expandByPoint(bone.worldToLocal(point));
    }
  });
  return bounds;
}

/** Attach PPE to a cloned rig. No original geometry, bone transforms, or clips are changed. */
export function addInspectorAppearance(model: THREE.Object3D): InspectorAppearance | null {
  const bones = new Map<InspectorBone, THREE.Bone>();
  for (const name of INSPECTOR_BONES) {
    const object = model.getObjectByName(name);
    if (!(object instanceof THREE.Bone)) return null;
    bones.set(name, object);
  }
  const regions = new Map(INSPECTOR_BONES.map(name => [name, boneRegionBounds(model, bones.get(name)!)]));
  if ([...regions.values()].some(bounds => bounds.isEmpty())) return null;

  const ownedGeometry: THREE.BufferGeometry[] = [];
  const ownedMaterials: THREE.Material[] = [];
  const attachments: THREE.Group[] = [];
  const originalMaterials: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[] = [];
  model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    originalMaterials.push({ mesh: object, material: object.material });
    const originals: THREE.Material[] = Array.isArray(object.material) ? object.material : [object.material];
    const copies = originals.map(material => {
      const copy = material.clone();
      if (copy instanceof THREE.MeshStandardMaterial) copy.roughness = .86;
      ownedMaterials.push(copy);
      return copy;
    });
    object.material = Array.isArray(object.material) ? copies : copies[0];
  });
  const material = (color: string, roughness = .75, metalness = 0) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    ownedMaterials.push(result); return result;
  };
  const helmetMaterial = material('#e8e2cc', .58);
  const vestMaterial = material('#c7bd54', .88);
  const reflective = material('#dce8df', .36, .12);
  const dark = material('#283a3c', .82);
  const screen = material('#4f8189', .30, .12);
  const lens = material('#d8f1e9', .20, .15);
  const attach = (name: InspectorBone, label: string) => {
    const group = new THREE.Group(); group.name = label;
    bones.get(name)!.add(group); attachments.push(group); return group;
  };
  const mesh = (parent: THREE.Group, geometry: THREE.BufferGeometry, mat: THREE.Material, position: THREE.Vector3 | [number, number, number]) => {
    ownedGeometry.push(geometry);
    const result = new THREE.Mesh(geometry, mat);
    result.position.copy(position instanceof THREE.Vector3 ? position : new THREE.Vector3(...position));
    result.castShadow = true; result.receiveShadow = true; result.frustumCulled = false;
    parent.add(result); return result;
  };
  const box = (parent: THREE.Group, dimensions: [number, number, number], mat: THREE.Material, position: [number, number, number]) => mesh(parent, new THREE.BoxGeometry(...dimensions), mat, position);

  const headBounds = regions.get('head')!;
  const headSize = headBounds.getSize(new THREE.Vector3());
  const headCenter = headBounds.getCenter(new THREE.Vector3());
  const helmet = attach('head', 'inspection-helmet');
  // The source heads have square upper corners: a flattened hemisphere clips them.
  const capHeight = headSize.y * .30;
  const capY = headBounds.max.y + .035 - capHeight;
  const cap = mesh(helmet, new RoundedBoxGeometry(headSize.x * 1.10, capHeight, headSize.z * 1.12, 3, .02), helmetMaterial, [headCenter.x, capY + capHeight / 2, headCenter.z]);
  cap.name = 'inspection-helmet-shell';
  const brim = mesh(helmet, new THREE.CylinderGeometry(1, 1, .012, 24), helmetMaterial, [headCenter.x, capY, headCenter.z + .012]);
  brim.scale.set(headSize.x * .61, 1, headSize.z * .60);
  box(helmet, [.022, headSize.y * .045, headSize.z * .90], helmetMaterial, [headCenter.x, capY + capHeight, headCenter.z]);

  const torso = attach('torso', 'inspection-vest');
  const torsoBounds = regions.get('torso')!;
  const torsoSize = torsoBounds.getSize(new THREE.Vector3());
  const torsoCenter = torsoBounds.getCenter(new THREE.Vector3());
  const vestW = torsoSize.x * 1.07, vestH = torsoSize.y * .83;
  const front = torsoBounds.max.z + .008, back = torsoBounds.min.z - .006;
  for (const side of [-1, 1]) {
    box(torso, [vestW * .45, vestH, .012], vestMaterial, [torsoCenter.x + side * vestW * .25, torsoCenter.y, front]);
    box(torso, [vestW * .09, vestH * .91, .006], reflective, [torsoCenter.x + side * vestW * .29, torsoCenter.y, front + .010]);
  }
  box(torso, [vestW, vestH, .012], vestMaterial, [torsoCenter.x, torsoCenter.y, back]);
  for (const z of [front + .013, back - .01]) box(torso, [vestW * .99, vestH * .13, .005], reflective, [torsoCenter.x, torsoCenter.y - vestH * .20, z]);
  box(torso, [.008, vestH, .006], dark, [torsoCenter.x, torsoCenter.y, front + .008]);

  for (const name of ['leg-left', 'leg-right'] as const) {
    const bounds = regions.get(name)!;
    const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const boot = attach(name, `inspection-boot-${name}`);
    const height = size.y * .29;
    box(boot, [size.x * 1.06, height, size.z * 1.08], dark, [center.x, bounds.min.y + height * .5, center.z + .004]);
    box(boot, [size.x * 1.10, .012, size.z * 1.13], dark, [center.x, bounds.min.y + .005, center.z + .005]);
  }

  // Arm bones end at the grip: use the measured distal region rather than inventing a wrist bone.
  const leftBounds = regions.get('arm-left')!;
  const leftCenter = leftBounds.getCenter(new THREE.Vector3());
  const tablet = attach('arm-left', 'inspection-tablet');
  tablet.position.set(leftBounds.max.x - .025, leftCenter.y, leftCenter.z + .018);
  tablet.rotation.set(.10, 0, -.14);
  box(tablet, [.075, .10, .012], dark, [.015, -.015, .014]);
  box(tablet, [.060, .080, .003], screen, [.015, -.014, .022]);
  box(tablet, [.055, .012, .025], dark, [0, 0, .008]);

  const rightBounds = regions.get('arm-right')!;
  const rightCenter = rightBounds.getCenter(new THREE.Vector3());
  const torch = attach('arm-right', 'inspection-torch');
  torch.position.set(rightBounds.min.x + .025, rightCenter.y, rightCenter.z + .006);
  const barrel = mesh(torch, new THREE.CylinderGeometry(.018, .016, .084, 12), dark, [0, 0, .028]);
  barrel.rotation.x = Math.PI / 2;
  const rim = mesh(torch, new THREE.CylinderGeometry(.024, .020, .018, 12), dark, [0, 0, .077]);
  rim.rotation.x = Math.PI / 2;
  const glass = mesh(torch, new THREE.CircleGeometry(.018, 12), lens, [0, 0, .087]);
  glass.name = 'inspection-torch-lens';
  const emitter = new THREE.Object3D(); emitter.name = 'inspection-torch-emitter'; emitter.position.z = .089; torch.add(emitter);

  let disposed = false;
  return { torch, emitter, dispose() {
    if (disposed) return; disposed = true;
    attachments.forEach(group => group.removeFromParent());
    originalMaterials.forEach(({ mesh, material }) => { mesh.material = material; });
    ownedGeometry.forEach(geometry => geometry.dispose());
    ownedMaterials.forEach(mat => mat.dispose());
  } };
}
