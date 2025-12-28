import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import applicationConfig from './infra/config/application.config';
import { AuthModule } from './modules/auth/auth.module';
import { DataSourceModule } from './shared/data-source.module';
import { StoresModule } from './modules/stores/stores.module';
import { AwsModule } from './shared/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig],
    }),
    DataSourceModule,
    AwsModule,
    HealthModule,
    AuthModule,
    StoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
