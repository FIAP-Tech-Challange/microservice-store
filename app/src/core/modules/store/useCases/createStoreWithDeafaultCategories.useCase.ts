import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CreateStoreInputDTO } from '../DTOs/createStoreInput.dto';
import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';
import { ProductCategoryGateway } from '../gateways/productCategory.gateway';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilianPhone.vo';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

export class CreateStoreWithDefaultCategoriesUseCase {
  constructor(
    private storeGateway: StoreGateway,
    private categoryGateway: ProductCategoryGateway,
  ) {}

  async execute(dto: CreateStoreInputDTO): Promise<CoreResponse<Store>> {
    const store = await this.createStore(dto);

    if (store.error) return { error: store.error, value: undefined };

    await Promise.all([
      this.categoryGateway.create(store.value.id, 'Lanche'),
      this.categoryGateway.create(store.value.id, 'Acompanhamento'),
      this.categoryGateway.create(store.value.id, 'Bebida'),
      this.categoryGateway.create(store.value.id, 'Sobremesa'),
    ]);

    return { error: undefined, value: store.value };
  }

  private async createStore(dto: CreateStoreInputDTO) {
    const email = Email.create(dto.email);
    if (email.error) return { error: email.error, value: undefined };

    const cnpj = CNPJ.create(dto.cnpj);
    if (cnpj.error) return { error: cnpj.error, value: undefined };

    const phone = BrazilianPhone.create(dto.phone);
    if (phone.error) return { error: phone.error, value: undefined };

    const exists = await this.validateIfStoreExists(
      email.value,
      cnpj.value,
      dto.name,
    );
    if (exists.error) return { error: exists.error, value: undefined };

    const store = Store.create({
      name: dto.name,
      fantasyName: dto.fantasyName,
      email: email.value,
      cnpj: cnpj.value,
      plainPassword: dto.plainPassword,
      phone: phone.value,
    });
    if (store.error) return { error: store.error, value: undefined };

    const saveStore = await this.storeGateway.saveStore(store.value);
    if (saveStore.error) return { error: saveStore.error, value: undefined };

    return { error: undefined, value: store.value };
  }

  async validateIfStoreExists(
    email: Email,
    cnpj: CNPJ,
    name: string,
  ): Promise<CoreResponse<void>> {
    const findByEmail = await this.storeGateway.findStoreByEmail(email);
    if (findByEmail.error) {
      return { error: findByEmail.error, value: undefined };
    }

    if (findByEmail.value) {
      return {
        error: new ResourceConflictException(
          'Store with this email already exists',
        ),
        value: undefined,
      };
    }

    const findByCnpj = await this.storeGateway.findStoreByCnpj(cnpj);
    if (findByCnpj.error) return { error: findByCnpj.error, value: undefined };
    if (findByCnpj.value) {
      return {
        error: new ResourceConflictException(
          'Store with this CNPJ already exists',
        ),
        value: undefined,
      };
    }

    const findByName = await this.storeGateway.findStoreByName(name);
    if (findByName.error) return { error: findByName.error, value: undefined };
    if (findByName.value) {
      return {
        error: new ResourceConflictException(
          'Store with this name already exists',
        ),
        value: undefined,
      };
    }

    return { error: undefined, value: undefined };
  }
}
