import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class CredentialsService {
  private data: Record<string, { password: string }>;

  onApplicationBootstrap() {
    const filePath = resolve(__dirname, '../../../credentials.json');
    const parsedData = JSON.parse(readFileSync(filePath, 'utf8')) as {
      login: string;
      password: string;
    }[];

    this.data = {};
    for (const credential of parsedData) {
      this.data[credential.login] = { password: credential.password };
    }
  }

  getData() {
    return this.data;
  }
}
