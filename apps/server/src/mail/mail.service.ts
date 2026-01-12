import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER?.trim() || process.env.MAIL_USER,
        pass: process.env.MAIL_PASS?.trim() || process.env.MAIL_PASS,
      },
    });
  }

  async senToEmail(email: string, message: string) {
    console.log('Sending alert email to:', email);
    console.log('Message:', process.env.MAIL_USER, process.env.MAIL_PASS);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail({
        to: '882itn@gmail.com',
        subject: 'Cảnh báo từ hệ thống EVBoo',
        html: `
        <h1 style="text-align:center;color:yellow">⚠️Cảnh báo</h1>
        <h2 style="text-align:center;color:#ff0000">${message}</h2>
      `,
      });
    } catch (err) {
      console.error('❌ Send mail error:', err);
    }
  }
}
