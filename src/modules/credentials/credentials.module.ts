import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { QwenModule } from '../qwen/qwen.module';
import { QwenService } from '../qwen/qwen.service';

@Module({
  imports: [QwenModule],
  providers: [CredentialsService, QwenService],
  controllers: [CredentialsController],
})
export class CredentialsModule {}
