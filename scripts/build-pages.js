import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { articles, extras } from '../src/extras.js';
import { recipes } from '../src/recipes.js';

const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
const paths = [
  ...recipes.map(({ id }) => ['opskrift', id]),
  ...extras.flatMap(({ id }) => [
    ['oevrigt', id],
    ...(articles[id] ?? []).map((article) => ['oevrigt', id, article.id]),
  ]),
];

// Pages serves a directory's index.html for each direct URL.
for (const path of paths) {
  const folder = new URL(path.join('/') + '/', dist);
  const relativeAssets = '../'.repeat(path.length) + 'assets/';
  await mkdir(folder, { recursive: true });
  await writeFile(new URL('index.html', folder), html.replaceAll('./assets/', relativeAssets));
}
