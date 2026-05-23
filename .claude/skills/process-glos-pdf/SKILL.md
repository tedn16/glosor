---
name: process-glos-pdf
description: >
  Process a scanned weekly glos PDF in the project root and add it as a markdown
  file to the /glosor folder. Trigger when the user says things like "process the
  scanned glos PDF", "add the new glosor", "process Scanned_*.pdf", or refers to
  a newly added scanned weekly vocabulary file.
---

## Overview

This project (`engelska-glosor`) is a Svelte quiz app that loads weekly English/Swedish
vocabulary lists from `glosor/*.md`. Each week the user scans a paper handout from
school as `Scanned_YYYYMMDD-HHMM.pdf` in the project root. This skill converts that
PDF into the markdown format the app expects.

## Workflow

1. **Identify the PDF.** If the user named one, use that. Otherwise list
   `Scanned_*.pdf` in the project root and pick the newest (or ask if ambiguous).

2. **Read the PDF.** Use the `Read` tool — it returns the rendered pages as
   document content blocks, so the table of word pairs is directly visible. The
   handouts have:
   - A title like `Glosor till "The dragon tree"` (extract the quoted part as the
     `title`)
   - A two-column table: English on the left, Svenska on the right
   - A `Namn:` field at the bottom — ignore it

3. **Determine the week number.** List existing files in `glosor/` matching
   `v<NN>-*.md` and take the highest `<NN>` + 1. Do NOT compute it from the
   scan date — the user may scan a PDF for a future or past week. If the next
   sequential number looks wrong (e.g. there's a gap, or the user implied a
   specific week), ask.

4. **Build the filename.** `glosor/v<week>-<kebab-title>.md` where the title is
   lowercased, diacritics stripped, non-alphanumerics collapsed to `-`.
   Example: `The dragon tree` → `v22-the-dragon-tree.md`.

5. **Write the markdown** in the exact format `glosor/README.md` specifies:

   ```markdown
   ---
   title: <Title as written on the handout>
   week: <number>
   ---

   | English | Svenska |
   |---------|---------|
   | ...     | ...     |
   ```

   - Preserve the original casing of the words from the PDF.
   - Preserve Swedish diacritics (å, ä, ö) exactly.
   - Align the table columns with spaces so it stays readable when edited by hand.

6. **Show the full list to the user** as a markdown table in chat so they can
   spot OCR/transcription mistakes.

7. **Ask the user to confirm** before committing. Phrasing like
   "Looks good? Reply 'commit' to commit and push." If they confirm, stage only
   the new file, commit with a message like `Add week <N> glosor: <Title>`, and
   push to `main`. Do NOT amend or force-push. Do NOT delete the PDF — the user
   keeps it.

## Notes and gotchas

- Word pairs may include multi-word phrases on either side (e.g. `picked up` /
  `plockade upp`). Keep them as a single cell.
- OCR sometimes corrupts Swedish letters. If a Swedish word looks suspicious,
  flag it in the review output rather than silently "fixing" it.
- The handout title is usually in the form `Glosor till "<title>"`. Strip the
  `Glosor till` prefix and the surrounding quotes.
- The build pipeline picks up new files automatically on push — no app code needs
  to change.

## Format reference

See `glosor/README.md` for the canonical format spec. If that file's rules
conflict with this skill, the README wins.
