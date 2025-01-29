import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import { BalancerService } from '../balancer/balancer.service';
import { QwenService } from '../qwen/qwen.service';
import { finalize, from, map } from 'rxjs';
import { Response } from 'express';
import { QwenCompletionDto } from '../qwen/dto/completion.dto';

@Controller('prompt')
export class PromptController {
  constructor(
    private readonly balancerService: BalancerService,
    private readonly qwenService: QwenService,
  ) {}

  @Post('completions')
  async completions(@Body() dto: QwenCompletionDto, @Res() res: Response) {
    const credentials = await this.balancerService.findAndClaim();
    if (!credentials) {
      throw new HttpException(
        'No available credentials',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const stream = this.qwenService.getCompletion(
      credentials.token as string,
      dto,
    );
    if (!stream) {
      throw new HttpException(
        'Error during completion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (dto.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Transfer-Encoding', 'chunked');

      from(stream)
        .pipe(
          map((chunk) => {
            console.log(JSON.stringify(chunk));
            return JSON.stringify(chunk);
          }),
          finalize(() => {
            this.balancerService.release(credentials.login);
          }),
        )
        .subscribe({
          next: (chunk) => {
            res.write(`data: ${chunk}\n\n`);
          },
          error: (err) => {
            console.error('Stream error:', err);
            res.end();
          },
          complete: () => {
            res.end();
          },
        });
    } else {
      res.setHeader('Content-Type', 'application/json');

      res.write(JSON.stringify((await stream.next()).value));
      res.end();
    }
  }
}
