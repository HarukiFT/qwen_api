import { Module } from '@nestjs/common';
import { BalancerService } from './balancer.service';
import { CredentialsModule } from '../credentials/credentials.module';
import { CredentialsService } from '../credentials/credentials.service';
import { CacheModule } from '@nestjs/cache-manager';

import { QwenModule } from '../qwen/qwen.module';
import { QwenService } from '../qwen/qwen.service';

@Module({
  imports: [
    CredentialsModule,
    QwenModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [BalancerService, CredentialsService, QwenService],
  controllers: [],
})
export class BalancerModule {}
