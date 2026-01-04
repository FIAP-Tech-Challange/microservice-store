import { Module, Global } from '@nestjs/common';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { DynamoStoreDataSource } from 'src/external/dataSources/store/storeDynamo.dataSource';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ProductCategoryHTTPDataSource } from 'src/external/dataSources/productCategory/productCategoryHTTP.dataSource';

@Global()
@Module({
  providers: [
    {
      provide: DataSourceProxy,
      useFactory: () => {
        const dynamoClient = new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-east-1',
          endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
        });

        const docClient = DynamoDBDocumentClient.from(dynamoClient, {
          marshallOptions: {
            removeUndefinedValues: true,
            convertEmptyValues: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });

        const storeDataSource = new DynamoStoreDataSource(
          process.env.DYNAMODB_TABLE_NAME!,
          docClient,
        );
        const productCategoryDataSource = new ProductCategoryHTTPDataSource();

        return new DataSourceProxy(storeDataSource, productCategoryDataSource);
      },
    },
  ],
  exports: [DataSourceProxy],
})
export class DataSourceModule {}
