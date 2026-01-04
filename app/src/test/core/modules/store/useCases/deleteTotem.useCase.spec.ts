import { DeleteTotemUseCase } from 'src/core/modules/store/useCases/deleteTotem.useCase';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('DeleteTotemUseCase', () => {
  let deleteTotemUseCase: DeleteTotemUseCase;
  let storeGateway: StoreGateway;
  let findStoreByIdUseCase: FindStoreByIdUseCase;

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
    deleteTotemUseCase = new DeleteTotemUseCase(
      storeGateway,
      findStoreByIdUseCase,
    );
  });

  describe('execute', () => {
    it('should delete totem successfully', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const totem = Totem.create({ name: 'Totem 1', storeId: store.id }).value!;
      store.addTotem(totem);

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      // When
      const result = await deleteTotemUseCase.execute(store.id, totem.id);

      // Then
      expect(result.error).toBeUndefined();
      expect(store.getTotems()).toHaveLength(0);
      expect(storeGateway.saveStore).toHaveBeenCalledWith(store);
    });

    it('should return error when store is not found', async () => {
      // Given
      const storeId = 'non-existent-store-id';
      const totemId = 'totem-123';

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: null,
      });

      // When
      const result = await deleteTotemUseCase.execute(storeId, totemId);

      // Then
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.value).toBeUndefined();
      expect(storeGateway.saveStore).toHaveBeenCalledTimes(0);
    });

    it('should return error when totem is not found', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const nonExistentTotemId = 'non-existent-totem-id';

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      const result = await deleteTotemUseCase.execute(
        store.id,
        nonExistentTotemId,
      );

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toContain('Totem not found');
      expect(result.value).toBeUndefined();
      expect(storeGateway.saveStore).toHaveBeenCalledTimes(0);
    });

    it('should save store after successful deletion', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const totem = Totem.create({ name: 'Totem 1', storeId: store.id }).value!;
      store.addTotem(totem);

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      const saveStoreSpy = jest
        .spyOn(storeGateway, 'saveStore')
        .mockResolvedValue({
          error: undefined,
          value: undefined,
        });

      // When
      await deleteTotemUseCase.execute(store.id, totem.id);

      // Then
      expect(saveStoreSpy).toHaveBeenCalledTimes(1);
      expect(saveStoreSpy).toHaveBeenCalledWith(store);
    });

    it('should not affect other totems when deleting one', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
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

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      // When
      await deleteTotemUseCase.execute(store.id, totem1.id);

      // Then
      expect(store.getTotems()).toHaveLength(1);
      expect(store.getTotems()[0].id).toBe(totem2.id);
    });
  });
});
