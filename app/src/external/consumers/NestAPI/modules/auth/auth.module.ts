import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StoresModule } from '../stores/stores.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { StoreGuard } from './guards/store.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

@Global()
@Module({
  imports: [
    StoresModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('jwtSecret'),
          signOptions: {
            expiresIn: config.get<number>('jwtAccessTokenExpirationTime'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, StoreGuard, ApiKeyGuard],
  exports: [JwtModule, StoresModule, StoreGuard, ApiKeyGuard],
})
export class AuthModule {}
