# Demo floor plan sources

Real, publicly documented floor plans used to test Myriox — none of these were AI-generated.
Each was traced (not auto-parsed) into a Myriox grid plan via the reference-image overlay in
`/dashboard/editor/new`. Exact provenance and license below so this is fully auditable.

| File | Building | Source | License |
|---|---|---|---|
| `library-1885.jpg` | Floor plan for a small public library (1885) | Library of Congress, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Floor_plan_for_a_small_public_library_LCCN2007682638.jpg); original scan: https://cdn.loc.gov/service/pnp/ppmsca/15500/15576v.jpg | Public domain (US, pre-1931 publication) |
| `museum-chemtou.svg` | Plan of the Archaeological Museum of Chemtou | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_de_Chemtou_-_plan.svg), by Martin Hartmann, Christoph B. Rüger & Hartmut Jentzsch; reproduction by Coyau | CC BY-SA 3.0 — attribution required, see link above |
| `house-murphy.png` | The Murphy House (now Elks Club), Montgomery, AL — 1st floor plan (dining room, library, hall, vestibule, sitting/reception room, porch, stair to 2nd floor) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Murphy_House_interior_plan.PNG), Historic American Buildings Survey (HABS), drawn by Walter L. Harrison, 1934 | Public domain (US federal government work / NPS) |

Downloaded 19 July 2026 for the OpenAI Codex Hackathon submission. Used here strictly as a
tracing reference inside the Myriox grid editor — no modification to the original files
beyond format conversion for the CC BY-SA file (attribution preserved above per the license).

Note: an initial candidate (a University Hospital for Children campus map from Wikimedia
Commons) was dropped after review — it's an isometric campus/site map, not a per-room indoor
floor plan with walls/doors/corridors, so it wasn't a fair test of the grid editor. Swapped
for the Murphy House HABS plan instead, which has real rooms, walls, doors, and a staircase.
