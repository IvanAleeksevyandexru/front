export interface UnusedPaymentInterface {
  uin: string;
  payDate: number;
  amount: number;
  link: string;
  title?: string;
  invitationAddress?: string;
}
