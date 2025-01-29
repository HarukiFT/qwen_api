import { Inject, Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Mail } from 'src/shared/services/mail';
import { QwenService } from '../qwen/qwen.service';
import { generateRandomSHA256 } from 'src/shared/utils/hash-generator.util';
import axios from 'axios';
import { Account } from './types/account.type';

const linkRegex =
  /href="(https:\/\/chat\.qwenlm\.ai\/api\/v1\/auths\/activate\?id=[^&]+&token=[^"]+)"/;

@Injectable()
export class CredentialsService {
  private data: Record<string, { password: string }>;

  constructor(private readonly qwenService: QwenService) {}

  onApplicationBootstrap() {
    try {
      const filePath = resolve(__dirname, '../../../data/credentials.json');
      const parsedData = JSON.parse(readFileSync(filePath, 'utf8')) as {
        login: string;
        password: string;
      }[];

      this.data = {};
      for (const credential of parsedData) {
        this.data[credential.login] = { password: credential.password };
      }
    } catch {
      this.data = {};
    }
  }

  getData() {
    return this.data;
  }

  getActualData() {
    try {
      const filePath = resolve(__dirname, '../../../data/credentials.json');
      const parsedData = JSON.parse(readFileSync(filePath, 'utf8')) as {
        login: string;
        password: string;
      }[];

      return parsedData;
    } catch {
      return {};
    }
  }

  addAccount(login: string, hash: string) {
    let users: Account[] = [];
    if (existsSync(resolve(__dirname, '../../../data/credentials.json'))) {
      const fileData = readFileSync(
        resolve(__dirname, '../../../data/credentials.json'),
        'utf-8',
      );
      users = JSON.parse(fileData) as Account[];
    }

    users.push({
      login: login,
      password: hash,
    });

    writeFileSync(
      resolve(__dirname, '../../../data/credentials.json'),
      JSON.stringify(users, null, 2),
      'utf-8',
    );
  }

  async register(usedMail: Mail) {
    await usedMail.refresh();

    const mail = await usedMail.getAddress();

    const passwordHash = generateRandomSHA256();
    const emailSent = await this.qwenService.signUp(mail, passwordHash);

    if (!emailSent) return;

    let href: string | null = null;

    while (true) {
      const mail = await usedMail.fetchFrom('qwenlm@service.aliyun.com');
      if (mail) {
        const match = mail.html.match(linkRegex);

        if (match && match[1]) {
          href = match[1];
        }
        break;
      }
    }

    if (!href) return;
    await axios.get(href);

    return [mail, passwordHash];
  }
}
