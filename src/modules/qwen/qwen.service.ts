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

  async signUp(login: string, hash: string) {
    const attempt = async () => {
      return await this.http
        .post<SignInResponse>(
          '/v1/auths/signup?u_atoken=56fc05ad-f4a4-4de8-9a5f-ae958877d584&u_asession=01seuc6lo__Itxkiw3Jwdmg0zOfmXUlXl6quX9g18IUjSvkSfyj4tZkRaOt9tR3uKstEIK_m0bh9fEgNIfYQaHUtsq8AL43dpOnCClYrgFm6o&u_asig=05INXw5uDoPWF7rcvX5GDmMfkGZpPWBO0BCZU7i38JL89Ep8NfX10EzNg7t4X-fWSA1-ODLxzNpKl8Y2Jj6Z4j6xCfqlSv9owEU2P2a1k7WxWNqsWdwfi-M-Y-4GvmFhN8r9J0kE1ax86LmLUhlilRZF4IQEzxNtG5HxTAPtFclgNwajBTKkWhEnnG8611AsH6ksmHjM0JOodanL5-M1Qs1Sr3NJnjl8KYT8mNZCiJyPpE2uDUfeekDoUwYii0BDZDUb8FeqYjIU8q4BCU3W8w5QO40J1NdFLEDs_WsETnvb7UpLHxH1iRKZmnjAu0Zefw',
          {
            agree: true,
            name: 'Sup from Haruki',
            email: login,
            password: hash,
            profile_image_url:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAABJtJREFUeF7tm0tsVGUcxc+8ZzpDa4OLuhAWGg0gjwQkBEGUaAjxkRAkJMgjBBR8Rh4LFi5dmBCQaDQSgiJBk6qEyCNEQikuJIWVQlzwWohAqoBA6bQz7TzMvdOvlIEyMxHL+cdzd5OZe+fM+d3z/f/f990JLF14pQgdNA4EBISGhS9EQLh4CAgZDwEREDYHyPSohggImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5SoiAkDlAJkcJERAyB8jkKCECQuYAmRwlREDIHCCTo4QICJkDZHKUEAEhc4BMjhIiIGQOkMlRQgSEzAEyOUqIgJA5QCZHCREQMgfI5JhPSFNTCO+sSuHc73ls/qyTzN7a5ZgHMmduArNfTOD6tQI+/7QTZ8/kaneB6AzTQOLxANa9X48RI0PI54Ef92fwfXMXkb21SzENZOZzMcybX4dYPOD/cm/Y+vCDDmQydv/HahrIe2uGYdyESP9tmM0WsfPbbhw8kKn91iQ5wyyQseMjWPZaEvUNwVusPHUy56fE6mEWyLLXk5g6LYY/2/NobAz2D1vpdBFfb0+j7UiPSSYmgTzyaBgr30qhviGAvT9kMPHJqF/YvaNYBI619ZhtgU0CeWV+HWbNjuPSX3l8vLET02bE/NehEhNcuWy3BTYHxLW6D48I4afWLLZ/mYZLzPAHS/XEcgtsDohrdb2OauuWNE782utDWPFmCpOnRBEodcBmW2BzQNauG4bRYyI4/ksvNm240V+4y+ck2UwR3zV34dDBrKnibgrIlKlRvLo4iXAIt5k9cNbuCJRDs0DGFBA3LP1x7s4zclfsXXHvuF64ZVgTkHvogCvcDzQGB12zKi/uXgvsCv89lPKfXspMQtzdf+3q3Vva8uJ++VLBn5NYWQU2AWRgq1tp0ufqTDJZarestcAmgLzwUgIvz4kjEunraWscNCytApsA4u15PPZ42J9bnD9feQMqlQr6rXE4XCJnqQWmB3K3VnewoHjbuu+uTqHpob61FOC2eUuNIRuyj9MDcUX6zOkcPlp/o+rNp4VL6vDMzDiCfavzVlpgaiADV3V378pg357uqu9Uqy0wNZDFS5OY8WwMg00EK9Epb4G9vZNPNnXi4oV8pVPv2/u0QLw73DPUW8Ftbclgx1e1P7zw1PQYFiyqQyJxswX2tnebv6n9WkNFiBbIG2+nMGly1J9H7N/bjV07qx+unHmjRkewfGXS31F0x9W/C9j2xc1V4qEyutrvoQPi7f5NfzqGJ8ZGEOxrktrb82htyeK3E71VDzcejOdnxTBuQrS/sDtTOjoKONySxbGjPVVfr1pD/+3nqIC4h97c/KH8x+Vy1aXFLdFXMsd7XGjHti4c+ZlniZ4KSCUD/w/vCwgZZQEREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5SoiAkDlAJkcJERAyB8jkKCECQuYAmRwlREDIHCCTo4QICJkDZHKUEAEhc4BMjhIiIGQOkMlRQgSEzAEyOUqIgJA5QCZHCREQMgfI5CghAkLmAJkcJYQMyD/zXHiHqGRAIQAAAABJRU5ErkJggg==',
            oauth_sub: '',
            'bx-ua':
              '231!dDRMckmUDJ0+j+VE243029GjUq/YvqY2leOxacSC80vTPuB9lMZY9mRWFzrwLEkVa1wFtLD+ugyVGKJ7Z1iR60s3UxRv9CY+8PXs/Dj6zKxTx4f7JpD6Dv+8o2JTxOO/B3j2+eH95wveKpsgtsEeHIUVb8OHGrBtX1hZ3QkgBWUH/fN3Z+YrQfdEXxu2EhbYl4ohJl1Bd9nYjEmmlrgItnKIOjD+cw8e+Zd++6WF1cHl54NdHJBh+++j+ygU3+jOQCGtGSA9R+k3+pI6gVMSbqvm4XZdFATZB84N6W5/tClHqD3NZ1j5RG1Ge3sYBn0PWqN1xTTXjjQnr1AAou9nLzldbRvuHUkFbUDbboNHEHzMlL7gcBQEg9/IgyN9e3/HHyofrpZScBs9j9FRngHfRa8KvdgpRvPu2GICUBBgge0Kx1fAlBfopJ2u9v2dQWEcftQg1iMVhaXV4QpdbAoFtMgtGBlcDqe2hHo1+Z2YKNpI3xfJsY0PlsFtBIVjyOmsKu/57y1beVhP8oahdw6anA7QR71hxhmokqR9rAbIXbIfxhtkcsYmBlPOVUDCRS/N3Wawg3AX2Y+76/XLxGwT9Sm0gS3aH2Ic4WVWmCNsKT1mx6IbfWkFV7ks1LfflUPfmKn/vPvGiyrDacS5A/MuIKu8qFL1qd6Uz61HaKkuoUSS6cAlpzJ9nxApEpDq+Y17mHpgvaBrEIb+hzL2pInwZbPCTVSRmk1EioRUg95Xhoc/fktIcJyK4M3s01I7w7Rd48J/Aulx51eHNLaReOcLT8ppXZuzxOk16hmOxgQIyFEJvGzBkzLpdoCW7kez36lihFYlR5PF8jRSQuCqsHORHelOMTWsaLFpeNixK445noeKoa4tKOa0KxShmumytHTTZNww3UunSObWPxWxYoWsW3nC16vMuk/rLXz2WfbLdPhBFc1qAYXZnxF0ZLquxj7HEa+zEn6JFQhZyMeFCDBOj9ban494z++ovq95vshVS18I0Q0mJvEwng8+3AiFjnUl+g5zHCMillOFxHa0hYT9t3zWrcb/K8BUHkd44F0sGiByWUv0xmPRkWjiYF2z6B6Z5aZrII+T53QQwEODrVUfDoJyAduHxt/Lu//9Z77Em39NcsO3Iqcik2G98N2+Wnv+RxM4v9xHdm08GMVgF/xcrjqpoEDntzQaqVA7b3pYTtcoLm5yMGXGh5ypZCBILjwmAc0mKoNhduBHqqBPMJlYPyQeNb7PnGpB76xHcEwGum3dutuStlKqfMT5ZatdtU0f6y0SeWq0Cb0iKJkGMCtusXH6yCliH76tmyS/m8OvkT6MvPe3LmlyyhXoMA3wTIXHgz6dZ1FLgz87wAnlowCRScjwBbD4M/nwGTA1g5HVFWN2yH8X1S3AyTHe5KxORVh8d66jBCHU+Me4vTTLdIqTOoT+DyXoe0Wc5j6sjMYgkgkShNK7b0ni0oZlS+YKLDk6AGrU8G8d2rWwZHVmApkYdoQtqPGGIPDumfJL4tduUOEMmmYndehqMjZ+KIFIa5QNgIF/rpBJvwY3DRyCS1zHfLBjW7vzkKkRRNUXc745L20uGkWsPt2Shfg+BfowqdSuzv/MXzpAWrV0rUxYdUHWYhzhSiazTBoz8sdUIFMyBpPU7Zf7aetp2IeRf7ybckTxQWw+bJLRkWfjkYRHbMWKDgaFregceQ3FVyyK13g20S50Q6hFrUzBBd686Ix3q5/hEm/n/OufVhRXxstaxSVixI4/xHcdq7GVpH3k3SKFtcwyh/bY8h1XAUU7dMmtzH8LCVzjTqFjMyvfPwsthn7vNM968jdI5lAvi+rDptRRdEYbemYsd58hwkT5lHuCapB8zDTcRlfUS4ylPmt9m9uUouX7A6S+bXw8ptkONnCpLPy9SJ/dIpki39dkdiiIta+ezqNOgaSgDcSCrDfZUM68DaEMRi7NQei1+BplYe9vRnEFzxviiR1pgjiKNjMbyx1KFErUdTWvhHjUsEJm2ISVUCqenFBE+b4ReZxWNGa7oST904loiulZxRRoOnQsEEwRKEQnYxl626iPvV4co0BPw9ZIphWneCAoSgkwu4n86lwzVnSzivCdeh+EJRxjScanF9maBmt/sI2bOt3YhFMXtbVWLoiPgkkAPn+2k2Gu7wjUCgS4Xgs2rB2rk5QRw4mUT3GJvfuws2LXP+8UjEK17jB0nnf/j800NjjVEPj0DZLUiZf4dJKS8y/jeiBDx75DSyEjXwT48aeLA886bdKq40qXvzhH35r+/cLbZz6kHndmnNNwu2FuEJkqx2JLsu78iUZY/H9ykk8uNzpdLa3Q1f3/ttU2869qLHh+7S3Xcu+wwVEwWhnpGNTd2YWD1uMf9yEjxzoXP7aGmq353EDUZXkBacCw+UvMxTy8Sg5a3xOYem3+6BUTbUrpKktL/I9NZPwQeSNAIaQAKbtuzV7ocqx879ybOuCmqslm/QcPwCQY5fqTsv9OmA3XlS01W7Vdxf+Aj1WaDK6roqQATe65xwdfyp/0VY2qlwOb6yzJcrduZ7+tfXVL15xFZyYyx0HC0O628c6msVnhrMVaUsTs6lg4LyMYQ/9WoBf5unMdqpraIyGRuUXIBqlrtk+ji6k6pm1SpV/bldLgUxqJJuZPE/lYAWiZYzGdsgx72WJN+YsaqsfpO4gGcLUUqDAaBglO3etkUhmj+nB4Eu5E0Bc7A81LOxMCFtjtiGpwvFfC2YkTeJzTncCEzJsA3yRPM5fzwVEyWgoxkAsk4FsCeXZv1FIDxSCddTXHzY4nhH5w0DH7QcECeQLX+SFYP4+QRoiCX09oARX5YcMjD8dsdsGWxkcbVn5YT/EHMI5Z7BrNM29gI+52ngaw4EXh6K9n7dlpask6dDEhlV3aRxZSIdhIiewv8N+Z30SQJ9FcrClvOZbEr2zpmcA6qu2PEn6ig34USYYpk8BMf2YVclUp83jx88xp3dPIrLi9kVaavAZw2oFJMGiz7B8QPAl7KqbDIVjv7ZzCOAt9Ah5zhTu9Hn0VJ/1w/ZcLjgGrb+55A5QHfG4RaErwfLFjEKH9jGqKqaqjwBTN7NjwIbE6J3QiaSqFA6NA+F/Su43vARVrqEJTNMzCDFtQ/96/vWBNMcU2gZufMzlPeBqyLhihVX0HAVzKFYYivZMKbBnFkA9L5tmEfDGnx7CUSMxLlgdBKlr55Foyy6EJONPzaKT0sTtM+UBZLM9RpQBizFUBSU6qPS4rYoyXq1gPcUkCelxdmzVFy5zsObdBlqzX0AIqrRRpLJgpxQ7ZyRnMsZc6CYoDAEriR9XrQOS8PQUGs6Mt1q+q1pIFgaMDpBPewD2TSt0IszGVDqybhr6zlrX2zD9QcUoYSnxXURhzFDnAxLgHJqq8K0ethGQ+HnxHxoUbmiox3UL2THZKfjW7+BQO6nJ1HCGIbOEWyjvzoBNh9mGw1HZIPkiWdyJcj3hD/ABUJtxpmHRuVUZwUjtXunLF0E2DWVBmewzSRKiWbELEwPOX2PQjIiKFoIjSGfTfKYCzjEppwZts66eQh5+73e017xDX2gtcayks78vXh+kLmShBaI+5p0IAPSAeXc72XU7I7OI2N7Knvkc3x1HudTV2Hl5KKZz7AwfAbDoThLvIBavCctjvGi4ohV8y9lDm3V2E69BLVn62Tg0Eyj0VQjBYgAD4j2JWTmX+/G/earCLIuGIPq3/2V9BywB6RmVZCafVBdQIsRcYmSabYOYvZJPv2NMGKxKR8/ClD4qwdFxMHMLBvDEkqWNuM7fzMZlZ+JlJ80wD5GElvWgJN9SyUOJOU6G6soZdqFhN9vDyjE2dS5XgKz97eGjZWsDNgb5d3pEi6h5Zu/BMZAxUOCtXxmWGE/a4gXqB7I04mNAcEIAcfBvywu1lDvE8a76R2aVwr+PtS9v364719HmfZU4dnWFuO+uIZukFyW8gmxDp47pH13fpjSVXd0NZ1Yi/qDU/8vwRQRhbfd5C5JmS',
            'bx-umidtoken':
              'T2gA2J_b-ApNyIPk1agXiNw8Zn0SAaKkBe_F4s07sr2Zz3v2wN5axQwjAs5P32b1ZSU=',
          },
        )
        .then(() => true)
        .catch((err) => {
          // TODO error handling
          return undefined;
        });
    };

    for (let i = 0; i < RETRIES; i++) {
      const result = await attempt();

      if (result) return result;
    }
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
