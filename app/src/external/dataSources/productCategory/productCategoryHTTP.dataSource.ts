import { ProductCategoryDataSourceDTO } from 'src/common/dataSource/dataSource.dto';
import { ProductCategoryDataSource } from './productCategory.dataSource';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export class ProductCategoryHTTPDataSource
  implements ProductCategoryDataSource
{
  private readonly secretManagerClient: SecretsManagerClient;
  private readonly parameterStoreClient: SSMClient;

  constructor() {
    this.secretManagerClient = new SecretsManagerClient();
    this.parameterStoreClient = new SSMClient();
  }

  async createProductCategory(
    category: ProductCategoryDataSourceDTO,
  ): Promise<void> {
    const categoryPathParameterName = process.env.CATEGORY_PATH_PARAMETER_NAME;
    const categoryApiKeySecretName = process.env.CATEGORY_API_KEY_SECRET_NAME;

    if (!categoryPathParameterName || !categoryApiKeySecretName) {
      throw new Error('Category configuration is missing');
    }

    const serviceUrl = await this.getParameter(categoryPathParameterName);
    const apiKey = await this.getSecretValue(categoryApiKeySecretName);

    await fetch(`http://${serviceUrl}/categories`, {
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

  private async getSecretValue(secretId: string): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      return secretId;
    }

    const response = await this.secretManagerClient.send(
      new GetSecretValueCommand({ SecretId: secretId }),
    );

    if (response?.SecretString) {
      return response.SecretString;
    }

    throw new Error('Secret string is empty');
  }

  private async getParameter(parameterName: string): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      return parameterName;
    }

    const response = await this.parameterStoreClient.send(
      new GetParameterCommand({ Name: parameterName, WithDecryption: true }),
    );

    if (response?.Parameter?.Value) {
      return response.Parameter.Value;
    }

    throw new Error(
      `Parameter value is empty for parameter name: ${parameterName}`,
    );
  }
}
