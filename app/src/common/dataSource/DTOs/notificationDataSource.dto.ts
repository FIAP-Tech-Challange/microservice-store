export interface NotificationDataSourceDTO {
  id: string;
  channel: string;
  destination_token: string;
  message: string;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}
