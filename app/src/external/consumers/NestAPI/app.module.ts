import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import applicationConfig from './infra/config/application.config';
import { AuthModule } from './modules/auth/auth.module';
import { DataSourceModule } from './shared/data-source.module';
import { StoresModule } from './modules/stores/stores.module';
import { AwsSecretManagerService } from './shared/services/secret-manager.service';
import { AwsParameterStoreService } from './shared/services/parameter-store.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [applicationConfig],
    }),
    DataSourceModule,
    HealthModule,
    AuthModule,
    StoresModule,
  ],
  controllers: [],
  providers: [AwsSecretManagerService, AwsParameterStoreService],
})
export class AppModule {}
