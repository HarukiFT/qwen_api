import { Module } from '@nestjs/common';

import { CredentialsService } from './modules/credentials/credentials.service';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { BalancerModule } from './modules/balancer/balancer.module';
import { QwenModule } from './modules/qwen/qwen.module';
import { PromptModule } from './modules/prompt/prompt.module';

@Module({
  imports: [CredentialsModule, BalancerModule, QwenModule, PromptModule],
  controllers: [],
  providers: [CredentialsService],
})
export class AppModule {}
