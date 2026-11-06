# PizzaTool

PizzaTool beregner ingredienser til pizzadej ud fra opskrift, antal pizzaer og
dejvægt. Vælg mellem italienske opskrifter, New York Style og Bagerkokkens corner.
Opskrifterne er baseret på PizzaTool v14.6 af Torben Holm Kristensen.

## Kør lokalt

Brug Node.js 22.12 eller nyere, eller Node.js 20 fra version 20.19.

```sh
npm ci
npm run dev
```

Åbn den lokale adresse, Vite viser i terminalen.

## Byg og udgiv

```sh
npm run build
npm run preview
```

Bygget ligger i `dist/`. Brug preview-kommandoen til at prøve bygget lokalt.
Udgiv indholdet af `dist/` på en statisk webserver. De relative stier virker
også under en undermappe som `/pizzatool/` på GitHub Pages.

## Sprog

Tekster til brugerfladen ligger i `src/da.js`. Opskriftsdata ligger i `src/recipes.js`, og
fremgangsmåderne ligger i `src/methods.js`.

## Test og automatisk udgivelse

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browserprøverne kører mod produktionsbygget. GitHub Actions kører begge
testsuiter og bygger siden ved pull requests til `main` og ved pushes til
`main`. Når alle kontroller består på `main`, udgiver workflowet det testede
`dist/`-byg til GitHub Pages. Vælg **GitHub Actions** som kilde under
**Settings → Pages**.
