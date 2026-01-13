import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: InstanceType<typeof Resend>;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.resend = new Resend(apiKey);
  }

  async sendMailAPI(to: string, subject: string, message: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to,
      subject,
      html: `
        <h1 style="text-align:center;color:yellow">⚠️Cảnh báo</h1>
        <h2 style="text-align:center;color:#ff0000">${message}</h2>
      `,
    });
  }
}
