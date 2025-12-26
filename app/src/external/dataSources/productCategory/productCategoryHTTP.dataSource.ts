import { ProductCategoryDataSourceDTO } from 'src/common/dataSource/dataSource.dto';
import { ProductCategoryDataSource } from './productCategory.dataSource';

export class ProductCategoryHTTPDataSource
  implements ProductCategoryDataSource
{
  constructor() {}

  async createProductCategory(
    category: ProductCategoryDataSourceDTO,
    serviceUrl: string,
    apiKey: string,
  ): Promise<void> {
    await fetch(`${serviceUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        storeId: category.store_id,
        name: category.name,
      }),
    });
  }
}
