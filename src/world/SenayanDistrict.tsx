import React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import DATA from './senayanData';
import type { Point, Polygon, Polygons } from './senayanTypes';
import { fromBridgeLocal, toBridgeLocal } from './bridgeFrame';
import { setTerrainGrid } from './terrain';
import { useSceneStore } from '../engine/store';
const BB = DATA.meta.bounds;
const inside = (p: Point) => p[0] > BB[0] && p[0] < BB[2] && p[1] > BB[1] && p[1] < BB[3];
function shapeOf(poly: Polygon): THREE.Shape { const shape = new THREE.Shape(poly[0].map(p => new THREE.Vector2(p[0], -p[1]))); for (const r of poly.slice(1))
    shape.holes.push(new THREE.Path(r.map(p => new THREE.Vector2(p[0], -p[1])))); return shape; }
function build(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'SenayanDistrict';
    const contextGroup = new THREE.Group();
    contextGroup.name = 'Senayan mapped context near inspection';
    group.add(contextGroup);
    const batches = new Map<THREE.Material, THREE.BufferGeometry[]>(), nearBatches = new Map<THREE.Material, THREE.BufferGeometry[]>(), materials: THREE.MeshStandardMaterial[] = [];
    let context = false;
    function material(color: THREE.ColorRepresentation, props: THREE.MeshStandardMaterialParameters = {}) { const m = new THREE.MeshStandardMaterial({ color, roughness: .82, ...props }); materials.push(m); return m; }
    const concrete = material('#c7c4b9'), roof = material('#b7b9af'), street = material('#4c565a'), pathMat = material('#bbb6a5'), grass = material('#74865a'), green = material('#4c7151'), pool = material('#557c7e', { roughness: .38, metalness: .12 }), sand = material('#bdac8d'), white = material('#dfded3');
    function facade(base: string, line: string) { const c = document.createElement('canvas'); c.width = 64; c.height = 64; const ctx = c.getContext('2d'); if (!ctx)
        throw new Error('Canvas2D unavailable for Senayan textures'); ctx.fillStyle = base; ctx.fillRect(0, 0, 64, 64); ctx.fillStyle = line; ctx.fillRect(0, 0, 64, 6); ctx.fillRect(0, 0, 4, 64); ctx.fillStyle = 'rgba(220,232,226,.16)'; ctx.fillRect(7, 9, 48, 3); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return material('#ffffff', { map: t, roughness: .43, metalness: .25 }); }
    const blueGlass = facade('#56757c', '#afb5af'), bronzeGlass = facade('#63777a', '#b6a991'), greenGlass = facade('#6b8882', '#b6bab1');
    function add(geometry: THREE.BufferGeometry, mat: THREE.Material) { const target = context ? nearBatches : batches; if (!target.has(mat))
        target.set(mat, []); target.get(mat)!.push(geometry.index ? geometry.toNonIndexed() : geometry); }
    function flat(polys: Polygons, y: number, mat: THREE.Material) { for (const poly of polys) {
        if (poly[0].length < 4)
            continue;
        const g = new THREE.ShapeGeometry(shapeOf(poly));
        g.rotateX(-Math.PI / 2);
        g.translate(0, y, 0);
        add(g, mat);
    } }
    function extrusion(polys: Polygons, height: number, side: THREE.Material = concrete, cap: THREE.Material = roof, base = 0) { for (const poly of polys) {
        if (poly[0].length < 4)
            continue;
        const g = new THREE.ExtrudeGeometry(shapeOf(poly), { depth: height, bevelEnabled: false, curveSegments: 1, steps: 1 });
        g.rotateX(-Math.PI / 2);
        g.translate(0, base, 0);
        const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            uv.setXY(i, (Math.abs(nor.getX(i)) > .5 ? pos.getZ(i) : pos.getX(i)) / .22, pos.getY(i) / .35);
        }
        for (const section of g.groups) {
            const part = new THREE.BufferGeometry();
            for (const key of ['position', 'normal', 'uv']) {
                const a = g.getAttribute(key) as THREE.BufferAttribute, n = a.itemSize;
                part.setAttribute(key, new THREE.BufferAttribute(a.array.slice(section.start * n, (section.start + section.count) * n), n));
            }
            add(part, section.materialIndex === 0 ? cap : side);
        }
        g.dispose();
    } }
    function box(x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material = concrete) { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); add(g, mat); }
    function ribbon(points: Point[], width: number, y: number | ((p: Point) => number), mat: THREE.Material) { const v: number[] = []; for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        if (!inside(a) && !inside(b))
            continue;
        const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
        if (l < .001)
            continue;
        const nx = -dz / l * width / 2, nz = dx / l * width / 2;
        const height = (p: Point) => typeof y === 'function' ? y(p) : y;
        const A = [a[0] + nx, height(a), a[1] + nz], B = [a[0] - nx, height(a), a[1] - nz], C = [b[0] + nx, height(b), b[1] + nz], D = [b[0] - nx, height(b), b[1] - nz];
        v.push(...A, ...C, ...B, ...B, ...C, ...D);
    } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals(); add(g, mat); }
    // Base terrain contains a real opening around the training bridge for the channel cutaway.
    const bounds: Point[] = [[BB[0], BB[1]], [BB[2], BB[1]], [BB[2], BB[3]], [BB[0], BB[3]], [BB[0], BB[1]]];
    const cut: Point[] = [[-3, -3], [3, -3], [3, 3], [-3, 3], [-3, -3]].map(([x, z]): Point => { const p = fromBridgeLocal(x, z); return [p.x, p.z]; });
    flat([[bounds, cut]], -.005, concrete);
    const river = DATA.water.find(w => w.id === 'way/28931504');
    if (!river?.line)
        throw new Error('Senayan river geometry is missing');
    const riverLocal = river.line.map(p => toBridgeLocal(...p));
    function canalX(z: number) { let best = Infinity, result = 0; for (let i = 1; i < riverLocal.length; i++) {
        const a = riverLocal[i - 1], b = riverLocal[i];
        if (z >= Math.min(a.lz, b.lz) && z <= Math.max(a.lz, b.lz) && Math.abs(a.lx) < 5 && Math.abs(b.lx) < 5) {
            const t = (z - a.lz) / (b.lz - a.lz || 1);
            return a.lx + (b.lx - a.lx) * t;
        }
        if (Math.abs(a.lz - z) < best) {
            best = Math.abs(a.lz - z);
            result = a.lx;
        }
    } return result; }
    for (const side of [-1, 1]) {
        const edge: Point[] = [];
        for (let z = -3; z <= 3.001; z += .15) {
            const p = fromBridgeLocal(canalX(z) + side * .36, z);
            edge.push([p.x, p.z]);
        }
        const outer: Point[] = [3, -3].map(z => { const p = fromBridgeLocal(side * 3, z); return [p.x, p.z]; });
        flat([[[...edge, ...outer, edge[0]]]], 0, concrete);
        ribbon(edge, .035, -.025, stoneMaterial());
    }
    function stoneMaterial() { return concrete; }
    const waterY = (p: Point) => { const l = toBridgeLocal(...p); return Math.abs(l.lx) < 3 && Math.abs(l.lz) < 3 ? -.12 : .012; };
    for (const area of DATA.land) {
        if (area.id === 'way/682984153')
            continue;
        const mat = area.kind === 'pitch' ? green : area.kind === 'golf_course' ? grass : area.kind === 'park' ? green : grass;
        flat(area.polygons, .008, mat);
    }
    for (const w of DATA.water) {
        if (w.polygons)
            flat(w.polygons, .014, pool);
        if (w.line)
            ribbon(w.line, w.id === 'way/28931504' ? .70 : w.width, waterY, pool);
    }
    for (const r of DATA.roads) {
        if (r.id === 'way/498447364')
            continue;
        const minor = ['path', 'footway', 'pedestrian', 'steps', 'cycleway'].includes(r.kind);
        ribbon(r.line, r.width, minor ? .022 : .035, minor ? pathMat : street);
    }
    // Fine mapped building footprints are batched, not thousands of independent draw calls.
    for (const b of DATA.buildings) {
        if (b.id === 'relation/14717268')
            continue;
        const bx = -38.19, bz = -19.57, dx = Math.max(b.bounds[0] - bx, 0, bx - b.bounds[2]), dz = Math.max(b.bounds[1] - bz, 0, bz - b.bounds[3]);
        context = Math.hypot(dx, dz) < 6;
        const glass = b.height > 4 || b.kind === 'office' || b.kind === 'apartments';
        const side = b.landmark ? (b.id === 'way/162174048' ? bronzeGlass : greenGlass) : glass ? blueGlass : concrete;
        extrusion(b.polygons, b.height, side, roof);
        if (b.landmark) {
            const [x0, z0, x1, z1] = b.bounds, w = x1 - x0, d = z1 - z0, c = b.center;
            // The ledges follow the actual roof silhouette; heights and facades remain interpreted.
            extrusion(b.polygons, .06, white, white, b.height);
            if (b.height > 4) {
                for (let y = .4; y < b.height; y += .41)
                    extrusion(b.polygons, .025, white, white, y);
            }
            else {
                extrusion(b.polygons, .10, sand, white, b.height * .48);
                extrusion(b.polygons, .08, sand, white, b.height * .88);
            }
        }
    }
    context = false;
    const fair = DATA.buildings.find(b => b.id === 'relation/14717268');
    if (fair) {
        // Footprint is mapped. Podium and upper bar are an architectural interpretation, not a survey.
        extrusion(fair.polygons, 1.2, sand, white);
        const [x0, z0, x1, z1] = fair.bounds, c = fair.center, w = (x1 - x0) * .78, d = (z1 - z0) * .27, cz = z0 + (z1 - z0) * .34;
        const tower: Polygon = [[[c[0] - w / 2, cz - d / 2], [c[0] + w / 2, cz - d / 2], [c[0] + w / 2 + .18, cz + d / 2], [c[0] - w / 2 - .18, cz + d / 2], [c[0] - w / 2, cz - d / 2]]];
        extrusion([tower], 11.4, bronzeGlass, white, 1.2);
        for (let y = 1.55; y < 12.6; y += .35)
            extrusion([tower], .045, sand, white, y);
        box(c[0], 12.82, cz, w * .72, .40, d * .82, sand);
        box(c[0], 13.08, cz, w * .55, .12, d * .65, white);
        for (let x = c[0] - w / 2 + .3; x < c[0] + w / 2; x += .65)
            box(x, 6.8, cz + d / 2 + .12, .065, 11.2, .12, sand);
        // Roof garden and pool use only low-rise podium territory behind the main hotel bar.
        box(c[0], 1.24, z1 - 2.5, w * .50, .06, 1.1, pool);
        box(c[0], 1.22, z1 - 1.5, w * .7, .05, .65, green);
    }
    const gbk = DATA.landmarks['way/682984153'];
    if (gbk) {
        const outer = gbk.polygons[0][0], c = gbk.center;
        const inner: Point[] = outer.map<Point>(p => [c[0] + (p[0] - c[0]) * .63, c[1] + (p[1] - c[1]) * .63]);
        extrusion([[outer, inner]], 2.2, white, white);
        const roofInner: Point[] = outer.map<Point>(p => [c[0] + (p[0] - c[0]) * .68, c[1] + (p[1] - c[1]) * .68]);
        extrusion([[outer, roofInner]], .18, white, white, 2.32);
        flat([[inner]], .035, green);
        box(c[0], .05, c[1], 6.8, .02, 10.5, material('#668650'));
        // Stadium roof ribs and a clear open pitch preserve its recognizable oval form.
        for (let i = 0; i < outer.length - 1; i += 2) {
            const a = outer[i], b = roofInner[i];
            ribbon([a, b], .09, 2.53, roof);
        }
    }
    // Context trees use mapped points plus deterministic low-density park planting.
    const trees = DATA.trees.filter(inside);
    let seed = 913;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const pointIn = (p: Point, r: Point[]) => { let yes = false; for (let i = 0, k = r.length - 1; i < r.length; k = i++) {
        const a = r[i], b = r[k];
        if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0])
            yes = !yes;
    } return yes; };
    for (const park of DATA.land.filter(a => ['park', 'golf_course', 'garden'].includes(a.kind))) {
        for (const poly of park.polygons) {
            const r = poly[0], xs = r.map(p => p[0]), zs = r.map(p => p[1]);
            const minx = Math.min(...xs), maxx = Math.max(...xs), minz = Math.min(...zs), maxz = Math.max(...zs);
            for (let i = 0; i < Math.min(550, (maxx - minx) * (maxz - minz) * .3); i++) {
                const p: Point = [minx + random() * (maxx - minx), minz + random() * (maxz - minz)];
                if (inside(p) && pointIn(p, r) && !poly.slice(1).some(h => pointIn(p, h)))
                    trees.push(p);
            }
        }
    }
    const canopy = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), green, trees.length), trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5), material('#716657'), trees.length), dummy = new THREE.Object3D();
    trees.forEach(([x, z], i) => { const r = .22 + random() * .22; dummy.position.set(x, .45, z); dummy.scale.set(r, r * 1.15, r); dummy.updateMatrix(); canopy.setMatrixAt(i, dummy.matrix); dummy.position.y = .18; dummy.scale.set(.035, .36, .035); dummy.updateMatrix(); trunk.setMatrixAt(i, dummy.matrix); });
    canopy.castShadow = true;
    group.add(canopy, trunk);
    const collections: Array<[
        Map<THREE.Material, THREE.BufferGeometry[]>,
        THREE.Group
    ]> = [[batches, group], [nearBatches, contextGroup]];
    for (const [collection, target] of collections)
        for (const [mat, geos] of collection) {
            let count = 0;
            geos.forEach(g => count += g.attributes.position.count);
            const position = new Float32Array(count * 3), normal = new Float32Array(count * 3), uv = new Float32Array(count * 2);
            let at = 0;
            for (const g of geos) {
                const n = g.attributes.position.count;
                position.set((g.getAttribute('position') as THREE.BufferAttribute).array, at * 3);
                if (g.attributes.normal)
                    normal.set((g.getAttribute('normal') as THREE.BufferAttribute).array, at * 3);
                if (g.attributes.uv)
                    uv.set((g.getAttribute('uv') as THREE.BufferAttribute).array, at * 2);
                at += n;
                g.dispose();
            }
            const g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.BufferAttribute(position, 3));
            g.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
            g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
            g.computeBoundingSphere();
            // Context meshes own their material instances; their fade never touches the wider city.
        const mesh = new THREE.Mesh(g, target === contextGroup ? mat.clone() : mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            target.add(mesh);
        }
    group.userData = { source: DATA.meta, buildingCount: DATA.buildings.length, landmarks: DATA.landmarks };
    return group;
}
function landmarkLabels(): THREE.Group { const root = new THREE.Group(); root.name = 'Senayan mapped landmark labels'; for (const id of ['relation/14717268', 'way/162174048', 'way/119772912', 'way/682984153']) {
    const site = DATA.landmarks[id];
    if (!site)
        continue;
    const b = DATA.buildings.find(x => x.id === id), height = id === 'relation/14717268' ? 13.2 : b?.height ?? 2.6;
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 80;
    const ctx = c.getContext('2d');
    if (!ctx)
        throw new Error('Canvas2D unavailable for Senayan textures');
    ctx.fillStyle = 'rgba(17,48,48,.94)';
    ctx.beginPath();
    ctx.roundRect(2, 2, 508, 76, 14);
    ctx.fill();
    ctx.font = '500 27px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(site.name, 256, 40, 480);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, toneMapped: false }));
    sprite.position.set(site.center[0], height + 1.4, site.center[1]);
    sprite.scale.set(8.5, 1.33, 1);
    sprite.renderOrder = 12;
    root.add(sprite);
} return root; }
/** Visibility target for inspection context, independent of camera paths and lesson timing. */
export function inspectionContextOpacity(previous: number, cutaway: boolean, settled: boolean, distance: number): number {
    if (cutaway) {
        const k = THREE.MathUtils.clamp((distance - 12) / 8, 0, 1);
        return k * k * (3 - 2 * k);
    }
    // A departing close-up holds its context until arrival, or until the camera is safely far away.
    return settled || distance >= 20 ? 1 : previous;
}

function setContextOpacity(context: THREE.Object3D, opacity: number): void {
    context.visible = opacity > .001;
    const opaque = opacity >= .999;
    context.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        object.castShadow = opaque;
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
            if (material.transparent === opaque) {
                material.transparent = !opaque;
                material.needsUpdate = true;
            }
            material.depthWrite = opaque;
            material.opacity = opacity;
        }
    });
}

export function SenayanDistrict() {
    const scene = React.useMemo(build, []), labels = React.useMemo(landmarkLabels, []);
    const current = useSceneStore(s => s.scenes[s.index]);
    const id = current?.id;
    const context = React.useMemo(() => scene.getObjectByName('Senayan mapped context near inspection'), [scene]);
    const label = React.useRef<HTMLDivElement | null>(null);
    const view = React.useRef({ opacity: 1, lastId: id, waitForMove: false, applied: -1 });
    React.useEffect(() => { setTerrainGrid(null); }, []);
    React.useEffect(() => {
        const element = document.createElement('div');
        element.className = 'senayan-inspection-cutaway';
        element.setAttribute('role', 'note');
        element.textContent = 'Inspection cutaway · nearby buildings hidden';
        Object.assign(element.style, { position: 'absolute', bottom: '88px', left: '48px', padding: '8px 12px', borderRadius: '5px', background: 'rgba(247,248,242,.94)', color: '#264e4d', font: '500 18px Inter, Arial', zIndex: '62', pointerEvents: 'none', display: 'none' });
        (document.getElementById('app') || document.body).appendChild(element);
        label.current = element;
        return () => { element.remove(); label.current = null; };
    }, []);
    useFrame(({ camera }, dt) => {
        if (!context) return;
        const state = useSceneStore.getState(), active = state.current();
        const cutaway = active.shot === 'bridge' || active.shot.startsWith('pier');
        const distance = Math.hypot(camera.position.x + 38.19, camera.position.y - .1, camera.position.z + 19.57);
        const v = view.current;
        if (v.lastId !== active.id) {
            // Hash navigation can briefly retain the old settled value before CameraRig starts its move.
            v.waitForMove = !cutaway && v.opacity < .999;
            v.lastId = active.id;
        }
        if (!state.settled) v.waitForMove = false;
        const target = inspectionContextOpacity(v.opacity, cutaway, state.settled && !v.waitForMove, distance);
        // A near inspection must never show a foreground wall, including a direct deep-link load.
        if (cutaway && distance <= 12) v.opacity = 0;
        else v.opacity += (target - v.opacity) * (1 - Math.exp(-Math.min(dt, .1) * 7));
        if (Math.abs(v.opacity - target) < .001) v.opacity = target;
        if (Math.abs(v.opacity - v.applied) > .001 || v.opacity === 0 && v.applied !== 0 || v.opacity === 1 && v.applied !== 1) {
            setContextOpacity(context, v.opacity);
            v.applied = v.opacity;
        }
        if (label.current) {
            label.current.style.display = v.opacity < .98 && active.overlay !== 'LabGo' ? 'block' : 'none';
            label.current.textContent = v.opacity < .02 ? 'Inspection cutaway · nearby buildings hidden' : 'Inspection cutaway · nearby context reduced';
        }
    });
    return React.createElement('group', null, React.createElement('primitive', { object: scene }), ['0.0', '0.1', '0.2'].includes(id) && React.createElement('primitive', { object: labels }));
}
