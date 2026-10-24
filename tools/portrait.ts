// Dev tool: render one Kenney character (the same GLB that walks on the bridge) as a head-and-shoulders
// portrait on a transparent background, and leave the PNG on window.__portrait for tools/portrait.mjs.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const params = new URLSearchParams(location.search);
const who = params.get('who') ?? 'character-female-a';
const SIZE = 512;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(SIZE, SIZE);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a919c, 1.6));
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(1.5, 2.5, 3);
scene.add(key);
const rim = new THREE.DirectionalLight(0x9fe1cb, 0.8);
rim.position.set(-2, 1.5, -1.5);
scene.add(rim);

new GLTFLoader().load(`/models/kenney/characters/${who}.glb`, (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  // stand in the idle pose, not the bind pose
  const mixer = new THREE.AnimationMixer(model);
  const idle = gltf.animations.find((a) => a.name === 'idle') ?? gltf.animations[0];
  if (idle) mixer.clipAction(idle).play();
  mixer.update(0.4);
  model.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(model);
  const h = box.max.y - box.min.y;
  // face and upper body: the top ~65% of these big-headed figures, seen from the front (+z) and a touch above
  const look = new THREE.Vector3((box.min.x + box.max.x) / 2, box.min.y + h * 0.66, (box.min.z + box.max.z) / 2);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  camera.position.set(look.x + h * 0.18, look.y + h * 0.1, look.z + h * 1.95);
  camera.lookAt(look);
  renderer.render(scene, camera);
  (window as unknown as { __portrait: string }).__portrait = renderer.domElement.toDataURL('image/png');
});
