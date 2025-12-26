import { ProductCategoryDataSourceDTO } from 'src/common/dataSource/dataSource.dto';

export interface ProductCategoryDataSource {
  createProductCategory(
    category: ProductCategoryDataSourceDTO,
    serviceUrl: string,
    apiKey: string,
  ): Promise<void>;
}
