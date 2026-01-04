import {
  TotemDataSourceDTO,
  StoreWithTotemsDataSourceDTO,
  StoreDataSourceDTO,
} from 'src/common/dataSource/dataSource.dto';

export interface StoreDataSource {
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreWithTotemsDataSourceDTO | null>;
  saveStore(store: StoreWithTotemsDataSourceDTO): Promise<void>;

  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null>;
}
