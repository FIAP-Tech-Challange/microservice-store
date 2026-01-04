import { TotemMapper } from 'src/core/modules/store/mappers/totem.mapper';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { TotemDataSourceDTO } from 'src/common/dataSource/dataSource.dto';

describe('TotemMapper', () => {
  describe('toEntity', () => {
    it('should map DTO to entity successfully', () => {
      // Given
      const dto: TotemDataSourceDTO = {
        id: 'totem-123',
        name: 'Totem 1',
        store_id: 'store-123',
        token_access: 'token-abc',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      // When
      const result = TotemMapper.toEntity(dto);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).toBeInstanceOf(Totem);
      expect(result.value!.id).toBe(dto.id);
      expect(result.value!.name).toBe(dto.name);
      expect(result.value!.storeId).toBe(dto.store_id);
      expect(result.value!.tokenAccess).toBe(dto.token_access);
      expect(result.value!.createdAt).toEqual(new Date(dto.created_at));
    });

    it('should return error when DTO has invalid data', () => {
      // Given
      const dto: TotemDataSourceDTO = {
        id: '',
        name: 'Totem 1',
        store_id: 'store-123',
        token_access: 'token-abc',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      // When
      const result = TotemMapper.toEntity(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
    });
  });

  describe('toPersistenceDTO', () => {
    it('should map entity to persistence DTO successfully', () => {
      // Given
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const totemProps = {
        id: 'totem-123',
        name: 'Totem 1',
        storeId: 'store-123',
        tokenAccess: 'token-abc',
        createdAt,
      };
      const totem = Totem.restore(totemProps).value!;

      // When
      const result = TotemMapper.toPersistenceDTO(totem);

      // Then
      expect(result).toBeDefined();
      expect(result.id).toBe(totem.id);
      expect(result.name).toBe(totem.name);
      expect(result.store_id).toBe(totem.storeId);
      expect(result.token_access).toBe(totem.tokenAccess);
      expect(result.created_at).toBe(createdAt.toISOString());
    });

    it('should format date as ISO string', () => {
      // Given
      const createdAt = new Date('2024-06-15T10:30:45.123Z');
      const totemProps = {
        id: 'totem-123',
        name: 'Totem 1',
        storeId: 'store-123',
        tokenAccess: 'token-abc',
        createdAt,
      };
      const totem = Totem.restore(totemProps).value!;

      // When
      const result = TotemMapper.toPersistenceDTO(totem);

      // Then
      expect(result.created_at).toBe('2024-06-15T10:30:45.123Z');
    });
  });
});
