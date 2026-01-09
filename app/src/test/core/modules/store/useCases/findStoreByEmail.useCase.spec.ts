/* eslint-disable @typescript-eslint/unbound-method */
import { FindStoreByEmailUseCase } from 'src/core/modules/store/useCases/findStoreByEmail.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('FindStoreByEmailUseCase', () => {
  let findStoreByEmailUseCase: FindStoreByEmailUseCase;
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

    findStoreByEmailUseCase = new FindStoreByEmailUseCase(storeGateway);
  });

  describe('execute', () => {
    it('should find store by email successfully', async () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: store as Store | null,
      });

      // When
      const result = await findStoreByEmailUseCase.execute('test@example.com');

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).toBe(store);
      const findStoreByEmailSpy = storeGateway.findStoreByEmail;
      expect(findStoreByEmailSpy).toHaveBeenCalledTimes(1);
      expect(findStoreByEmailSpy).toHaveBeenCalledWith(validEmail);
    });

    it('should return error when email is invalid', async () => {
      // Given
      const invalidEmail = 'invalid-email';

      // When
      const result = await findStoreByEmailUseCase.execute(invalidEmail);

      // Then
      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      const findStoreByEmailSpy = storeGateway.findStoreByEmail;
      expect(findStoreByEmailSpy).toHaveBeenCalledTimes(0);
    });

    it('should return error when store is not found', async () => {
      // Given
      const email = 'notfound@example.com';

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: undefined,
        value: null,
      });

      // When
      const result = await findStoreByEmailUseCase.execute(email);

      // Then
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.error!.message).toBe('Store not found');
      expect(result.value).toBeUndefined();
    });

    it('should return error when gateway returns error', async () => {
      // Given
      const email = 'test@example.com';
      const gatewayError = new Error('Database error');

      jest.spyOn(storeGateway, 'findStoreByEmail').mockResolvedValue({
        error: gatewayError as never,
        value: undefined,
      });

      // When
      const result = await findStoreByEmailUseCase.execute(email);

      // Then
      expect(result.error).toBe(gatewayError);
      expect(result.value).toBeUndefined();
    });

    it('should create Email value object before calling gateway', async () => {
      // Given
      const emailString = 'test@example.com';
      const findByEmailSpy = jest
        .spyOn(storeGateway, 'findStoreByEmail')
        .mockResolvedValue({
          error: undefined,
          value: null,
        });

      // When
      await findStoreByEmailUseCase.execute(emailString);

      // Then
      expect(findByEmailSpy).toHaveBeenCalledTimes(1);
      const calledWith = findByEmailSpy.mock.calls[0][0];
      expect(calledWith).toBeInstanceOf(Email);
      expect(calledWith.toString()).toBe(emailString);
    });
  });
});
