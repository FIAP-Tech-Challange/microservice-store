import { TotemPresenter } from 'src/core/modules/store/presenters/totem.presenter';
import { Totem } from 'src/core/modules/store/entities/totem.entity';

describe('TotemPresenter', () => {
  describe('toDto', () => {
    it('should convert totem entity to DTO successfully', () => {
      // Given
      const totemProps = {
        id: 'totem-123',
        name: 'Totem 1',
        storeId: 'store-123',
        tokenAccess: 'token-abc-123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      const totem = Totem.restore(totemProps).value!;

      // When
      const result = TotemPresenter.toDto(totem);

      // Then
      expect(result).toBeDefined();
      expect(result.id).toBe(totem.id);
      expect(result.name).toBe(totem.name);
      expect(result.tokenAccess).toBe(totem.tokenAccess);
    });

    it('should not include storeId in DTO', () => {
      // Given
      const totemProps = {
        id: 'totem-123',
        name: 'Totem 1',
        storeId: 'store-123',
        tokenAccess: 'token-abc-123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      const totem = Totem.restore(totemProps).value!;

      // When
      const result = TotemPresenter.toDto(totem);

      // Then
      expect(result).not.toHaveProperty('storeId');
    });

    it('should not include createdAt in DTO', () => {
      // Given
      const totemProps = {
        id: 'totem-123',
        name: 'Totem 1',
        storeId: 'store-123',
        tokenAccess: 'token-abc-123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      const totem = Totem.restore(totemProps).value!;

      // When
      const result = TotemPresenter.toDto(totem);

      // Then
      expect(result).not.toHaveProperty('createdAt');
    });

    it('should have correct DTO structure', () => {
      // Given
      const totemProps = {
        id: 'totem-123',
        name: 'Totem 1',
        storeId: 'store-123',
        tokenAccess: 'token-abc-123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      const totem = Totem.restore(totemProps).value!;

      // When
      const result = TotemPresenter.toDto(totem);

      // Then
      expect(Object.keys(result)).toEqual(['id', 'name', 'tokenAccess']);
    });
  });
});
