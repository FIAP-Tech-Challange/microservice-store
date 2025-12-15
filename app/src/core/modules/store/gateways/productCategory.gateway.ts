import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src/common/DTOs/coreResponse';

export class ProductCategoryGateway {
  constructor(private dataSource: DataSource) {}

  async create(storeId: string, name: string): Promise<CoreResponse<void>> {
    await this.dataSource.createProductCategory({ name, store_id: storeId });

    return { error: undefined, value: undefined };
  }
}
