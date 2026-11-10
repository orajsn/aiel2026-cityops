# Lab 3: CityOps material against the real notebook (`notebook_complete_ollama.ipynb`)

Reviewed 10 Nov 2026 against `src/content/notebooks/lab3_complete.json` (72 cells, the owner's run notebook, unchanged).

## The notebook's real structure

| Part (notebook heading) | Cells | TODOs inside |
|---|---|---|
| Part 1: Oracle setup | 4 to 9 | none |
| Part 2: The embedder and SDK | 10 to 14 | TODO 1 (cell 12) |
| Part 3: City asset + auto-extraction | 15 to 30 | TODO 2 (cell 20), TODO 3 (cell 28) |
| Part 4: Inspection findings + similar-finding search | 31 to 43 | TODO 4 (cell 39), TODO 5 (cell 43) |
| Part 5: Scoping - Inspector vs City | 44 to 47 | none (demo cells) |
| Part 6: The CityOps Copilot - End-to-end | 48 to 54 | TODO 6 (cell 54) |
| The cross-inspector handoff scenario (Day 1, Day N), Compare, Key takeaways, Memory types, Where to next | 55 to 70 | none |

## What matches (checked)

- Every code-map stop sits in the right Part: each stop's lit cell lies inside the Part its tag names (21 stops checked by program).
- Every "you should see" line on the code map is a line the notebook really prints (the TODO lines come from the checkpoint cell right after the lit cell, as in the notebook).
- The colleague's Thai line numbers (Part 1a: 71, 72, 74, 78; Part 2a: 17, 21, 22; Part 2b: 18; Part 3b: 13, 14, 16, 17, 19 to 27) all match the cells.
- Part 5 and Part 6 now show their own cells (fixed 10 Nov; Part 5 had shown lines of Part 6's `call_copilot`).

## What does not match

1. **The sub-letters (1a, 1b, 2a, 2b, 3a, 3b, 3c, 4a, 4b) are CityOps's own.** The notebook has Parts 1 to 6 only. Nothing says "3b" in the notebook. TODO numbers are the notebook's own and never appear on the map.
2. **3.15 With and without memory is not what the notebook prints.**
   - The notebook's question for Vance is a field report ("Reviewing Harbor Bridge as part of routine cycle. Noticing rust bleed near a pier on the south side and what looks like spalling on the concrete pedestal below."), not "What happened at this pier?".
   - The real without-memory answer is not "I have no earlier information": the stateless model invents prior findings (an "Inspector Smith, 2020" and an "Inspector Johnson, 2018").
   - The real with-memory answer cites Mercer's older record (grade B, 47 days ago, "up to 25%") and a Pier 3 finding by Dr. Samuel T. Okoye (grade D); the page shows Mercer's Day 1 finding (about 25%, grade C, repair within 60 days), which is the notebook's Day 1 record but not what the with-memory answer quotes.
3. **3.16 Where both labs meet.** The page says the Lab 2 rule is a 25 percent limit and that over 25 percent needs an immediate structural review. In the notebook the Day 1 finding is severity medium, grade C, repair within 60 days; nothing in Lab 3 says immediate structural review.
4. **3.17 recap and 3.15c.** The recap's three messages (memory is the foundation, context is curation, one converged store) are the story's, not the notebook's "Key takeaways" table (six layers: auto-extracted records, CITY_ASSET, CITY_INSPECTION_FINDING, context card, asset-pooled search, scoping). 3.15c (kinds of memory) is not the notebook's "Memory types" table (fact is semantic, preference is persona, guideline is procedural, memory is working).
5. **Left out of the code map** (not wrong, but a presenter running the notebook will meet them): Part 1's optional reset (cell 9), the `view_memories()` helper (cell 24), the `get_context_card` demo (cells 51 to 52), Day 1's afternoon follow-up `call_copilot` (cell 59), the memory log after Day 1 and Day N (cells 60, 65), "Did Mercer's turn leave a guideline?" (cells 61 to 62), the Compare cell (cell 67, shown as page 3.15).
6. **The opening story pages (3.2f to 3.3b)** use the story's wording (turn 15, the glass), not notebook output; they claim nothing the notebook prints, but the four glass chips say Part 3, Part 4, Part 4, Part 6 for Volume, Relevance, Accuracy, Timing, which is the story's mapping, not the notebook's.
7. **Hidden pages 3.6 to 3.14a** (old per-Part pages, in `LAB3_CUT`) still carry the Part and TODO labels of an earlier draft; they are not in the show.
