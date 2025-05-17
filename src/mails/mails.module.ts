import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';

@Module({
  providers: [MailsService],
  exports: [MailsService], // ⬅️ WAJIB supaya bisa dipakai module lain
})
export class MailsModule {}
