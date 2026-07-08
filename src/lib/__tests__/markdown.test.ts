import fs from 'fs';
import path from 'path';
import { getMarkdownContent, getMarkdownSlugs } from '../markdown';

// Mock filesystem untuk pengujian
jest.mock('fs');
jest.mock('path');
jest.mock('gray-matter');
jest.mock('remark');

describe('Markdown Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default join mock
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  describe('getMarkdownContent', () => {
    it('harus membaca dan memparsing file Markdown', async () => {
      const mockFrontmatter = { title: 'Test', slug: 'test' };
      const mockContent = '# Hello World';
      const mockHtml = '<h1>Hello World</h1>';

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(
        `---\ntitle: Test\nslug: test\n---\n${mockContent}`,
      );

      // Mock gray-matter
      const matterMock = require('gray-matter');
      matterMock.mockReturnValue({ data: mockFrontmatter, content: mockContent });

      // Mock remark chain
      const remarkMock = require('remark');
      const useMock = jest.fn().mockReturnThis();
      const processMock = jest.fn().mockResolvedValue({ toString: () => mockHtml });
      remarkMock.mockReturnValue({ use: useMock, process: processMock });

      const result = await getMarkdownContent('projects', 'test');

      expect(result.data).toEqual(mockFrontmatter);
      expect(result.contentHtml).toBe(mockHtml);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('test.md'),
        'utf8',
      );
    });

    it('harus throw error jika file tidak ditemukan', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      await expect(getMarkdownContent('missing', 'file')).rejects.toThrow(
        'File Markdown tidak ditemukan',
      );
    });
  });

  describe('getMarkdownSlugs', () => {
    it('harus mengembalikan daftar slug dari file MD', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue([
        'project-a.md',
        'project-b.md',
        'readme.txt',
      ]);

      const slugs = getMarkdownSlugs('projects');
      expect(slugs).toEqual(['project-a', 'project-b']);
    });

    it('harus mengembalikan array kosong jika folder tidak ada', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const slugs = getMarkdownSlugs('nonexistent');
      expect(slugs).toEqual([]);
    });
  });
});