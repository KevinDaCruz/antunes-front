// Pré-rendu des pages publiques, lancé après `vite build` (npm run build).
// Chaque page reçoit son HTML, son titre, sa description, son URL canonique
// et ses données structurées. Les autres adresses (fiche produit, compte…)
// reçoivent shell.html, la coquille vide de l'application.
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ORIGIN = "https://antunes-front.vercel.app";
const PAGES = ["/", "/catalog", "/mentions-legales", "/confidentialite"];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const serverEntry = join(root, "dist-prerender", "entry-prerender.js");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildPage(template, url, { html, head }) {
  const tags = [`<link rel="canonical" href="${ORIGIN}${url}" />`];

  if (head.noIndex) {
    tags.push('<meta name="robots" content="noindex, nofollow" />');
  }
  if (head.structuredDataJson) {
    // Même identifiant que SeoHead, qui remplacera ce bloc côté client.
    tags.push(
      `<script id="seo-structured-data" type="application/ld+json">${head.structuredDataJson.replaceAll("<", "\\u003c")}</script>`,
    );
  }

  return template
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(head.title)}</title>`,
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${escapeHtml(head.description)}$2`,
    )
    .replace("</head>", `  ${tags.join("\n    ")}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

// La page pré-rendue s'affiche avant le JavaScript : on précharge la police
// pour éviter que le texte ne se réorganise à son arrivée (décalage CLS).
const fontFile = (await readdir(join(dist, "assets"))).find((name) =>
  /^archivo-latin-wght-normal-.*\.woff2$/.test(name),
);
const fontPreload = fontFile
  ? `<link rel="preload" href="/assets/${fontFile}" as="font" type="font/woff2" crossorigin />\n  `
  : "";
const template = (await readFile(join(dist, "index.html"), "utf8")).replace(
  "</head>",
  `  ${fontPreload}</head>`,
);
await writeFile(join(dist, "shell.html"), template);

const { render } = await import(pathToFileURL(serverEntry).href);

for (const url of PAGES) {
  const page = buildPage(template, url, await render(url, ORIGIN));
  const target =
    url === "/" ? join(dist, "index.html") : join(dist, url, "index.html");

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, page);
  console.log(`pré-rendu ${url}`);
}

await rm(join(root, "dist-prerender"), { recursive: true, force: true });
