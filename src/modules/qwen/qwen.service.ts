import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SignInResponse } from './types/signin-response.type';
import { QwenCompletionDto } from './dto/completion.dto';

const RETRIES = 10;

@Injectable()
export class QwenService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://chat.qwenlm.ai/api',
    });
  }

  async signIn(login: string, password: string): Promise<string | undefined> {
    const attempt = async () => {
      const token = this.http
        .post<SignInResponse>('/v1/auths/signin', {
          email: login,
          password: password,
        })
        .then((response) => response.data.token)
        .catch(() => {
          // TODO error handling
          return undefined;
        });
      return token;
    };

    for (let i = 0; i < RETRIES; i++) {
      const token = await attempt();

      if (token) return token;
    }
  }

  async *getCompletion(token: string, dto: QwenCompletionDto) {
    const maxAttempts = 10;
    let attemptCount = 0;

    const attempt = async () => {
      try {
        const response = await this.http.post('/chat/completions', dto, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'stream',
        });
        return response;
      } catch (error) {
        attemptCount++;
        if (attemptCount >= maxAttempts) {
          throw new Error(
            `Max attempts (${maxAttempts}) reached. Last error: ${error.message}`,
          );
        }
        console.warn(`Attempt ${attemptCount} failed. Retrying...`);
        return attempt();
      }
    };

    const response = await attempt();

    let buffer = '';

    for await (const chunk of response.data) {
      let decodedChunk = new TextDecoder('utf-8').decode(chunk);
      if (decodedChunk.startsWith('data:')) {
        decodedChunk = decodedChunk.slice(6);
      }

      buffer += decodedChunk;

      while (buffer.length > 0) {
        try {
          const firstJsonEnd = buffer.indexOf('\n');
          if (firstJsonEnd === -1) {
            break;
          }

          const jsonString = buffer.slice(0, firstJsonEnd).trim();
          buffer = buffer.slice(firstJsonEnd + 1);

          if (jsonString) {
            const jsonObject = JSON.parse(jsonString);
            yield jsonObject;
          }
        } catch (error) {
          console.warn('Failed to parse JSON:', error.message);
          break;
        }
      }
    }

    if (buffer.trim()) {
      try {
        const jsonObject = JSON.parse(buffer.trim());
        yield jsonObject;
      } catch (error) {
        console.warn('Failed to parse remaining buffer:', error.message);
      }
    }
  }
}
