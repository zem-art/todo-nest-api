import { env } from "../config/env"; // If you access process.env too early, for example before NestJS runs forRoot(), you can use dotenv manually.
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Resend } from 'resend';
import Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

const api_key = env.RESEND_API_KEY || ''
const resend = new Resend(api_key);

@Injectable()
export class MailsService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmailByEvent(event:string, to:string, subject:string, payload:object) {
    const fromNameEmail = this.configService.get<string>('resend.from');
    const config = this.getTemplateConfig(event);
    const html = await this.renderTemplate(config.templateName, payload);

    return resend.emails.send({
      from: `${subject} <${fromNameEmail}>`,
      to,
      subject: config.subject,
      html,
    });
  }

  private getTemplateConfig(event: string) {
    switch (event) {
      case 'user_registered':
        return { subject: 'Welcome!', templateName: 'user_registered' };
      case 'password_reset':
        return { subject: 'OTP Code Change Password', templateName: 'password_reset' };
      case 'order_confirmed':
        return { subject: 'Order Confirmed', templateName: 'order_confirmed' };
      default:
        throw new Error(`Unknown event: ${event}`);
    }
  }

  private async renderTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);
    return compiledTemplate(context, {
      allowProtoPropertiesByDefault : true,
      allowProtoMethodsByDefault : true,
    });
  }
}
