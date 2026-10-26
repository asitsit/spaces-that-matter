/**
 * IndexNow — signale aux moteurs (Bing, Yandex, Seznam… et donc ChatGPT Search / Copilot)
 * les pages nouvelles ou modifiées.
 *
 * Usage (après la mise en ligne sur Vercel) :
 *   node scripts/indexnow.mjs                 → toutes les URLs du sitemap.xml
 *   node scripts/indexnow.mjs /pages/faq.html → seulement les URLs indiquées
 *
 * La clé doit être servie à la racine du site : https://spacesthatmatter.com/<KEY>.txt
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = 'spacesthatmatter.com';
const KEY  = 'a59988c89a7cb7447a5f2fe47bdc7079';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map(u => (u.startsWith('http') ? u : `https://${HOST}${u.startsWith('/') ? '' : '/'}${u}`))
  : [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

// 200 = reçu, 202 = reçu (clé en cours de vérification) ; 403 = clé introuvable, 422 = URL hors domaine
console.log(`IndexNow : HTTP ${res.status} — ${urlList.length} URL(s) envoyée(s)`);
urlList.forEach(u => console.log(`  ${u}`));
if (res.status >= 300) process.exitCode = 1;
