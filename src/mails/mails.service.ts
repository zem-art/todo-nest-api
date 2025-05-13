import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

const api_key = 're_CRo6wGt2_5wm1mZvLkk9Nf6JBM9ovBxai'
const resend = new Resend(process.env.RESEND_API_KEY || api_key);

@Injectable()
export class MailsService {
  async sendEmailByEvent(event:string, to:string, payload:string) {
    const config = this.getTemplateConfig(event);
    const html = await this.renderTemplate(config.templateName, payload);

    return resend.emails.send({
      from: `Your App ${process.env.RESEND_API_FROM}`,
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
        return { subject: 'Reset Password', templateName: 'password_reset' };
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
