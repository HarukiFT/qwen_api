import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { BalancerService } from '../balancer/balancer.service';
import { CredentialsService } from '../credentials/credentials.service';
import { QwenService } from '../qwen/qwen.service';

@Module({
  imports: [],
  providers: [PromptService, BalancerService, CredentialsService, QwenService],
  controllers: [PromptController],
})
export class PromptModule {}
