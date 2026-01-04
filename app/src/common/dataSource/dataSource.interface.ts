import {
  TotemDataSourceDTO,
  StoreWithTotemsDataSourceDTO,
  ProductCategoryDataSourceDTO,
  StoreDataSourceDTO,
} from './dataSource.dto';

export interface DataSource {
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreWithTotemsDataSourceDTO | null>;
  saveStore(store: StoreWithTotemsDataSourceDTO): Promise<void>;

  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null>;

  createProductCategory(category: ProductCategoryDataSourceDTO): Promise<void>;
}
