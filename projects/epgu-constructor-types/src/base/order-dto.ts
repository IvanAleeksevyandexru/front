export interface OrderDto {
  id: number;
  name?: string;
  region?: string;
  createdAt: string;
}

export interface SelectOrderData {
  limitOrders?: number;
  inviteByOrderId?: number;
  startNewBlockedByOrderId?: number;
  content?: string;
  contentForLimitedCase?: string;
  orders: OrderDto[];
}
