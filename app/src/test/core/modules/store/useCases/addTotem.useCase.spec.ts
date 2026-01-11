/* eslint-disable @typescript-eslint/unbound-method */
import { AddTotemUseCase } from 'src/core/modules/store/useCases/addTotem.useCase';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { AddTotemInputDTO } from 'src/core/modules/store/DTOs/addTotemInput.dto';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

describe('AddTotemUseCase', () => {
  let addTotemUseCase: AddTotemUseCase;
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
    addTotemUseCase = new AddTotemUseCase(storeGateway, findStoreByIdUseCase);
  });

  describe('execute', () => {
    it('should add totem successfully', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const dto: AddTotemInputDTO = {
        storeId: store.id,
        totemName: 'Totem 1',
      };

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      // When
      const result = await addTotemUseCase.execute(dto);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.name).toBe(dto.totemName);
      expect(result.value!.storeId).toBe(dto.storeId);
      expect(result.value!.id).toBeDefined();
      expect(result.value!.tokenAccess).toBeDefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: store.id }),
      );
    });

    it('should return error when store is not found', async () => {
      // Given
      const dto: AddTotemInputDTO = {
        storeId: 'non-existent-id',
        totemName: 'Totem 1',
      };

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: null,
      });

      // When
      const result = await addTotemUseCase.execute(dto);

      // Then
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when totem name is empty', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const dto: AddTotemInputDTO = {
        storeId: store.id,
        totemName: '',
      };

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      const result = await addTotemUseCase.execute(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when totem with same name already exists', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const dto: AddTotemInputDTO = {
        storeId: store.id,
        totemName: 'Existing Totem',
      };

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      await addTotemUseCase.execute(dto);

      // When
      const result = await addTotemUseCase.execute(dto);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.value).toBeUndefined();
    });

    it('should return error when saveStore fails', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      const dto: AddTotemInputDTO = {
        storeId: store.id,
        totemName: 'Totem 1',
      };

      const saveError = new Error('Database error');

      jest.spyOn(storeGateway, 'findStoreById').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: saveError as never,
        value: undefined,
      });

      // When
      const result = await addTotemUseCase.execute(dto);

      // Then
      expect(result.error).toBe(saveError);
      expect(result.value).toBeUndefined();
    });
  });
});
