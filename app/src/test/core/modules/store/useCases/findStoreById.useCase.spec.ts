import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('FindStoreByIdUseCase', () => {
  let findStoreByIdUseCase: FindStoreByIdUseCase;
  let storeGateway: StoreGateway;

  const validEmail = Email.create('test@example.com').value!;
  const validCnpj = CNPJ.create('11.222.333/0001-81').value!;
  const validPhone = BrazilianPhone.create('11987654321').value!;

  beforeEach(() => {
    storeGateway = {
      saveStore: jest.fn(),
      findStoreById: jest.fn(),
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      findStoreByTotemAccessToken: jest.fn(),
    } as unknown as StoreGateway;

    findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
  });

  describe('execute', () => {
    it('should find store by id successfully', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      const result = await findStoreByIdUseCase.execute(store.id);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).toBe(store);
      expect(storeGateway.findStoreById).toHaveBeenCalledTimes(1);
      expect(storeGateway.findStoreById).toHaveBeenCalledWith(store.id);
    });

    it('should return error when store is not found', async () => {
      // Given
      const storeId = 'non-existent-id';

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: null,
      });

      // When
      const result = await findStoreByIdUseCase.execute(storeId);

      // Then
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.error!.message).toBe('Store not found');
      expect(result.value).toBeUndefined();
    });

    it('should return error when gateway returns error', async () => {
      // Given
      const storeId = 'store-123';
      const gatewayError = new Error('Database error');

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: gatewayError as never,
        value: undefined,
      });

      // When
      const result = await findStoreByIdUseCase.execute(storeId);

      // Then
      expect(result.error).toBe(gatewayError);
      expect(result.value).toBeUndefined();
    });

    it('should call gateway with correct store id', async () => {
      // Given
      const storeId = 'store-abc-123';
      const findByIdSpy = jest
        .spyOn(storeGateway, 'findStoreById')
        .mockResolvedValue({
          error: undefined,
          value: null,
        });

      // When
      await findStoreByIdUseCase.execute(storeId);

      // Then
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
      expect(findByIdSpy).toHaveBeenCalledWith(storeId);
    });
  });
});
