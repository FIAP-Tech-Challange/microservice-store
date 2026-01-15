/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { Store } from 'src/core/modules/store/entities/store.entity';

describe('StoreGateway', () => {
  let gateway: StoreGateway;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      findStoreById: jest.fn(),
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      saveStore: jest.fn(),
      findTotemByAccessToken: jest.fn(),
    } as any;

    gateway = new StoreGateway(mockDataSource);
  });

  describe('findStoreById', () => {
    it('should find store by ID successfully', async () => {
      const mockStoreDTO: any = {
        id: 'store-123',
        name: 'Test Store',
        email: 'test@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasy_name: 'Test Store Fantasy',
        password_hash: '$2b$10$YourValidBcryptHashHere1234567890123456789012',
        salt: 'validSalt123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await gateway.findStoreById('store-123');

      expect(mockDataSource.findStoreById).toHaveBeenCalledWith('store-123');
      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
    });

    it('should return null when store not found', async () => {
      mockDataSource.findStoreById.mockResolvedValue(null);

      const result = await gateway.findStoreById('non-existent');

      expect(result.value).toBeNull();
    });
  });

  describe('findStoreByEmail', () => {
    it('should find store by email successfully', async () => {
      const email = Email.create('test@store.com').value!;
      const mockStoreDTO: any = {
        id: 'store-123',
        name: 'Test Store',
        email: 'test@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasy_name: 'Test Store Fantasy',
        password_hash: '$2b$10$YourValidBcryptHashHere1234567890123456789012',
        salt: 'validSalt123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      mockDataSource.findStoreByEmail.mockResolvedValue(mockStoreDTO);
      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await gateway.findStoreByEmail(email);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
    });

    it('should return null when email not found', async () => {
      const email = Email.create('nonexistent@store.com').value!;
      mockDataSource.findStoreByEmail.mockResolvedValue(null);

      const result = await gateway.findStoreByEmail(email);

      expect(result.value).toBeNull();
    });
  });

  describe('findStoreByCnpj', () => {
    it('should find store by CNPJ successfully', async () => {
      const cnpj = CNPJ.create('11222333000181').value!;
      const mockStoreDTO: any = {
        id: 'store-123',
        name: 'Test Store',
        email: 'test@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasy_name: 'Test Store Fantasy',
        password_hash: '$2b$10$YourValidBcryptHashHere1234567890123456789012',
        salt: 'validSalt123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      mockDataSource.findStoreByCnpj.mockResolvedValue(mockStoreDTO);
      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await gateway.findStoreByCnpj(cnpj);

      expect(mockDataSource.findStoreByCnpj).toHaveBeenCalledWith(
        '11222333000181',
      );
      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
    });

    it('should return null when CNPJ not found', async () => {
      const cnpj = CNPJ.create('11444777000161').value!;
      mockDataSource.findStoreByCnpj.mockResolvedValue(null);

      const result = await gateway.findStoreByCnpj(cnpj);

      expect(result.value).toBeNull();
    });
  });

  describe('findStoreByName', () => {
    it('should find store by name', async () => {
      const mockStoreDTO: any = {
        id: 'store-123',
        name: 'Test Store',
        email: 'test@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasy_name: 'Test Store Fantasy',
        password_hash: '$2b$10$YourValidBcryptHashHere1234567890123456789012',
        salt: 'validSalt123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [],
      };

      mockDataSource.findStoreByName.mockResolvedValue(mockStoreDTO);
      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await gateway.findStoreByName('Test Store');

      expect(mockDataSource.findStoreByName).toHaveBeenCalledWith('Test Store');
      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
    });

    it('should return null when name not found', async () => {
      mockDataSource.findStoreByName.mockResolvedValue(null);

      const result = await gateway.findStoreByName('Non Existent Store');

      expect(result.value).toBeNull();
    });
  });

  describe('saveStore', () => {
    it('should save store successfully', async () => {
      const store = Store.create({
        name: 'New Store',
        email: Email.create('new@store.com').value!,
        cnpj: CNPJ.create('11222333000181').value!,
        phone: BrazilianPhone.create('11987654321').value!,
        fantasyName: 'Test Store Fantasy',
        plainPassword: 'password123',
      }).value!;

      mockDataSource.saveStore.mockResolvedValue(undefined);

      const result = await gateway.saveStore(store);

      expect(mockDataSource.saveStore).toHaveBeenCalled();
      expect(result.error).toBeUndefined();
      expect(result.value).toBeUndefined();
    });
  });

  describe('findStoreByTotemAccessToken', () => {
    it('should find store by totem access token successfully', async () => {
      const mockTotemDTO: any = {
        id: 'totem-123',
        name: 'Totem 1',
        token_access: 'token-123',
        salt: 'salt123',
        store_id: 'store-123',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      const mockStoreDTO: any = {
        id: 'store-123',
        name: 'Test Store',
        email: 'test@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasy_name: 'Test Store Fantasy',
        password_hash: '$2b$10$YourValidBcryptHashHere1234567890123456789012',
        salt: 'validSalt123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [mockTotemDTO],
      };

      mockDataSource.findTotemByAccessToken.mockResolvedValue(mockTotemDTO);
      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await gateway.findStoreByTotemAccessToken('token-123');

      expect(mockDataSource.findTotemByAccessToken).toHaveBeenCalledWith(
        'token-123',
      );
      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
    });

    it('should return null when token not found', async () => {
      mockDataSource.findTotemByAccessToken.mockResolvedValue(null);

      const result = await gateway.findStoreByTotemAccessToken('invalid-token');

      expect(result.value).toBeNull();
    });
  });
});
