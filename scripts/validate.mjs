// Validation de syntaxe pour les repos de scripts et de documentation.
// Échoue sur : erreur de syntaxe TypeScript/JavaScript, JSON invalide, YAML invalide (via python), Python invalide (via python).
// Avertit (sans échouer) sur : liens relatifs brisés dans les fichiers Markdown.
// Usage : node validate.mjs <racine> [regex-exclusion]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(process.argv[2] || '.');
const exclude = new RegExp(process.argv[3] || '^$');
const ALWAYS_SKIP = /(^|\/)(\.git|node_modules|vendor|dist|build|bin|obj|\.venv|__pycache__)(\/|$)/;
const require = createRequire(path.join(process.cwd(), 'noop.js'));
const ts = require('typescript');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = path.relative(root, full).split(path.sep).join('/');
    if (ALWAYS_SKIP.test(rel) || exclude.test(rel)) continue;
    if (e.isDirectory()) walk(full, out); else out.push(rel);
  }
  return out;
}

const files = walk(root);
let errors = 0, warnings = 0;
const err = (f, line, msg) => { errors++; console.log(`::error file=${f}${line ? `,line=${line}` : ''}::${msg}`); };
const warn = (f, line, msg) => { warnings++; console.log(`::warning file=${f}${line ? `,line=${line}` : ''}::${msg}`); };
const count = {};
const inc = (k) => (count[k] = (count[k] || 0) + 1);

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const abs = path.join(root, f);
  if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'].includes(ext)) {
    if (f.endsWith('.min.js')) continue;
    inc('ts/js');
    const src = fs.readFileSync(abs, 'utf8');
    const kind = ext.includes('x') ? ts.ScriptKind.TSX : ext.startsWith('.t') || ext.startsWith('.mt') || ext.startsWith('.ct') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
    const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, kind);
    for (const d of sf.parseDiagnostics || []) {
      const { line } = sf.getLineAndCharacterOfPosition(d.start || 0);
      err(f, line + 1, `Erreur de syntaxe : ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
    }
  } else if (ext === '.json') {
    inc('json');
    const src = fs.readFileSync(abs, 'utf8').replace(/^﻿/, '');
    if (/(^|\/)(tsconfig|jsconfig)[^/]*\.json$|\.jsonc$/.test(f)) continue;
    try { JSON.parse(src); } catch (e) { err(f, 0, `JSON invalide : ${e.message}`); }
  } else if (ext === '.md') {
    inc('md');
    const src = fs.readFileSync(abs, 'utf8');
    const lines = src.split('\n');
    let inFence = false;
    lines.forEach((l, i) => {
      if (/^\s*(```|~~~)/.test(l)) inFence = !inFence;
      if (inFence) return;
      for (const m of l.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        let target = m[1];
        if (/^(https?:|mailto:|tel:|#|data:)/i.test(target) || target.includes('<') || target.includes('{')) continue;
        target = decodeURIComponent(target.split('#')[0].split('?')[0]);
        if (!target) continue;
        const resolved = target.startsWith('/') ? path.join(root, target) : path.join(path.dirname(abs), target);
        if (!fs.existsSync(resolved)) warn(f, i + 1, `Lien brisé : ${m[1]}`);
      }
    });
  }
}

// Python et YAML : vérifiés par python (présent sur les runners GitHub)
const py = files.filter((f) => f.endsWith('.py'));
const yml = files.filter((f) => /\.(ya?ml)$/i.test(f));
if (py.length || yml.length) {
  const checker = `
import sys, py_compile, json
try:
    import yaml
except ImportError:
    yaml = None
root = sys.argv[1]
res = []
for f in json.loads(sys.argv[2]):
    try:
        py_compile.compile(f"{root}/{f}", doraise=True)
    except py_compile.PyCompileError as e:
        res.append([f, 0, "Erreur de syntaxe Python : " + str(e.msg).strip().splitlines()[-1]])
for f in json.loads(sys.argv[3]):
    if yaml is None: break
    try:
        with open(f"{root}/{f}", encoding="utf-8") as h:
            list(yaml.safe_load_all(h))
    except Exception as e:
        line = getattr(getattr(e, "problem_mark", None), "line", -1) + 1
        res.append([f, line, "YAML invalide : " + str(e).splitlines()[0]])
print(json.dumps(res))
`;
  const args = ['-c', checker, root, JSON.stringify(py), JSON.stringify(yml)];
  const out = execFileSync(process.env.PYTHON || 'python3', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  for (const [f, line, msg] of JSON.parse(out)) err(f, line, msg);
  count.python = py.length; count.yaml = yml.length;
}

console.log(`Fichiers vérifiés : ${Object.entries(count).map(([k, v]) => `${k}=${v}`).join(', ') || 'aucun'}`);
console.log(`${errors} erreur(s), ${warnings} avertissement(s)`);
process.exit(errors ? 1 : 0);
