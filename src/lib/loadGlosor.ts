import type { GlosaList, Word } from './types';

// Read all glosor/*.md files at build time as raw strings.
const modules = import.meta.glob('/glosor/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

interface Frontmatter {
  title?: string;
  week?: number;
}

function parseFrontmatter(source: string): { meta: Frontmatter; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: source };
  const [, yaml, body] = match;
  const meta: Frontmatter = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value: string = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key === 'week') {
      const n = Number(value);
      if (!Number.isNaN(n)) meta.week = n;
    } else if (key === 'title') {
      meta.title = value;
    }
  }
  return { meta, body };
}

function parsePipeTable(body: string, filePath: string): Word[] {
  const rows = body
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter((r) => r.startsWith('|') && r.endsWith('|'));

  if (rows.length < 2) {
    throw new Error(`[${filePath}] saknar pipe-tabell med minst en datarad`);
  }

  const words: Word[] = [];
  for (const row of rows) {
    const cells = row
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());

    if (cells.length !== 2) {
      throw new Error(`[${filePath}] rad har ${cells.length} kolumner, förväntat 2: "${row}"`);
    }
    // Skip header row (case-insensitive) and separator row (---)
    const isSeparator = cells.every((c) => /^:?-{2,}:?$/.test(c));
    const isHeader =
      /^(english|engelska)$/i.test(cells[0]) && /^(svenska|swedish)$/i.test(cells[1]);
    if (isSeparator || isHeader) continue;
    if (!cells[0] || !cells[1]) continue;

    words.push({ en: cells[0], sv: cells[1] });
  }

  if (words.length === 0) {
    throw new Error(`[${filePath}] tabellen innehöll inga glosor`);
  }
  return words;
}

function idFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.md$/, '');
}

export function loadAllGlosor(): GlosaList[] {
  const lists: GlosaList[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    if (path.endsWith('/README.md')) continue;
    const { meta, body } = parseFrontmatter(raw);
    if (!meta.title) throw new Error(`[${path}] saknar 'title' i frontmatter`);
    if (typeof meta.week !== 'number') throw new Error(`[${path}] saknar 'week' i frontmatter`);

    const words = parsePipeTable(body, path);
    lists.push({
      id: idFromPath(path),
      title: meta.title,
      week: meta.week,
      words,
    });
  }
  // Newest week first
  lists.sort((a, b) => b.week - a.week);
  return lists;
}
