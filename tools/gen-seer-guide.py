"""Generate src/content/seerGuide.json and src/assets/seer/*.webp from the extracted Lab 1 workshop guide.

Usage (run with python -I, the source is extracted from a download):
  python3 -I tools/gen-seer-guide.py <guide.json> <web image dir> <repo root>

The text is copied verbatim: no field is shortened or rewritten. Only the shape is checked.
"""
import json
import shutil
import sys
from pathlib import Path

src, web, root = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
labs = json.loads(src.read_text(encoding="utf-8"))

STEP_KEYS = {"id", "en", "th", "expected_en", "expected_th", "code", "images"}
out = []
figures = {}
for lab in labs:
    tasks = []
    for t in lab["tasks"]:
        for f in t["figures"]:
            figures[f["id"]] = f
        steps = []
        for s in t["steps"]:
            assert set(s) == STEP_KEYS, s["id"]
            assert all(isinstance(c, str) for c in s["code"]), s["id"]
            steps.append({k: s[k] for k in ["id", "en", "th", "expected_en", "expected_th", "code", "images"]})
        tasks.append({"id": t["id"], "title_en": t["title_en"], "title_th": t["title_th"], "steps": steps, "figures": t["figures"]})
    out.append({"id": lab["id"], "route": lab["route"], "title": lab["title"], "intro_en": lab["intro_en"], "intro_th": lab["intro_th"], "tasks": tasks})

used = {i for lab in out for t in lab["tasks"] for s in t["steps"] for i in s["images"]}
assert used <= set(figures), used - set(figures)

dest = root / "src" / "assets" / "seer"
dest.mkdir(parents=True, exist_ok=True)
for f in figures.values():
    assert "/" not in f["file"] and f["file"].endswith(".webp"), f["file"]
    shutil.copyfile(web / f["file"], dest / f["file"])

(root / "src" / "content" / "seerGuide.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
n_steps = sum(len(t["steps"]) for lab in out for t in lab["tasks"])
print(f"{len(out)} labs, {n_steps} steps, {len(figures)} figures")
