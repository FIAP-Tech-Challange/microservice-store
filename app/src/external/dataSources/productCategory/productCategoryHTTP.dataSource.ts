import { ProductCategoryDataSourceDTO } from 'src/common/dataSource/dataSource.dto';
import { ProductCategoryDataSource } from './productCategory.dataSource';

export class ProductCategoryHTTPDataSource
  implements ProductCategoryDataSource
{
  private readonly serviceUrl: string;
  private readonly token: string;

  constructor(serviceUrl: string, token: string) {
    this.serviceUrl = serviceUrl;
    this.token = token;
  }

  async createProductCategory(
    category: ProductCategoryDataSourceDTO,
  ): Promise<void> {
    await fetch(`${this.serviceUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        storeId: category.store_id,
        name: category.name,
      }),
    });
  }
}
