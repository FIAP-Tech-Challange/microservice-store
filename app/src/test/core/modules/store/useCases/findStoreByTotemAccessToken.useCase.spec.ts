import { FindStoreByTotemAccessTokenUseCase } from 'src/core/modules/store/useCases/findStoreByTotemAccessToken.useCase';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('FindStoreByTotemAccessTokenUseCase', () => {
  let findStoreByTotemAccessTokenUseCase: FindStoreByTotemAccessTokenUseCase;
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

    findStoreByTotemAccessTokenUseCase = new FindStoreByTotemAccessTokenUseCase(
      storeGateway,
    );
  });

  describe('execute', () => {
    it('should find store by totem access token successfully', async () => {
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

      jest
        .spyOn(storeGateway, 'findStoreByTotemAccessToken')
        .mockResolvedValue({
          error: undefined,
          value: store as Store | null,
        });

      // When
      const result = await findStoreByTotemAccessTokenUseCase.execute(
        totem.tokenAccess,
      );

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).toBe(store);
      expect(storeGateway.findStoreByTotemAccessToken).toHaveBeenCalledTimes(1);
      expect(storeGateway.findStoreByTotemAccessToken).toHaveBeenCalledWith(
        totem.tokenAccess,
      );
    });

    it('should return error when store is not found', async () => {
      // Given
      const accessToken = 'non-existent-token';

      jest
        .spyOn(storeGateway, 'findStoreByTotemAccessToken')
        .mockResolvedValue({
          error: undefined,
          value: null,
        });

      // When
      const result =
        await findStoreByTotemAccessTokenUseCase.execute(accessToken);

      // Then
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.error!.message).toBe('Store not found');
      expect(result.value).toBeUndefined();
    });

    it('should return error when gateway returns error', async () => {
      // Given
      const accessToken = 'token-abc-123';
      const gatewayError = new Error('Database error');

      jest
        .spyOn(storeGateway, 'findStoreByTotemAccessToken')
        .mockResolvedValue({
          error: gatewayError as never,
          value: undefined,
        });

      // When
      const result =
        await findStoreByTotemAccessTokenUseCase.execute(accessToken);

      // Then
      expect(result.error).toBe(gatewayError);
      expect(result.value).toBeUndefined();
    });

    it('should call gateway with correct access token', async () => {
      // Given
      const accessToken = 'token-xyz-456';
      const findByTokenSpy = jest
        .spyOn(storeGateway, 'findStoreByTotemAccessToken')
        .mockResolvedValue({
          error: undefined,
          value: null,
        });

      // When
      await findStoreByTotemAccessTokenUseCase.execute(accessToken);

      // Then
      expect(findByTokenSpy).toHaveBeenCalledTimes(1);
      expect(findByTokenSpy).toHaveBeenCalledWith(accessToken);
    });
  });
});
