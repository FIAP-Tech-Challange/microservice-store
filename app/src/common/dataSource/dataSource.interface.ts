import {
  StoreDataSourceDTO,
  TotemDataSourceDTO,
  StoreWithTotemsDataSourceDTO,
  ProductCategoryDataSourceDTO,
} from './dataSource.dto';

export interface DataSource {
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

  createProductCategory(category: ProductCategoryDataSourceDTO): Promise<void>;
}
