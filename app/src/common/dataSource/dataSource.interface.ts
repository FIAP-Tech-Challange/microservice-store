import { NotificationDataSourceDTO } from './DTOs/notificationDataSource.dto';

export interface DataSource {
  sendSMSNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }>;
  sendWhatsappNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }>;
  sendEmailNotification(
    email: string,
    message: string,
  ): Promise<{ error?: string }>;
  sendMonitorNotification(
    ip: string,
    message: string,
  ): Promise<{ error?: string }>;
  saveNotification(notification: NotificationDataSourceDTO): Promise<void>;
}
