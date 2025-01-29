import { Inject, Injectable } from '@nestjs/common';
import { CredentialsService } from '../credentials/credentials.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { QwenService } from '../qwen/qwen.service';

@Injectable()
export class BalancerService {
  constructor(
    private readonly credentialService: CredentialsService,
    private readonly qwenService: QwenService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async findFree() {
    const credentials = this.credentialService.getData();

    for (const key of Object.keys(credentials)) {
      const busyValue = await this.cacheManager.get(`busy:${key}`);
      if (busyValue) continue;

      return [key, credentials[key].password];
    }
  }

  async findAndClaim() {
    const freeUnit = await this.findFree();
    if (!freeUnit) return;

    let bearerToken = await this.cacheManager.get(`token:${freeUnit[0]}`);
    if (!bearerToken) {
      bearerToken = await this.qwenService.signIn(freeUnit[0], freeUnit[1]);
      if (!bearerToken) return;

      this.cacheManager.set(`token:${freeUnit[0]}`, bearerToken);
    }

    this.cacheManager.set(`busy:${freeUnit[0]}`, true, 1000 * 120);

    return {
      login: freeUnit[0],
      token: bearerToken,
    };
  }

  async release(login: string) {
    await this.cacheManager.del(`busy:${login}`);
  }
}
