import { Controller, Get, Post, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { Mail } from 'src/shared/services/mail';
import { CredentialsService } from './credentials.service';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post('generate')
  async generate(@Res() res: Response) {
    // Prepare for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    const mail = new Mail();

    while (true) {
      if (res.closed) {
        break;
      }

      const created = await this.credentialsService
        .register(mail)
        .catch((error) => {
          console.error(error.message);
        });

      if (!created) {
        res.write(`data: {"error": "Error during creation new accoutn"}\n\n`);
        continue;
      }

      this.credentialsService.addAccount(created[0], created[1]);
      res.write(`data: {"login": "${created[0]}", "hash": ${created[1]}}\n\n`);
    }
  }

  @Get('')
  getCredentials() {
    return this.credentialsService.getActualData();
  }
}
