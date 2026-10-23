"""Turn Overpass JSON (roads + waterways) into the small JSON files the page loads.

Usage (from the project root, on untrusted downloads):
    python -I tools/build_roads.py <roads.json> <water.json> src/content

Writes:
    src/content/roads.json   [{"c": "<class>", "p": [[lat, lon], ...]}, ...]
    src/content/river.json   [[lat, lon], ...]   the Chao Phraya centreline, north to south

Data (c) OpenStreetMap contributors, ODbL. https://www.openstreetmap.org/copyright
"""
import json
import math
import sys
from collections import defaultdict

BBOX = (13.60, 100.46, 13.80, 100.63)  # south, west, north, east
TOL_DEG = 0.00028  # ~30 m simplification tolerance
# main network only: the page wants a city that reads, not a street atlas
KEEP = {
    "motorway": "motorway",
    "trunk": "trunk",
    "primary": "primary",
    "secondary": "secondary",
}


def dp(points, tol):
    """Douglas-Peucker on [lat, lon] pairs."""
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    dmax, idx = 0.0, 0
    for i in range(1, len(points) - 1):
        d = seg_dist(points[i], a, b)
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        left = dp(points[: idx + 1], tol)
        right = dp(points[idx:], tol)
        return left[:-1] + right
    return [a, b]


def seg_dist(p, a, b):
    ax, ay, bx, by, px, py = a[1], a[0], b[1], b[0], p[1], p[0]
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def inside(p):
    return BBOX[0] <= p[0] <= BBOX[2] and BBOX[1] <= p[1] <= BBOX[3]


def rnd(p):
    return [round(p[0], 5), round(p[1], 5)]


def build_roads(src):
    out = []
    for e in src["elements"]:
        if e.get("type") != "way" or "geometry" not in e:
            continue
        tags = e.get("tags", {})
        cls = KEEP.get(tags.get("highway") or tags.get("railway"))
        if not cls:
            continue
        if tags.get("tunnel") == "yes" or tags.get("layer", "0").startswith("-"):
            continue
        pts = [[g["lat"], g["lon"]] for g in e["geometry"]]
        pts = [p for p in pts if inside(p)]
        if len(pts) < 2:
            continue
        pts = dp(pts, TOL_DEG)
        out.append({"c": cls, "p": [rnd(p) for p in pts], "b": 1 if tags.get("bridge") == "yes" else 0})
    return out


def stitch_river(src, name_match="Chao Phraya"):
    """Chain the named river ways end to end, longest chain wins."""
    ways = []
    for e in src["elements"]:
        if e.get("type") != "way" or "geometry" not in e:
            continue
        tags = e.get("tags", {})
        if tags.get("waterway") != "river":
            continue
        nm = (tags.get("name:en") or tags.get("name") or "")
        if name_match.lower() not in nm.lower():
            continue
        ways.append([[g["lat"], g["lon"]] for g in e["geometry"]])
    # chain by shared endpoints
    key = lambda p: (round(p[0], 6), round(p[1], 6))
    ends = defaultdict(list)
    for i, w in enumerate(ways):
        ends[key(w[0])].append(i)
        ends[key(w[-1])].append(i)
    used = set()
    chains = []
    for i in range(len(ways)):
        if i in used:
            continue
        chain = list(ways[i])
        used.add(i)
        grew = True
        while grew:
            grew = False
            for end_idx, pick in ((-1, 0), (0, -1)):
                for j in ends[key(chain[end_idx])]:
                    if j in used:
                        continue
                    w = ways[j]
                    if key(w[0]) == key(chain[end_idx]) and end_idx == -1:
                        chain = chain + w[1:]
                    elif key(w[-1]) == key(chain[end_idx]) and end_idx == -1:
                        chain = chain + list(reversed(w))[1:]
                    elif key(w[-1]) == key(chain[end_idx]) and end_idx == 0:
                        chain = w[:-1] + chain
                    elif key(w[0]) == key(chain[end_idx]) and end_idx == 0:
                        chain = list(reversed(w))[:-1] + chain
                    else:
                        continue
                    used.add(j)
                    grew = True
                    break
        chains.append(chain)
    best = max(chains, key=len)
    if best[0][0] < best[-1][0]:  # make it run north to south
        best = list(reversed(best))
    best = dp(best, TOL_DEG * 2)
    return [rnd(p) for p in best]


def main():
    roads_path, water_path, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    with open(roads_path, encoding="utf-8") as f:
        roads = build_roads(json.load(f))
    with open(water_path, encoding="utf-8") as f:
        river = stitch_river(json.load(f))
    with open(f"{out_dir}/roads.json", "w", encoding="utf-8") as f:
        json.dump(roads, f, separators=(",", ":"))
    with open(f"{out_dir}/river.json", "w", encoding="utf-8") as f:
        json.dump(river, f, separators=(",", ":"))
    n = sum(len(r["p"]) for r in roads)
    print(f"roads: {len(roads)} ways, {n} points; river: {len(river)} points, "
          f"lat {river[0][0]:.3f}->{river[-1][0]:.3f}")


if __name__ == "__main__":
    main()
