import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { MailMessage, MailStatus } from './types/mail.type';

export class Mail {
  private client: AxiosInstance;

  constructor() {
    const jar = new CookieJar();
    this.client = wrapper(axios.create({ jar }));
  }

  async refresh() {
    return this.client
      .delete<MailStatus>(
        `https://tempmail.so/us/api/inbox?requestTime=${Date.now()}&lang=us`,
      )
      .then((response) => response.data.data.name);
  }

  async getAddress() {
    return this.client
      .get<MailStatus>(
        `https://tempmail.so/us/api/inbox?requestTime=${Date.now()}&lang=us`,
      )
      .then((response) => response.data.data.name);
  }

  async fetchFrom(from: string) {
    const response = await this.client.get<MailStatus>(
      `https://tempmail.so/us/api/inbox?requestTime=${Date.now()}&lang=us`,
    );

    const targetMail = response.data.data.inbox.find(
      (message) => message.from === from,
    );
    if (targetMail) {
      const mailData = await this.client
        .get<MailMessage>(
          `https://tempmail.so/us/api/inbox/messagehtmlbody/${targetMail.id}?requestTime=${Date.now()}&lang=us`,
        )
        .then((response) => response.data.data);

      return mailData;
    }
  }
}
