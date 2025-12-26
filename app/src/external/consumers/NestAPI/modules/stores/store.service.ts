import { Injectable, Logger } from '@nestjs/common';
import { AwsParameterStoreService } from '../../shared/services/parameter-store.service';
import { AwsSecretManagerService } from '../../shared/services/secret-manager.service';
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { CreateStoreInputDto } from './dtos/create-store.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);
  private readonly secretManagerService: AwsSecretManagerService;
  private readonly parameterStoreService: AwsParameterStoreService;
  private readonly storeCoreController: StoreCoreController;
  private readonly configService: ConfigService;

  constructor(
    secretManagerService: AwsSecretManagerService,
    parameterStoreService: AwsParameterStoreService,
    storeCoreController: StoreCoreController,
    configService: ConfigService,
  ) {
    this.secretManagerService = secretManagerService;
    this.parameterStoreService = parameterStoreService;
    this.storeCoreController = storeCoreController;
    this.configService = configService;
  }

  async createStore(dto: CreateStoreInputDto) {
    const categoryPathParameterName = this.configService.get<string>(
      'categoryPathParameterName',
    );
    const categoryApiKeySecretName = this.configService.get<string>(
      'categoryApiKeySecretName',
    );

    if (!categoryPathParameterName || !categoryApiKeySecretName) {
      this.logger.error(
        'Category service configuration is missing in environment variables',
      );
      throw new Error(
        'Category service configuration is missing in environment variables',
      );
    }

    const categoryPath = await this.parameterStoreService.getParameter(
      categoryPathParameterName,
    );

    const categoryApiKey = await this.secretManagerService.getSecretValue(
      categoryApiKeySecretName,
    );

    this.logger.log('Category API credentials retrieved successfully');

    return this.storeCoreController.createStore(
      {
        cnpj: dto.cnpj,
        name: dto.name,
        fantasyName: dto.fantasy_name,
        email: dto.email,
        phone: dto.phone,
        plainPassword: dto.password,
      },
      categoryPath,
      categoryApiKey,
    );
  }
}
