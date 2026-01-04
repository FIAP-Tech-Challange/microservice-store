import { generateUUID } from 'src/core/common/utils/uuid.helper';

describe('UUID Helper', () => {
  describe('generateUUID', () => {
    it('should return a string', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
    });

    it('should return a valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidV4Regex);
    });

    it('should have the correct length (36 characters including hyphens)', () => {
      const uuid = generateUUID();
      expect(uuid).toHaveLength(36);
    });

    it('should generate unique UUIDs on consecutive calls', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      const uuid3 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
      expect(uuid2).not.toBe(uuid3);
      expect(uuid1).not.toBe(uuid3);
    });

    it('should generate 100 unique UUIDs without collisions', () => {
      const uuids = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        uuids.add(generateUUID());
      }

      expect(uuids.size).toBe(iterations);
    });

    it('should contain hyphens in the correct positions', () => {
      const uuid = generateUUID();
      expect(uuid[8]).toBe('-');
      expect(uuid[13]).toBe('-');
      expect(uuid[18]).toBe('-');
      expect(uuid[23]).toBe('-');
    });

    it('should have version 4 indicator in the correct position', () => {
      const uuid = generateUUID();
      // The 15th character (index 14) should be '4' for UUID v4
      expect(uuid[14]).toBe('4');
    });

    it('should have variant indicator in the correct position', () => {
      const uuid = generateUUID();
      // The 20th character (index 19) should be 8, 9, a, or b (RFC 4122 variant)
      const variantChar = uuid[19].toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });
});
