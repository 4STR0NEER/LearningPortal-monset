# resources/

Drop zone for source material. Nothing in here is bundled into the app.
When something should ship, copy the final version into `src/assets/` (imported) or `public/` (served as-is).

| Folder | Put here | Ends up in the app as |
|---|---|---|
| `reference/screenshots/` | Screens of the existing LMS we are matching (e.g. the "TLE Tambayan" captures) | Layout guidance only |
| `reference/inspiration/` | Other UIs, moodboards, the palette photo | Design guidance only |
| `brand/logos/` | Client logo / seal, SVG preferred, PNG at 512px+ | `src/assets/` + path in `src/config/brand.js` |
| `brand/fonts/` | Licensed font files or a brand guide PDF | Font import in `src/index.css` |
| `content/courses/` | Syllabi, weekly topics, reading materials (docx, pdf, md) | Rows in `src/data/courses.js` (later: Supabase) |
| `content/media/` | Course images, videos, thumbnails | `public/media/` |
| `content/quizzes/` | Question banks (any format; a spreadsheet with question, choices, answer columns is easiest) | `src/data/quizzes.js` |
| `client/` | Proposal, requirements, notes in `meetings/` | Context for PRODUCT.md |
| `data/` | Sample spreadsheets: programs, course lists, anonymized enrollment counts | `src/data/*.js` |
| `private/` | Anything with real names, emails, grades. **Gitignored**, never committed | Nothing until anonymized |

Naming: `YYYY-MM-DD-short-name.ext` for anything dated (meetings, exports), plain kebab-case otherwise.
