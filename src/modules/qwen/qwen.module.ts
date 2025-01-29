import { Module } from '@nestjs/common';
import { QwenService } from './qwen.service';
@Module({
  providers: [QwenService],
})
export class QwenModule {}
