import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StoreGuard } from './guards/store.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, StoreGuard, ApiKeyGuard],
  exports: [StoreGuard, ApiKeyGuard],
})
export class AuthModule {}
