import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER?.trim() || process.env.MAIL_USER,
          pass: process.env.MAIL_PASS?.trim() || process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"My App" <no-reply@myapp.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
