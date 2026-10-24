# CityOps Live

Click-through 3D story for the Oracle LiveLabs workshops (Lab 2: RAG to Agents, Lab 3: Agent Memory), 12 Nov 2026.

```
npm install
npm run dev      # http://localhost:5173
npx vitest run   # tests
npm run build    # dist/
```

Keys: ArrowRight next, ArrowLeft back, J jump menu. Any scene opens with `#scene=<id>`, for example `#scene=0.5`.
Quality: set `localStorage.setItem('cityops.quality', 'low')` to turn bloom off.

## Map data

Streets, rail and the river centreline come from OpenStreetMap (© OpenStreetMap contributors, ODbL), fetched with
`tools/build_roads.py` from an Overpass export into `src/content/roads.json` and `src/content/river.json`.
City models are Kenney's CC0 city kits (`public/models/kenney`); people are Kenney Mini Characters and the control-room furniture is the Kenney Furniture Kit, both CC0 (`public/models/kenney/characters`, `public/models/kenney/furniture`). Landmarks are stylised, hand-built in `src/world/LandmarksMesh.tsx`.
The central city is "Bangkok" by TerraMesh (https://sketchfab.com/3d-models/bangkok-52642605182e40709802bc030ce05174),
CC-BY-4.0, with textures and terrain stripped and blocks recoloured (`public/models/city/bangkok`, `src/world/BangkokCity.tsx`).
