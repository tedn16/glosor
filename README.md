# Engelska glosor

En liten static web app för att öva på engelska/svenska glosor. Glosförhör läggs upp som markdown-filer i `glosor/`. Byggd med Svelte + Vite, deployas automatiskt till GitHub Pages.

## Funktioner

- 📝 Två lägen: **Skriv svar** eller **Välj rätt** (4 alternativ)
- 🔁 Två riktningar: engelska → svenska eller svenska → engelska
- 📱 Mobilvänlig (stort typsnitt, stora knappar, ingen iOS-zoom)
- 🌙 Mörkt läge följer systemet
- 📄 Nya läxor = ny `.md`-fil i `glosor/` + push

## Kom igång lokalt

```bash
npm install
npm run dev
```

Öppna http://localhost:5173.

## Lägg till en ny glosläxa

1. Skapa `glosor/v<vecka>-<titel>.md`, t.ex. `glosor/v22-clothes.md`:

   ```markdown
   ---
   title: Clothes
   week: 22
   ---

   | English | Svenska |
   |---------|---------|
   | shirt   | skjorta |
   | hat     | hatt    |
   ```

2. Pusha till `main`. GitHub Actions bygger om och publicerar.

Se `glosor/README.md` för mer om formatet.

## Deploy till GitHub Pages

1. Repot ska heta `glosor` (eller ändra `base` i `vite.config.ts` så det matchar repo-namnet).
2. På GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Pusha till `main`. Workflowen i `.github/workflows/deploy.yml` bygger och publicerar.
4. Appen ligger på `https://<användarnamn>.github.io/glosor/`.

## Deploy till Azure Static Web Apps

`vite build` lägger statiska filer i `dist/`. Peka Azure SWA på `dist/` (output) och `npm run build` (build command). Sätt `VITE_BASE=/` i build-miljön så att assets serveras från roten.

## Stack

- Svelte 4 + Vite 5 + TypeScript
- Inga runtime-deps utöver Svelte — bundle ~30 kB gzip
- Markdown läses in vid build-tid via `import.meta.glob`

## Licens

[MIT](./LICENSE) — fri att använda, ändra och distribuera.
