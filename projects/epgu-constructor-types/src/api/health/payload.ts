export interface FpHealthPayload {
  id: string;
  name: string;
  orderId?: number;
}

export interface HealthPayload extends FpHealthPayload {
  method: string;
  date: string;
  serverError?: string | number;
  errorMessage?: string | number;
}
