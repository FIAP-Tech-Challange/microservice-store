import { StoreMapper } from 'src/core/modules/store/mappers/store.mapper';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { StoreWithTotemsDataSourceDTO } from 'src/common/dataSource/dataSource.dto';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';

describe('StoreMapper', () => {
  describe('toEntity', () => {
    it('should map DTO to entity successfully', () => {
      // Given
      const dto: StoreWithTotemsDataSourceDTO = {
        id: 'store-123',
        name: 'Test Store',
        fantasy_name: 'Test Fantasy',
        cnpj: '11.222.333/0001-81',
        email: 'test@example.com',
        phone: '11987654321',
        salt: 'salt-123',
        password_hash: 'hash-123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [
          {
            id: 'totem-123',
            name: 'Totem 1',
            store_id: 'store-123',
            token_access: 'token-abc',
            created_at: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      // When
      const result = StoreMapper.toEntity(dto);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).toBeInstanceOf(Store);
      expect(result.value!.id).toBe(dto.id);
      expect(result.value!.name).toBe(dto.name);
      expect(result.value!.fantasyName).toBe(dto.fantasy_name);
      expect(result.value!.cnpj.toString()).toBe('11222333000181');
      expect(result.value!.email.toString()).toBe(dto.email);
      expect(result.value!.phone.toString()).toBe('5511987654321');
      expect(result.value!.getTotems()).toHaveLength(1);
    });

    it('should return error when CNPJ is invalid', () => {
      // Given
      const dto: StoreWithTotemsDataSourceDTO = {
        id: 'store-123',
        name: 'Test Store',
        fantasy_name: 'Test Fantasy',
        cnpj: 'invalid-cnpj',
        email: 'test@example.com',
        phone: '11987654321',
        salt: 'salt-123',
        password_hash: 'hash-123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      // When
      const result = StoreMapper.toEntity(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
    });

    it('should return error when email is invalid', () => {
      // Given
      const dto: StoreWithTotemsDataSourceDTO = {
        id: 'store-123',
        name: 'Test Store',
        fantasy_name: 'Test Fantasy',
        cnpj: '11.222.333/0001-81',
        email: 'invalid-email',
        phone: '11987654321',
        salt: 'salt-123',
        password_hash: 'hash-123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      // When
      const result = StoreMapper.toEntity(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
    });

    it('should return error when phone is invalid', () => {
      // Given
      const dto: StoreWithTotemsDataSourceDTO = {
        id: 'store-123',
        name: 'Test Store',
        fantasy_name: 'Test Fantasy',
        cnpj: '11.222.333/0001-81',
        email: 'test@example.com',
        phone: 'invalid-phone',
        salt: 'salt-123',
        password_hash: 'hash-123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      // When
      const result = StoreMapper.toEntity(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
    });

    it('should return error when totem mapping fails', () => {
      // Given
      const dto: StoreWithTotemsDataSourceDTO = {
        id: 'store-123',
        name: 'Test Store',
        fantasy_name: 'Test Fantasy',
        cnpj: '11.222.333/0001-81',
        email: 'test@example.com',
        phone: '11987654321',
        salt: 'salt-123',
        password_hash: 'hash-123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [
          {
            id: '',
            name: 'Totem 1',
            store_id: 'store-123',
            token_access: 'token-abc',
            created_at: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      // When
      const result = StoreMapper.toEntity(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
    });
  });

  describe('toPersistenceDTO', () => {
    it('should map entity to persistence DTO successfully', () => {
      // Given
      const email = Email.create('test@example.com').value!;
      const cnpj = CNPJ.create('11.222.333/0001-81').value!;
      const phone = BrazilianPhone.create('11987654321').value!;
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email,
        cnpj,
        plainPassword: 'password123',
        phone,
      }).value!;
      const totem = Totem.create({ name: 'Totem 1', storeId: store.id }).value!;
      store.addTotem(totem);

      // When
      const result = StoreMapper.toPersistenceDTO(store);

      // Then
      expect(result).toBeDefined();
      expect(result.id).toBe(store.id);
      expect(result.name).toBe(store.name);
      expect(result.fantasy_name).toBe(store.fantasyName);
      expect(result.cnpj).toBe(cnpj.toString());
      expect(result.email).toBe(email.toString());
      expect(result.phone).toBe(phone.toString());
      expect(result.salt).toBe(store.salt);
      expect(result.password_hash).toBe(store.passwordHash);
      expect(result.created_at).toBe(store.createdAt.toISOString());
      expect(result.totems).toHaveLength(1);
      expect(result.totems[0].id).toBe(totem.id);
    });

    it('should format date as ISO string', () => {
      // Given
      const email = Email.create('test@example.com').value!;
      const cnpj = CNPJ.create('11.222.333/0001-81').value!;
      const phone = BrazilianPhone.create('11987654321').value!;
      const createdAt = new Date('2024-06-15T10:30:45.123Z');
      const storeProps = {
        id: 'store-123',
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email,
        phone,
        salt: 'salt-123',
        passwordHash: 'hash-123',
        cnpj,
        createdAt,
        totems: [],
      };
      const store = Store.restore(storeProps).value!;

      // When
      const result = StoreMapper.toPersistenceDTO(store);

      // Then
      expect(result.created_at).toBe('2024-06-15T10:30:45.123Z');
    });

    it('should map all totems correctly', () => {
      // Given
      const email = Email.create('test@example.com').value!;
      const cnpj = CNPJ.create('11.222.333/0001-81').value!;
      const phone = BrazilianPhone.create('11987654321').value!;
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email,
        cnpj,
        plainPassword: 'password123',
        phone,
      }).value!;
      const totem1 = Totem.create({
        name: 'Totem 1',
        storeId: store.id,
      }).value!;
      const totem2 = Totem.create({
        name: 'Totem 2',
        storeId: store.id,
      }).value!;
      store.addTotem(totem1);
      store.addTotem(totem2);

      // When
      const result = StoreMapper.toPersistenceDTO(store);

      // Then
      expect(result.totems).toHaveLength(2);
      expect(result.totems[0].name).toBe('Totem 1');
      expect(result.totems[1].name).toBe('Totem 2');
    });
  });
});
