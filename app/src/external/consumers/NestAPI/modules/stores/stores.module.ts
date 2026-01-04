import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';

@Module({
  imports: [],
  controllers: [StoresController],
  providers: [],
})
export class StoresModule {}
