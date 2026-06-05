import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

function filesUnder(path: string): string[] {
  return readdirSync(path).flatMap((entry) => {
    const fullPath = join(path, entry);
    return statSync(fullPath).isDirectory() ? filesUnder(fullPath) : [fullPath];
  });
}

describe('architecture', () => {
  it('organizes routes with clean architecture layers', () => {
    for (const layer of ['domain', 'application', 'infrastructure', 'api']) {
      expect(statSync(join('src', 'routes', layer)).isDirectory()).toBe(true);
    }
  });

  it('keeps route domain independent from frameworks and outer layers', () => {
    for (const file of filesUnder(join('src', 'routes', 'domain')).filter((item) => item.endsWith('.ts'))) {
      const source = readFileSync(file, 'utf8');
      expect(source, relative(process.cwd(), file)).not.toMatch(/@nestjs|mongodb|infrastructure|\/api|config/);
    }
  });

  it('keeps route application use cases independent from MongoDB adapters and controllers', () => {
    for (const file of filesUnder(join('src', 'routes', 'application')).filter((item) => item.endsWith('.ts'))) {
      const source = readFileSync(file, 'utf8');
      expect(source, relative(process.cwd(), file)).not.toMatch(/mongodb|mongo-route|infrastructure|\/api|controller/);
    }
  });
});
