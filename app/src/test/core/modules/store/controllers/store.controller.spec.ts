/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { DataSource } from 'src/common/dataSource/dataSource.interface';

describe('StoreCoreController', () => {
  let controller: StoreCoreController;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      findStoreById: jest.fn(),
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      saveStore: jest.fn(),
      createProductCategory: jest.fn(),
      findTotemByAccessToken: jest.fn(),
    } as any;

    controller = new StoreCoreController(mockDataSource);
  });

  describe('deleteTotemFromStore', () => {
    it('should delete totem from store successfully', async () => {
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
        totems: [
          {
            id: 'totem-123',
            name: 'Totem 1',
            token_access: 'token',
            salt: 'salt123',
            store_id: 'store-123',
            created_at: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);
      mockDataSource.saveStore.mockResolvedValue(undefined);

      const result = await controller.deleteTotemFromStore(
        'store-123',
        'totem-123',
      );

      expect(result.error).toBeUndefined();
      expect(result.value).toBeUndefined();
    });

    it('should handle errors when deleting totem', async () => {
      mockDataSource.findStoreById.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.deleteTotemFromStore(
        'store-123',
        'totem-123',
      );

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while deleting totem',
      );
    });
  });

  describe('addTotemToStore', () => {
    it('should add totem to store successfully', async () => {
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
      mockDataSource.saveStore.mockResolvedValue(undefined);

      const result = await controller.addTotemToStore({
        storeId: 'store-123',
        totemName: 'New Totem',
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    it('should handle errors when adding totem', async () => {
      mockDataSource.findStoreById.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.addTotemToStore({
        storeId: 'store-123',
        totemName: 'New Totem',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while adding totem',
      );
    });
  });

  describe('validateStorePassword', () => {
    it('should validate password successfully when correct', async () => {
      const mockStoreDTO: any = {
        id: 'store-123',
        name: 'Test Store',
        email: 'test@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasy_name: 'Test Store Fantasy',
        password_hash:
          '$2b$10$rKz8l1mXZXzXzXzXzXzXzOZqJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5',
        salt: 'validSalt123',
        created_at: '2024-01-01T00:00:00.000Z',
        totems: [
          {
            id: 'totem-1',
            name: 'Totem Default',
            token_access: 'default-token',
            salt: 'default-salt',
            store_id: 'store-123',
            created_at: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      const mockSimpleStoreDTO: any = {
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

      mockDataSource.findStoreByEmail.mockResolvedValue(mockSimpleStoreDTO);
      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await controller.validateStorePassword({
        email: 'test@store.com',
        password: 'correct-password',
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    it('should handle errors when validating password', async () => {
      mockDataSource.findStoreByEmail.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.validateStorePassword({
        email: 'test@store.com',
        password: 'password',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while validating password',
      );
    });
  });

  describe('findStoreByEmail', () => {
    it('should find store by email successfully', async () => {
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

      const result = await controller.findStoreByEmail('test@store.com');

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value?.email).toBe('test@store.com');
    });

    it('should handle errors when finding store', async () => {
      mockDataSource.findStoreByEmail.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.findStoreByEmail('test@store.com');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while finding store by email',
      );
    });
  });

  describe('createStore', () => {
    it('should create store successfully', async () => {
      mockDataSource.findStoreByEmail.mockResolvedValue(null);
      mockDataSource.findStoreByCnpj.mockResolvedValue(null);
      mockDataSource.findStoreByName.mockResolvedValue(null);
      mockDataSource.saveStore.mockResolvedValue(undefined);
      mockDataSource.createProductCategory.mockResolvedValue(undefined);

      const result = await controller.createStore({
        name: 'New Store',
        email: 'new@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasyName: 'Test Store Fantasy',
        plainPassword: 'password123',
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value?.name).toBe('New Store');
    });

    it('should handle errors when creating store', async () => {
      mockDataSource.findStoreByEmail.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.createStore({
        name: 'New Store',
        email: 'new@store.com',
        cnpj: '11222333000181',
        phone: '11987654321',
        fantasyName: 'Test Store Fantasy',
        plainPassword: 'password123',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while creating store',
      );
    });
  });

  describe('findStoreByTotemAccessToken', () => {
    it('should find store by totem access token successfully', async () => {
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
        totems: [
          {
            id: 'totem-123',
            name: 'Totem 1',
            token_access: 'token',
            salt: 'salt123',
            store_id: 'store-123',
            created_at: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      mockDataSource.findTotemByAccessToken.mockResolvedValue({
        id: 'totem-123',
        store_id: 'store-123',
      } as any);
      mockDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

      const result = await controller.findStoreByTotemAccessToken('token-123');

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    it('should handle errors when finding store by token', async () => {
      mockDataSource.findTotemByAccessToken.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.findStoreByTotemAccessToken('token-123');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while finding store by totem access token',
      );
    });
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

      const result = await controller.findStoreById('store-123');

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBe('store-123');
    });

    it('should handle errors when finding store by ID', async () => {
      mockDataSource.findStoreById.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await controller.findStoreById('store-123');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'Something went wrong while finding store by ID',
      );
    });
  });
});
