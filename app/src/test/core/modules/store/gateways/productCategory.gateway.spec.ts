import { ProductCategoryGateway } from '../../../../../core/modules/store/gateways/productCategory.gateway';
import { DataSource } from '../../../../../common/dataSource/dataSource.interface';

describe('ProductCategoryGateway', () => {
  let gateway: ProductCategoryGateway;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      createProductCategory: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    gateway = new ProductCategoryGateway(mockDataSource);
  });

  describe('create', () => {
    it('should create product category successfully', async () => {
      mockDataSource.createProductCategory = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await gateway.create('store-123', 'Beverages');

      expect(result.error).toBeUndefined();
      expect(result.value).toBeUndefined();
      expect(mockDataSource.createProductCategory).toHaveBeenCalledWith({
        name: 'Beverages',
        store_id: 'store-123',
      });
    });

    it('should call dataSource with correct parameters', async () => {
      mockDataSource.createProductCategory = jest
        .fn()
        .mockResolvedValue(undefined);

      await gateway.create('store-456', 'Snacks');

      expect(mockDataSource.createProductCategory).toHaveBeenCalledWith({
        name: 'Snacks',
        store_id: 'store-456',
      });
    });
  });
});
