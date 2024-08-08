import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

// types
import type { User } from 'src/user/interfaces/user.interface'
import type { OrderFromDb } from 'src/order/interfaces/order-from-db.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  public async sendUserConfirmation(user: User) {
    // const url = `example.com/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Команда проекта" <plpo@ya.ru>', // override default from
      subject: 'Спасибо за регистрацию в Глазов-есть!',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        // url,
      },
    });
  }

  public async sendOrderNotifications(userEmails: string[], order: any) {
    delete order._id
    return await this.mailerService.sendMail({
      to: userEmails,
      from: '"Команда проекта" <plpo@ya.ru>', // override default from
      subject: 'Спасибо за заказ в Глазов-есть!',
      template: 'order', // `.hbs` extension is appended automatically
      context: { order }
    });
  }
}
