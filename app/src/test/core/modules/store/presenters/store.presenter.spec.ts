import { StorePresenter } from 'src/core/modules/store/presenters/store.presenter';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';

describe('StorePresenter', () => {
  const validEmail = Email.create('test@example.com').value!;
  const validCnpj = CNPJ.create('11.222.333/0001-81').value!;
  const validPhone = BrazilianPhone.create('11987654321').value!;

  describe('toDto', () => {
    it('should convert store entity to DTO successfully', () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      // When
      const result = StorePresenter.toDto(store);

      // Then
      expect(result).toBeDefined();
      expect(result.id).toBe(store.id);
      expect(result.name).toBe(store.name);
      expect(result.fantasyName).toBe(store.fantasyName);
      expect(result.cnpj).toBe(validCnpj.toString());
      expect(result.email).toBe(validEmail.toString());
      expect(result.phone).toBe(validPhone.toString());
      expect(result.totems).toEqual([]);
    });

    it('should convert store with totems to DTO successfully', () => {
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

      // When
      const result = StorePresenter.toDto(store);

      // Then
      expect(result.totems).toHaveLength(2);
      expect(result.totems[0].id).toBe(totem1.id);
      expect(result.totems[0].name).toBe(totem1.name);
      expect(result.totems[0].tokenAccess).toBe(totem1.tokenAccess);
      expect(result.totems[1].id).toBe(totem2.id);
      expect(result.totems[1].name).toBe(totem2.name);
      expect(result.totems[1].tokenAccess).toBe(totem2.tokenAccess);
    });

    it('should not include sensitive data in DTO', () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      // When
      const result = StorePresenter.toDto(store);

      // Then
      expect(result).not.toHaveProperty('salt');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('createdAt');
    });

    it('should convert value objects to strings', () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      // When
      const result = StorePresenter.toDto(store);

      // Then
      expect(typeof result.email).toBe('string');
      expect(typeof result.cnpj).toBe('string');
      expect(typeof result.phone).toBe('string');
    });

    it('should have correct DTO structure', () => {
      // Given
      const store = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      }).value!;

      // When
      const result = StorePresenter.toDto(store);

      // Then
      expect(Object.keys(result).sort()).toEqual(
        [
          'cnpj',
          'email',
          'fantasyName',
          'id',
          'name',
          'phone',
          'totems',
        ].sort(),
      );
    });
  });
});
