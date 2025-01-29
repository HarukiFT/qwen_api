import {
  BadGatewayException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Sse,
} from '@nestjs/common';

import { BalancerService } from '../balancer/balancer.service';
import { QwenService } from '../qwen/qwen.service';
import { finalize, from, map } from 'rxjs';
import { QwenCompletionDto } from '../qwen/dto/completion.dto';

@Controller('prompt')
export class PromptController {
  constructor(
    private readonly balancerService: BalancerService,
    private readonly qwenService: QwenService,
  ) {}

  @Post('/completions')
  @Sse()
  async completions(@Body() dto: QwenCompletionDto) {
    const credentials = await this.balancerService.findAndClaim();

    if (!credentials) {
      throw new BadGatewayException('No available credentials');
    }

    const stream = this.qwenService.getCompletion(
      credentials.token as string,
      dto,
    );

    if (!stream) {
      throw new InternalServerErrorException('Error during completion');
    }

    return from(stream).pipe(
      map((chunk) => {
        return { data: chunk };
      }),
      finalize(() => {
        this.balancerService.release(credentials.login);
      }),
    );
  }
}
