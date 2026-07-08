import { getMarkdownContent, getMarkdownSlugs } from '../markdown';

// Mock filesystem untuk pengujian
jest.mock('fs');
jest.mock('path');
jest.mock('gray-matter');
jest.mock('remark');
jest.mock('remark-html');
jest.mock('rehype-sanitize');

describe('Markdown Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default join mock
    const path = require('path');
    path.join.mockImplementation((...args: string[]) => args.join('/'));
  });

  describe('getMarkdownContent', () => {
    it('harus membaca dan memparsing file Markdown dengan sanitasi', async () => {
      const mockFrontmatter = { title: 'Test', slug: 'test' };
      const mockContent = '# Hello World';
      const mockHtml = '<h1>Hello World</h1>';

      const fs = require('fs');
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(
        `---\ntitle: Test\nslug: test\n---\n${mockContent}`,
      );

      const matter = require('gray-matter');
      matter.mockReturnValue({ data: mockFrontmatter, content: mockContent });

      // Mock remark chain dengan dua .use() (html & rehype-sanitize)
      const useMock = jest.fn().mockReturnThis();
      const processMock = jest.fn().mockResolvedValue({ toString: () => mockHtml });
      const remark = require('remark');
      remark.mockReturnValue({ use: useMock, process: processMock });

      const result = await getMarkdownContent('projects', 'test');

      expect(result.data).toEqual(mockFrontmatter);
      expect(result.contentHtml).toBe(mockHtml);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('test.md'),
        'utf8',
      );
      expect(useMock).toHaveBeenCalledTimes(2);
    });

    it('harus throw error jika file tidak ditemukan', async () => {
      const fs = require('fs');
      fs.existsSync.mockReturnValue(false);
      await expect(getMarkdownContent('missing', 'file')).rejects.toThrow(
        'File Markdown tidak ditemukan',
      );
    });
  });

  describe('getMarkdownSlugs', () => {
    it('harus mengembalikan daftar slug dari file MD', () => {
      const fs = require('fs');
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['project-a.md', 'project-b.md', 'readme.txt']);

      const slugs = getMarkdownSlugs('projects');
      expect(slugs).toEqual(['project-a', 'project-b']);
    });

    it('harus mengembalikan array kosong jika folder tidak ada', () => {
      const fs = require('fs');
      fs.existsSync.mockReturnValue(false);
      const slugs = getMarkdownSlugs('nonexistent');
      expect(slugs).toEqual([]);
    });
  });
});