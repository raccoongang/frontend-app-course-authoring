import { getConfig, getPath } from '@edx/frontend-platform';

import { getFileSizeToClosestByte, createCorrectInternalRoute, deepSortObject } from './utils';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  ensureConfig: jest.fn(),
  getPath: jest.fn(),
}));

describe('FilesAndUploads utils', () => {
  describe('getFileSizeToClosestByte', () => {
    it('should return file size with B for bytes', () => {
      const expectedSize = '219.00 B';
      const actualSize = getFileSizeToClosestByte(219);
      expect(expectedSize).toEqual(actualSize);
    });
    it('should return file size with KB for kilobytes', () => {
      const expectedSize = '21.90 KB';
      const actualSize = getFileSizeToClosestByte(21900);
      expect(expectedSize).toEqual(actualSize);
    });
    it('should return file size with MB for megabytes', () => {
      const expectedSize = '2.19 MB';
      const actualSize = getFileSizeToClosestByte(2190000);
      expect(expectedSize).toEqual(actualSize);
    });
    it('should return file size with GB for gigabytes', () => {
      const expectedSize = '2.03 GB';
      const actualSize = getFileSizeToClosestByte(2034190000);
      expect(expectedSize).toEqual(actualSize);
    });
    it('should return file size with TB for terabytes', () => {
      const expectedSize = '1.99 TB';
      const actualSize = getFileSizeToClosestByte(1988034190000);
      expect(expectedSize).toEqual(actualSize);
    });
    it('should return file size with TB for larger numbers', () => {
      const expectedSize = '1234.56 TB';
      const actualSize = getFileSizeToClosestByte(1234560000000000);
      expect(expectedSize).toEqual(actualSize);
    });
  });
  describe('createCorrectInternalRoute', () => {
    beforeEach(() => {
      getConfig.mockReset();
      getPath.mockReset();
    });

    it('returns the correct internal route when checkPath is not prefixed with basePath', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: 'example.com' });
      getPath.mockReturnValue('/');

      const checkPath = '/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/some/path');
    });

    it('returns the input checkPath when it is already prefixed with basePath', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: 'example.com' });
      getPath.mockReturnValue('/course-authoring');

      const checkPath = '/course-authoring/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/course-authoring/some/path');
    });

    it('handles basePath ending with a slash correctly', () => {
      getConfig.mockReturnValue({ PUBLIC_PATH: 'example.com/' });
      getPath.mockReturnValue('/course-authoring/');

      const checkPath = '/some/path';
      const result = createCorrectInternalRoute(checkPath);

      expect(result).toBe('/course-authoring/some/path');
    });
  });
  describe('deepSortObject', () => {
    it('should deep sort an object with nested properties', () => {
      const unsortedObject = {
        z: 1,
        b: {
          c: 3,
          a: 2,
        },
        d: [4, 1, 3, 2],
        e: 'hello',
      };

      const sortedObject = deepSortObject(unsortedObject);

      const expectedSortedObject = {
        b: {
          a: 2,
          c: 3,
        },
        d: [1, 2, 3, 4],
        e: 'hello',
        z: 1,
      };

      expect(sortedObject).toEqual(expectedSortedObject);
    });
    it('should handle arrays and other types correctly', () => {
      const unsortedObject = {
        z: 1,
        b: {
          c: 3,
          a: 2,
        },
        d: [4, 1, 3, 2],
        e: 'hello',
        f: true,
      };

      const sortedObject = deepSortObject(unsortedObject);

      const expectedSortedObject = {
        b: {
          a: 2,
          c: 3,
        },
        d: [1, 2, 3, 4],
        e: 'hello',
        f: true,
        z: 1,
      };

      expect(sortedObject).toEqual(expectedSortedObject);
    });
    it('should not modify the original object', () => {
      const unsortedObject = {
        z: 1,
        b: {
          c: 3,
          a: 2,
        },
        d: [4, 1, 3, 2],
        e: 'hello',
      };
      const sortedObject = deepSortObject(unsortedObject);

      expect(sortedObject).not.toBe(unsortedObject);
    });
  });
});
