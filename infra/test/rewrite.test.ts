import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const src = readFileSync(new URL('../functions/rewrite.js', import.meta.url), 'utf8');
const handler = new Function(`${src}; return handler;`)() as (e: unknown) => { uri: string };
const rewrite = (uri: string) => handler({ request: { uri } }).uri;

describe('docs rewrite', () => {
  it('appends index.html to directory URIs', () => {
    expect(rewrite('/')).toBe('/index.html');
    expect(rewrite('/guide/')).toBe('/guide/index.html');
    expect(rewrite('/a/b/')).toBe('/a/b/index.html');
  });
  it('rewrites extensionless URIs', () => {
    expect(rewrite('/guide')).toBe('/guide/index.html');
    expect(rewrite('/a/b')).toBe('/a/b/index.html');
  });
  it('leaves URIs with an extension untouched', () => {
    for (const u of ['/guide.md', '/llms.txt', '/llms-full.txt', '/_astro/x.abc.css', '/a/b/index.html', '/favicon.svg', '/sitemap-index.xml']) {
      expect(rewrite(u)).toBe(u);
    }
  });
});
