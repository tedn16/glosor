# Glosor

Lägg en `.md`-fil per glosförhör här. Filnamn: `v<vecka>-<kebab-titel>.md`.

## Format

```markdown
---
title: The magic key
week: 21
---

| English | Svenska |
|---------|---------|
| magic   | magisk  |
| key     | nyckel  |
```

**Regler:**

- `title` och `week` är obligatoriska i frontmatter
- Tabellen måste ha exakt två kolumner: engelska först, svenska sen
- Rubrikraden (`| English | Svenska |`) och separator-raden (`|---|---|`) hoppas över automatiskt
- Tomma rader och blanksteg runt orden tas bort

## Lägg till en ny läxa

1. Skapa `vXX-titeln.md` i den här mappen
2. Pusha till `main`
3. GitHub Actions bygger om och publicerar automatiskt
