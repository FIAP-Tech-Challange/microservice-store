import { ProductCategoryDataSourceDTO } from 'src/common/dataSource/dataSource.dto';
import { ProductCategoryDataSource } from './productCategory.dataSource';

export class ProductCategoryFakeDataSource
  implements ProductCategoryDataSource
{
  constructor() {}

  async createProductCategory(
    category: ProductCategoryDataSourceDTO,
  ): Promise<void> {
    console.log('Fake createProductCategory called with:', category);
    return Promise.resolve();
  }
}
