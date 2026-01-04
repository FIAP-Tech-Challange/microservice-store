import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

describe('Store Entity', () => {
  const validEmail = Email.create('test@example.com').value!;
  const validCnpj = CNPJ.create('11.222.333/0001-81').value!;
  const validPhone = BrazilianPhone.create('11987654321').value!;

  describe('create', () => {
    it('should create a new store with valid data', () => {
      // Given
      const props = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      };

      // When
      const result = Store.create(props);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.name).toBe(props.name);
      expect(result.value!.fantasyName).toBe(props.fantasyName);
      expect(result.value!.email).toBe(props.email);
      expect(result.value!.cnpj).toBe(props.cnpj);
      expect(result.value!.phone).toBe(props.phone);
      expect(result.value!.id).toBeDefined();
      expect(result.value!.salt).toBeDefined();
      expect(result.value!.passwordHash).toBeDefined();
      expect(result.value!.createdAt).toBeInstanceOf(Date);
      expect(result.value!.getTotems()).toEqual([]);
    });

    it('should return error when name is empty', () => {
      // Given
      const props = {
        name: '',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      };

      // When
      const result = Store.create(props);

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });

    it('should return error when fantasyName is empty', () => {
      // Given
      const props = {
        name: 'Test Store',
        fantasyName: '',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword: 'password123',
        phone: validPhone,
      };

      // When
      const result = Store.create(props);

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });
  });

  describe('restore', () => {
    it('should restore a store with valid data', () => {
      // Given
      const props = {
        id: 'store-123',
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        phone: validPhone,
        salt: 'salt-123',
        passwordHash: 'hash-123',
        cnpj: validCnpj,
        createdAt: new Date(),
        totems: [],
      };

      // When
      const result = Store.restore(props);

      // Then
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.id).toBe(props.id);
      expect(result.value!.name).toBe(props.name);
      expect(result.value!.fantasyName).toBe(props.fantasyName);
    });

    it('should return error when totems array contains invalid items', () => {
      // Given
      const props = {
        id: 'store-123',
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        phone: validPhone,
        salt: 'salt-123',
        passwordHash: 'hash-123',
        cnpj: validCnpj,
        createdAt: new Date(),
        totems: [{} as any],
      };

      // When
      const result = Store.restore(props);

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.value).toBeUndefined();
    });
  });

  describe('verifyPassword', () => {
    it('should return true when password is correct', () => {
      // Given
      const plainPassword = 'password123';
      const props = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword,
        phone: validPhone,
      };
      const store = Store.create(props).value!;

      // When
      const result = store.verifyPassword(plainPassword);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when password is incorrect', () => {
      // Given
      const plainPassword = 'password123';
      const props = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCnpj,
        plainPassword,
        phone: validPhone,
      };
      const store = Store.create(props).value!;

      // When
      const result = store.verifyPassword('wrongpassword');

      // Then
      expect(result).toBe(false);
    });
  });

  describe('addTotem', () => {
    it('should add a totem successfully', () => {
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

      // When
      const result = store.addTotem(totem);

      // Then
      expect(result.error).toBeUndefined();
      expect(store.getTotems()).toHaveLength(1);
      expect(store.getTotems()[0]).toBe(totem);
    });

    it('should return error when adding totem with duplicate name', () => {
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
      store.addTotem(totem1);

      const totem2Props = {
        id: 'different-id',
        name: 'Totem 1',
        tokenAccess: 'different-token',
        createdAt: new Date(),
        storeId: store.id,
      };
      const totem2 = Totem.restore(totem2Props).value!;

      // When
      const result = store.addTotem(totem2);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toContain('name already exists');
    });

    it('should return error when adding totem with duplicate token access', () => {
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
      store.addTotem(totem1);

      const totem2Props = {
        id: 'different-id',
        name: 'Different Name',
        tokenAccess: totem1.tokenAccess,
        createdAt: new Date(),
        storeId: store.id,
      };
      const totem2 = Totem.restore(totem2Props).value!;

      // When
      const result = store.addTotem(totem2);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toContain('token access already exists');
    });

    it('should return error when adding totem with duplicate id', () => {
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
      store.addTotem(totem1);

      const totem2Props = {
        id: totem1.id,
        name: 'Different Name',
        tokenAccess: 'different-token',
        createdAt: new Date(),
        storeId: store.id,
      };
      const totem2 = Totem.restore(totem2Props).value!;

      // When
      const result = store.addTotem(totem2);

      // Then
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toContain('id already exists');
    });
  });

  describe('removeTotem', () => {
    it('should remove a totem successfully', () => {
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

      // When
      const result = store.removeTotem(totem.id);

      // Then
      expect(result.error).toBeUndefined();
      expect(store.getTotems()).toHaveLength(0);
    });

    it('should return error when removing non-existent totem', () => {
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
      const result = store.removeTotem('non-existent-id');

      // Then
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toContain('Totem not found');
    });
  });

  describe('getTotems', () => {
    it('should return a copy of totems array', () => {
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

      // When
      const totems = store.getTotems();
      totems.push(Totem.create({ name: 'Totem 2', storeId: store.id }).value!);

      // Then
      expect(store.getTotems()).toHaveLength(1);
    });
  });
});
