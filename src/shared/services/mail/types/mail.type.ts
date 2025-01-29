interface MailInbox {
  id: string;
  inbox: string;
  senderName: string;
  from: string;
  subject: string;
}

export interface MailStatus {
  message: string;
  data: {
    id: string;
    name: string;
    expires: number;
    inbox: MailInbox[];
  };
}

export interface MailMessage {
  code: number;
  message: string;
  data: {
    id: string;
    html: string;
  };
}
