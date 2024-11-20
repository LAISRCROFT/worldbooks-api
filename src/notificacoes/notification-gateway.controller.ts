import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsGateway } from './notification-gateway.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @Post('register')
  registerUser(@Body() { userId, clientId }: { userId: string; clientId }) {
    this.notificationsGateway.registerUser(clientId, userId);
    return { message: 'User registered for notifications' };
  }

  @Post('send')
  sendNotification(@Body() { userId, message }: { userId: string; message: string }) {
    this.notificationsGateway.sendNotification(userId, message);
    return { message: 'Notification sent' };
  }
}
