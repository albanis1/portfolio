import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getAllProjects, getAllCategories, getProjectBySlug, getAllProjectSlugs } from '../projects';

// Mock fs and path modules
vi.mock('fs');
vi.mock('path');

const mockReadDirSync = vi.fn();
const mockReadFileSync = vi.fn();
const mockExistsSync = vi.fn();
const mockJoin = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  (path as any).join = mockJoin;
  mockJoin.mockImplementation((...args: string[]) => args.join('/'));

  (fs as any).readdirSync = mockReadDirSync;
  (fs as any).readFileSync = mockReadFileSync;
  (fs as any).existsSync = mockExistsSync;
});

describe('getAllProjects', () => {
  it('returns empty array if directory does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    const result = getAllProjects();
    expect(result).toEqual([]);
  });

  it('returns parsed project metadata from markdown files', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['proj1.md', 'other.txt', 'proj2.md']);

    mockReadFileSync
      .mockReturnValueOnce(`---
title: Project One
slug: project-one
description: First project
category: frontend
tags:
  - React
  - TypeScript
image: /img/p1.png
featured: true
---`)
      .mockReturnValueOnce(`---
title: Project Two
slug: project-two
description: Second project
category: backend
tags:
  - Go
featured: false
---`);

    const result = getAllProjects();
    expect(result).toHaveLength(2);
    // Featured should be first
    expect(result[0].slug).toBe('project-one');
    expect(result[0].featured).toBe(true);
    expect(result[0].tags).toEqual(['React', 'TypeScript']);
    expect(result[1].slug).toBe('project-two');
    expect(result[1].featured).toBe(false);
    expect(result[1].tags).toEqual(['Go']);
  });

  it('filter by category correctly', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['a.md', 'b.md']);
    mockReadFileSync
      .mockReturnValueOnce(`---
title: A
slug: a
category: frontend
tags: []
---`)
      .mockReturnValueOnce(`---
title: B
slug: b
category: backend
tags: []
---`);

    const result = getAllProjects('frontend');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('a');
  });

  it('handles missing frontmatter fields gracefully', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['minimal.md']);
    mockReadFileSync.mockReturnValueOnce(`---
slug: minimal
---`);

    const result = getAllProjects();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Untitled');
    expect(result[0].description).toBe('');
    expect(result[0].category).toBe('uncategorized');
    expect(result[0].tags).toEqual([]);
    expect(result[0].image).toBe('/images/placeholder.png');
    expect(result[0].featured).toBe(false);
  });
});

describe('getAllCategories', () => {
  it('returns unique categories from projects', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['a.md', 'b.md', 'c.md']);
    mockReadFileSync
      .mockReturnValueOnce(`---
title: A
slug: a
category: frontend
tags: []
---`)
      .mockReturnValueOnce(`---
title: B
slug: b
category: backend
tags: []
---`)
      .mockReturnValueOnce(`---
title: C
slug: c
category: frontend
tags: []
---`);

    const result = getAllCategories();
    expect(result).toHaveLength(2);
    expect(result.sort()).toEqual(['backend', 'frontend']);
  });
});

describe('getAllProjectSlugs', () => {
  it('returns all slugs from project files', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['x.md', 'y.md']);
    mockReadFileSync
      .mockReturnValueOnce(`---
title: X Proj
slug: x-proj
---`)
      .mockReturnValueOnce(`---
title: Y Proj
slug: y-proj
---`);

    const result = getAllProjectSlugs();
    expect(result).toEqual(['x-proj', 'y-proj']);
  });

  it('generates slug from title if slug missing', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['test.md']);
    mockReadFileSync.mockReturnValueOnce(`---
title: My Awesome Project
---`);

    const result = getAllProjectSlugs();
    expect(result).toEqual(['my-awesome-project']);
  });

  it('returns empty array if no directory', () => {
    mockExistsSync.mockReturnValue(false);
    const result = getAllProjectSlugs();
    expect(result).toEqual([]);
  });
});

describe('getProjectBySlug', () => {
  it('returns null if directory does not exist', async () => {
    mockExistsSync.mockReturnValue(false);
    const result = await getProjectBySlug('any');
    expect(result).toBeNull();
  });

  it('returns project detail by slug', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['detail.md']);
    mockReadFileSync.mockReturnValue(`---
title: Detail Project
slug: detail-project
description: A detailed project
category: fullstack
tags:
  - Next.js
  - Go
image: /img/detail.png
images:
  - /img/d1.png
  - /img/d2.png
demoUrl: https://demo.example.com
repoUrl: https://repo.example.com
featured: true
---
# Project Content

This is the detailed description.`);

    const result = await getProjectBySlug('detail-project');
    expect(result).not.toBeNull();
    expect(result!.title).toBe('Detail Project');
    expect(result!.slug).toBe('detail-project');
    expect(result!.description).toBe('A detailed project');
    expect(result!.category).toBe('fullstack');
    expect(result!.tags).toEqual(['Next.js', 'Go']);
    expect(result!.images).toEqual(['/img/d1.png', '/img/d2.png']);
    expect(result!.demoUrl).toBe('https://demo.example.com');
    expect(result!.repoUrl).toBe('https://repo.example.com');
    expect(result!.featured).toBe(true);
    expect(result!.contentHtml).toContain('<h1>Project Content</h1>');
    expect(result!.contentHtml).toContain('This is the detailed description.');
  });

  it('returns null if slug not found', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['existing.md']);
    mockReadFileSync.mockReturnValue(`---
title: Existing
slug: existing
---`);

    const result = await getProjectBySlug('non-existent');
    expect(result).toBeNull();
  });

  it('sanitizes HTML from content', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadDirSync.mockReturnValue(['unsafe.md']);
    mockReadFileSync.mockReturnValue(`---
title: Unsafe
slug: unsafe
---
<script>alert("XSS")</script>
<p>Safe content</p>`);

    const result = await getProjectBySlug('unsafe');
    expect(result).not.toBeNull();
    // The script tag should have been sanitized by rehype-sanitize
    expect(result!.contentHtml).not.toContain('<script>');
    expect(result!.contentHtml).toContain('Safe content');
  });
});