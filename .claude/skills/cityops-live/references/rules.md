# The owner's rules (read before you change wording, colours, data or order)

These came from the owner over three weeks of review. They are the reason a colleague's change can be "wrong" even when the code is fine. `CLAUDE.md` in the repo root holds the long version with dates; this is the working summary.

## Content
- **The Jupyter notebooks are never modified.** `src/content/notebooks/*.json` are the owner's run notebooks (text, line numbers, execution counts, outputs). Show them as they are; never retype, shorten or "fix" a line.
- **Data names are exactly what the notebooks print**: `Harbor Bridge`, `Substation Gamma`, `Pipeline North-7`, `CITY_MESSAGE`, `CITY_MEMORY`, `CITY_INSPECTION_FINDING`, `CITY_ASSET`, `ALL_MINILM_L12_V2`. Set in JetBrains Mono.
- The inspectors are **"Mercer" and "Vance"** on screen and in scripts, never their full notebook names. (Inside the real notebook window the full names show: that window is untouched.)
- **"the AI agent"** (label "AI Agent"), never "copilot". Only the notebook's own names keep it (`call_copilot`, section titles, printed output).
- **The model is never named on screen**: "the language model", drawn as the neural-net picture.
- **No pier numbers** on screen: say "the crack" (Lab 2) and "the rust" (Lab 3).
- Never write "Kirkland", "MEA", "MWA" or "BMA". No "fictional scenario" tags.
- Lab 1's exercises are "Hands-on 1 to 5", never "Lab 2/3".
- Lab 3 attendees **run the complete notebook** (they do not write code): nothing on the code map says "you write".
- Memory analogy for Lab 3 is Lab 2's: the visit **notebook = short-term memory**, the bridge **logbook = long-term memory**. Never a desk, cabinet or librarian.
- Part numbering on the Lab 3 code map: the notebook's own Parts (1, 2, 3a/3b/3c, 4, 5, 6) and the days. TODO numbers never appear. (The sub-letters are CityOps's own; the notebook has Parts 1 to 6 only.)
- Hands-on / Lab 3 claims must match what the notebook actually printed: `docs/Lab3-notebook-audit-2026-11-10.md` lists the known gaps (page 12 and 16 wording, the recap).

## Look and motion ("elegant, a bit wow, not an RGB gamer")
- Background `#0B0E14`; Oracle Red `#C74634` (the only warm accent); core teal `#1B8A9C`; everything else cool greys. Fonts: Inter, Noto Sans Thai, JetBrains Mono.
- **Two colours talk**: teal for data and the database, Oracle Red for alerts and the **one** thing to look at. **Never more than one red element on screen.** Use teal bold for the key words in text (`**word**` in `Rich`), `!!word!!` for the one red.
- Stylised low-poly, thin glowing edges, soft bloom. No particle storms, no lens flares, no colour cycling, no spinning for its own sake, **no text in 3D**.
- Always one slow ambient motion, never busy. Every camera move eases (1.2 to 2.5 s); the overlay fades in only after the camera settles.
- **Space use matters**: the owner rejects pages with big empty areas, text that overflows or clips, tiny text next to huge boxes. Use `Fill`/`WidePanel`, make text and pictures as large as the panel allows, align things. Read the computed font sizes from a real render.
- **Oracle logos**: use the supplied "Oracle Autonomous AI Database 26ai" logo (`src/assets/oracle/autonomous-ai-database.png`, transparent background) in a white round badge on the teal database bar; never standalone and never the plain database icon where the logo is asked for.

## How a page is built
- **One page per idea, built up one part per Next** (`PAGE_STEPS`). A following page must never open looking like the end of the one before ("I need to click double"). Prefer revealing parts (`Reveal`, `useBuild`) to showing everything at once.
- Camera: five places only (`city`, `ops`, `bridge`, `pier3`, `pier2`); the camera moves only when the story changes place, otherwise it holds and the panel changes. Every city camera looks roughly north. Never show the sky or where the map ends (the exception: the `sky` stage).
- Pages are **hidden, never deleted** (`LAB2_CUT`, `LAB3_CUT`); taking an id out of the set brings it back. Git tag `lab2-59-pages` is the 59-page Lab 2.
- Camera angles the owner saved (`cameraOverrides.json`) and traffic (`traffic.json`) are the owner's: never overwrite without asking.

## How work is judged
- **Never judge a page from a wide shot.** Screenshot at full size, zoom in on text and edges, read the computed sizes, then say what you saw. "YOU MUST ALWAYS SANITY CHECK BY REAL RENDER AND SEE THE RESULT."
- Do not claim the 3D city was checked when the machine has no WebGL; say the panels were checked.
- A text edit that silently did not apply is the usual failure (a Python/sed replace that matched nothing): assert the replacement happened, then render.
- Colleagues review in the script manager and on the design canvas; read comments before changing a page and answer them in the thread when done.

## Safety and privacy
- Never print, write or commit the login password; it exists only as a hash in nginx's htpasswd. Never commit tokens, personal emails or the presenter's account name (cover them in screenshots: a black block over the email in the LiveLabs pictures).
- The follow relay's `follow/data/` (script versions, comments) is not in git: back it up.
- Offline: no runtime network calls from the app (the phone-follow sync is the one optional exception). Fonts and models are bundled.
