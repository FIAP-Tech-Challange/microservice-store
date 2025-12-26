import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StoresController } from './stores.controller';
import { AwsSecretManagerService } from '../../shared/services/secret-manager.service';
import { AwsParameterStoreService } from '../../shared/services/parameter-store.service';

@Module({
  imports: [JwtModule],
  controllers: [StoresController],
  providers: [AwsSecretManagerService, AwsParameterStoreService],
})
export class StoresModule {}
