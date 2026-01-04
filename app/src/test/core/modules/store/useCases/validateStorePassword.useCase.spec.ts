import { ValidateStorePasswordUseCase } from 'src/core/modules/store/useCases/validateStorePassword.useCase';
import { FindStoreByEmailUseCase } from 'src/core/modules/store/useCases/findStoreByEmail.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ValidateStorePasswordInputDTO } from 'src/core/modules/store/DTOs/validateStorePasswordInput.dto';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('ValidateStorePasswordUseCase', () => {
  let validateStorePasswordUseCase: ValidateStorePasswordUseCase;
  let findStoreByEmailUseCase: FindStoreByEmailUseCase;
  let storeGateway: StoreGateway;

  const validEmail = Email.create('test@example.com').value!;
  const validCnpj = CNPJ.create('11.222.333/0001-81').value!;
  const validPhone = BrazilianPhone.create('11987654321').value!;
  const validPassword = 'password123';

  beforeEach(() => {
    storeGateway = {
      saveStore: jest.fn(),
      findStoreById: jest.fn(),
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      findStoreByTotemAccessToken: jest.fn(),
    } as unknown as StoreGateway;

    findStoreByEmailUseCase = new FindStoreByEmailUseCase(storeGateway);
    validateStorePasswordUseCase = new ValidateStorePasswordUseCase(
      findStoreByEmailUseCase,
    );
  });

  describe('execute', () => {
    it('should return true when password is correct', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: validPassword,
        phone: validPhone,
      }).value!;

      const dto: ValidateStorePasswordInputDTO = {
        email: 'test@example.com',
        password: validPassword,
      };

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      const result = await validateStorePasswordUseCase.execute(dto);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(true);
    });

    it('should return false when password is incorrect', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: validPassword,
        phone: validPhone,
      }).value!;

      const dto: ValidateStorePasswordInputDTO = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      const result = await validateStorePasswordUseCase.execute(dto);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(false);
    });

    it('should return error when store is not found', async () => {
      // Given
      const dto: ValidateStorePasswordInputDTO = {
        email: 'notfound@example.com',
        password: validPassword,
      };

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: null,
      });

      // When
      const result = await validateStorePasswordUseCase.execute(dto);

      // Then
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.value).toBeUndefined();
    });

    it('should return error when email is invalid', async () => {
      // Given
      const dto: ValidateStorePasswordInputDTO = {
        email: 'invalid-email',
        password: validPassword,
      };

      // When
      const result = await validateStorePasswordUseCase.execute(dto);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      expect(storeGateway.findStoreByEmail).toHaveBeenCalledTimes(0);
    });

    it('should return error when findStoreByEmail fails', async () => {
      // Given
      const dto: ValidateStorePasswordInputDTO = {
        email: 'test@example.com',
        password: validPassword,
      };

      const gatewayError = new Error('Database error');

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: gatewayError as never,
        value: undefined,
      });

      // When
      const result = await validateStorePasswordUseCase.execute(dto);

      // Then
      expect(result.error).toBe(gatewayError);
      expect(result.value).toBeUndefined();
    });

    it('should call verifyPassword method on store entity', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: validPassword,
        phone: validPhone,
      }).value!;

      const verifyPasswordSpy = jest.spyOn(store, 'verifyPassword');

      const dto: ValidateStorePasswordInputDTO = {
        email: 'test@example.com',
        password: validPassword,
      };

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      await validateStorePasswordUseCase.execute(dto);

      // Then
      expect(verifyPasswordSpy).toHaveBeenCalledWith(dto.password);
      expect(verifyPasswordSpy).toHaveBeenCalledTimes(1);
    });
  });
});
