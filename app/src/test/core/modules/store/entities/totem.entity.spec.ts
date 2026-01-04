import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('Totem Entity', () => {
  describe('create', () => {
    it('should create a new totem with valid data', () => {
      // Given
      const name = 'Totem 1';
      const storeId = 'store-123';

      // When
      const result = Totem.create({ name, storeId });

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.name).toBe(name);
      expect(result.value!.storeId).toBe(storeId);
      expect(result.value!.id).toBeDefined();
      expect(result.value!.tokenAccess).toBeDefined();
      expect(result.value!.createdAt).toBeInstanceOf(Date);
    });

    it('should return error when name is empty', () => {
      // Given
      const name = '';
      const storeId = 'store-123';

      // When
      const result = Totem.create({ name, storeId });

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });

    it('should return error when storeId is empty', () => {
      // Given
      const name = 'Totem 1';
      const storeId = '';

      // When
      const result = Totem.create({ name, storeId });

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });
  });

  describe('restore', () => {
    it('should restore a totem with valid data', () => {
      // Given
      const props = {
        id: 'totem-123',
        name: 'Totem 1',
        tokenAccess: 'token-abc',
        createdAt: new Date(),
        storeId: 'store-123',
      };

      // When
      const result = Totem.restore(props);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.id).toBe(props.id);
      expect(result.value!.name).toBe(props.name);
      expect(result.value!.tokenAccess).toBe(props.tokenAccess);
      expect(result.value!.createdAt).toBe(props.createdAt);
      expect(result.value!.storeId).toBe(props.storeId);
    });

    it('should return error when id is missing', () => {
      // Given
      const props = {
        id: '',
        name: 'Totem 1',
        tokenAccess: 'token-abc',
        createdAt: new Date(),
        storeId: 'store-123',
      };

      // When
      const result = Totem.restore(props);

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });

    it('should return error when tokenAccess is missing', () => {
      // Given
      const props = {
        id: 'totem-123',
        name: 'Totem 1',
        tokenAccess: '',
        createdAt: new Date(),
        storeId: 'store-123',
      };

      // When
      const result = Totem.restore(props);

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });
  });

  describe('getters', () => {
    it('should return correct property values', () => {
      // Given
      const props = {
        id: 'totem-123',
        name: 'Totem 1',
        tokenAccess: 'token-abc',
        createdAt: new Date(),
        storeId: 'store-123',
      };
      const result = Totem.restore(props);

      // When
      const totem = result.value!;

      // Then
      expect(totem.id).toBe(props.id);
      expect(totem.name).toBe(props.name);
      expect(totem.tokenAccess).toBe(props.tokenAccess);
      expect(totem.createdAt).toBe(props.createdAt);
      expect(totem.storeId).toBe(props.storeId);
    });
  });
});
