import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoreTokenInterface } from './dtos/token.dto';
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { AwsSecretManagerService } from '../../shared/services/secret-manager.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private dataSourceProxy: DataSourceProxy,
    private configService: ConfigService,
    private secretManager: AwsSecretManagerService,
  ) {}

  async login(email: string, password: string) {
    try {
      const jwtSecretName = this.configService.get<string>('jwtSecretName');

      if (!jwtSecretName) {
        this.logger.error('JWT secret name is not configured');
        throw new UnauthorizedException('JWT secret name is not configured');
      }

      const secret = await this.secretManager.getSecretValue(jwtSecretName);

      const jwtService = new JwtService({
        secret: secret,
        signOptions: {
          expiresIn: this.configService.get<number>(
            'jwtAccessTokenExpirationTime',
          ),
        },
      });

      this.logger.log(`Attempting login for email: ${email}`);

      const coreController = new StoreCoreController(this.dataSourceProxy);
      const findStoreByEmail = await coreController.findStoreByEmail(email);

      this.logger.debug(findStoreByEmail);

      if (findStoreByEmail.error) {
        this.logger.warn(`Login failed for email: ${email} - Store not found`);
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const validatePassword = await coreController.validateStorePassword({
        email,
        password,
      });

      if (validatePassword.error || validatePassword.value === false) {
        this.logger.warn(`Login failed for email: ${email} - Invalid password`);
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const payload: StoreTokenInterface = {
        storeId: findStoreByEmail.value.id,
        email: findStoreByEmail.value.email,
      };

      return jwtService.signAsync(payload);
    } catch (error) {
      this.logger.error(
        `Login error for email: ${email} - ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }
}
