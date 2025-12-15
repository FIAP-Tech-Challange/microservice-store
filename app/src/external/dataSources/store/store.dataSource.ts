import {
  StoreDataSourceDTO,
  TotemDataSourceDTO,
  StoreWithTotemsDataSourceDTO,
} from 'src/common/dataSource/dataSource.dto';

export interface StoreDataSource {
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreWithTotemsDataSourceDTO | null>;
  addStore(store: StoreDataSourceDTO): Promise<void>;

  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null>;
  deleteTotem(totem: TotemDataSourceDTO): Promise<void>;
  createTotem(totem: TotemDataSourceDTO): Promise<void>;
}
