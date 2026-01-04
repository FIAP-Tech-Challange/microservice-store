import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { StoreMapper } from '../mappers/store.mapper';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';

export class StoreGateway {
  constructor(private dataSource: DataSource) {}

  async findStoreById(id: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreById(id);
    if (!storeDTO) return { error: undefined, value: null };

    const dtoMapper = StoreMapper.toEntity(storeDTO);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async findStoreByEmail(email: Email): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByEmail(email.toString());

    if (!storeDTO) return { error: undefined, value: null };

    return this.findStoreById(storeDTO.id);
  }

  async findStoreByCnpj(cnpj: CNPJ): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByCnpj(cnpj.toString());

    if (!storeDTO) return { error: undefined, value: null };

    return this.findStoreById(storeDTO.id);
  }

  async findStoreByName(name: string): Promise<CoreResponse<Store | null>> {
    const partialStoreDTO = await this.dataSource.findStoreByName(name);

    if (!partialStoreDTO) return { error: undefined, value: null };

    return this.findStoreById(partialStoreDTO.id);
  }

  async saveStore(store: Store): Promise<CoreResponse<undefined>> {
    const storeDTO = StoreMapper.toPersistenceDTO(store);

    await this.dataSource.saveStore(storeDTO);

    return { error: undefined, value: undefined };
  }

  async findStoreByTotemAccessToken(
    accessToken: string,
  ): Promise<CoreResponse<Store | null>> {
    const totemDTO = await this.dataSource.findTotemByAccessToken(accessToken);

    if (!totemDTO) return { error: undefined, value: null };

    return this.findStoreById(totemDTO.store_id);
  }
}
