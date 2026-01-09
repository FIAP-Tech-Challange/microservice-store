/* eslint-disable @typescript-eslint/unbound-method */
import { CreateStoreWithDefaultCategoriesUseCase } from 'src/core/modules/store/useCases/createStoreWithDeafaultCategories.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { ProductCategoryGateway } from 'src/core/modules/store/gateways/productCategory.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { CreateStoreInputDTO } from 'src/core/modules/store/DTOs/createStoreInput.dto';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

describe('CreateStoreWithDefaultCategoriesUseCase', () => {
  let createStoreUseCase: CreateStoreWithDefaultCategoriesUseCase;
  let storeGateway: StoreGateway;
  let categoryGateway: ProductCategoryGateway;

  beforeEach(() => {
    storeGateway = {
      saveStore: jest.fn(),
      findStoreById: jest.fn(),
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      findStoreByTotemAccessToken: jest.fn(),
    } as unknown as StoreGateway;

    categoryGateway = {
      create: jest.fn(),
    } as unknown as ProductCategoryGateway;

    createStoreUseCase = new CreateStoreWithDefaultCategoriesUseCase(
      storeGateway,
      categoryGateway,
    );
  });

  describe('execute', () => {
    it('should create store with default categories successfully', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByCnpj').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByName').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      jest.spyOn(categoryGateway, 'create').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).toBeInstanceOf(Store);
      expect(result.value!.name).toBe(dto.name);
      expect(result.value!.fantasyName).toBe(dto.fantasyName);
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalled();
    });

    it('should create all four default categories', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByCnpj').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByName').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      const createCategorySpy = jest
        .spyOn(categoryGateway, 'create')
        .mockResolvedValue({
          error: undefined,
          value: undefined,
        });

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(createCategorySpy).toHaveBeenCalledTimes(4);
      const createCategorySpyCall = createCategorySpy;
      expect(createCategorySpyCall).toHaveBeenCalledWith(
        result.value!.id,
        'Lanche',
      );
      expect(createCategorySpyCall).toHaveBeenCalledWith(
        result.value!.id,
        'Acompanhamento',
      );
      expect(createCategorySpyCall).toHaveBeenCalledWith(
        result.value!.id,
        'Bebida',
      );
      expect(createCategorySpyCall).toHaveBeenCalledWith(
        result.value!.id,
        'Sobremesa',
      );
    });

    it('should return error when email is invalid', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'invalid-email',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when CNPJ is invalid', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: 'invalid-cnpj',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when phone is invalid', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: 'invalid-phone',
        plainPassword: 'password123',
      };

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when store with email already exists', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      const existingStore = Store.create({
        name: 'Existing Store',
        fantasyName: 'Existing Fantasy',
        email: Email.create(dto.email).value!,
        cnpj: CNPJ.create(dto.cnpj).value!,
        plainPassword: 'password',
        phone: BrazilianPhone.create(dto.phone).value!,
      }).value!;

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: existingStore as Store | null,
      });

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toContain('email already exists');
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when store with CNPJ already exists', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      const existingStore = Store.create({
        name: 'Existing Store',
        fantasyName: 'Existing Fantasy',
        email: Email.create('other@example.com').value!,
        cnpj: CNPJ.create(dto.cnpj).value!,
        plainPassword: 'password',
        phone: BrazilianPhone.create(dto.phone).value!,
      }).value!;

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByCnpj').mockResolvedValue({
        error: undefined,
        value: existingStore as Store | null,
      });

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toContain('CNPJ already exists');
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when store with name already exists', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      const existingStore = Store.create({
        name: dto.name,
        fantasyName: 'Existing Fantasy',
        email: Email.create('other@example.com').value!,
        cnpj: CNPJ.create('34.028.316/0001-03').value!,
        plainPassword: 'password',
        phone: BrazilianPhone.create('11987654322').value!,
      }).value!;

      (storeGateway.findStoreByEmail as jest.Mock).mockResolvedValue({
        error: undefined,
        value: null,
      });

      (storeGateway.findStoreByCnpj as jest.Mock).mockResolvedValue({
        error: undefined,
        value: null,
      });

      const findByNameMock = storeGateway.findStoreByName as jest.Mock;
      findByNameMock.mockResolvedValue({
        error: undefined,
        value: existingStore,
      });

      (storeGateway.saveStore as jest.Mock).mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toContain('name already exists');
      expect(result.value).toBeUndefined();
      const saveStoreSpy = storeGateway.saveStore;
      expect(saveStoreSpy).toHaveBeenCalledTimes(0);
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when saveStore fails', async () => {
      // Given
      const dto: CreateStoreInputDTO = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: 'test@example.com',
        cnpj: '11.222.333/0001-81',
        phone: '11987654321',
        plainPassword: 'password123',
      };

      const saveError = new Error('Database error');

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByCnpj').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'findStoreByName').mockResolvedValue({
        error: undefined,
        value: null,
      });

      jest.spyOn(storeGateway, 'saveStore').mockResolvedValue({
        error: saveError as never,
        value: undefined,
      });

      // When
      const result = await createStoreUseCase.execute(dto);

      // Then
      expect(result.error).toBe(saveError);
      expect(result.value).toBeUndefined();
      const createCategorySpy = categoryGateway.create;
      expect(createCategorySpy).toHaveBeenCalledTimes(0);
    });
  });
});
