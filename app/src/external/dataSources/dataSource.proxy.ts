import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { StoreDataSource } from './store/store.dataSource';
import { ProductCategoryDataSource } from './productCategory/productCategory.dataSource';
import {
  StoreWithTotemsDataSourceDTO,
  TotemDataSourceDTO,
  ProductCategoryDataSourceDTO,
  StoreDataSourceDTO,
} from 'src/common/dataSource/dataSource.dto';

export class DataSourceProxy implements DataSource {
  private readonly storeDataSource: StoreDataSource;
  private readonly productCategoryDataSource: ProductCategoryDataSource;

  constructor(
    storeDataSource: StoreDataSource,
    productCategoryDataSource: ProductCategoryDataSource,
  ) {
    this.storeDataSource = storeDataSource;
    this.productCategoryDataSource = productCategoryDataSource;
  }

  async saveStore(store: StoreWithTotemsDataSourceDTO): Promise<void> {
    await this.storeDataSource.saveStore(store);
  }

  async findStoreById(
    id: string,
  ): Promise<StoreWithTotemsDataSourceDTO | null> {
    return this.storeDataSource.findStoreById(id);
  }

  async findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    return this.storeDataSource.findStoreByCnpj(cnpj);
  }

  async findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    return this.storeDataSource.findStoreByEmail(email);
  }

  async findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    return this.storeDataSource.findStoreByName(name);
  }

  async findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null> {
    return this.storeDataSource.findTotemByAccessToken(accessToken);
  }

  async createProductCategory(
    category: ProductCategoryDataSourceDTO,
    serviceUrl: string,
    apiKey: string,
  ): Promise<void> {
    await this.productCategoryDataSource.createProductCategory(
      category,
      serviceUrl,
      apiKey,
    );
  }
}
