/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment */
import { ProductCategoryGateway } from 'src/core/modules/store/gateways/productCategory.gateway';
import { DataSource } from 'src/common/dataSource/dataSource.interface';

describe('ProductCategoryGateway', () => {
  let gateway: ProductCategoryGateway;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      createProductCategory: jest.fn(),
    } as any;

    gateway = new ProductCategoryGateway(mockDataSource);
  });

  describe('create', () => {
    it('should create product category successfully', async () => {
      mockDataSource.createProductCategory.mockResolvedValue(undefined);

      const result = await gateway.create('store-123', 'Category 1');

      expect(mockDataSource.createProductCategory).toHaveBeenCalledWith({
        name: 'Category 1',
        store_id: 'store-123',
      });
      expect(result.error).toBeUndefined();
      expect(result.value).toBeUndefined();
    });

    it('should handle errors when creating category', async () => {
      mockDataSource.createProductCategory.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(gateway.create('store-123', 'Category 1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
