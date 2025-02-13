declare module 'razorpay' {
  export interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  export interface PaymentOptions {
    amount: number;
    currency: string;
    receipt: string;
    payment_capture?: 0 | 1;
    notes?: Record<string, string>;
  }

  export interface PaymentResponse {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    invoice_id: string | null;
    international: boolean;
    method: string;
    amount_refunded: number;
    refund_status: string | null;
    captured: boolean;
    description: string | null;
    card_id: string | null;
    bank: string | null;
    wallet: string | null;
    vpa: string | null;
    email: string;
    contact: string;
    notes: Record<string, string>;
    fee: number;
    tax: number;
    error_code: string | null;
    error_description: string | null;
    created_at: number;
  }

  export default class Razorpay {
    constructor(options: RazorpayOptions);
    orders: {
      create(options: PaymentOptions): Promise<PaymentResponse>;
      fetch(orderId: string): Promise<PaymentResponse>;
      all(options?: { from?: Date; to?: Date; count?: number; skip?: number }): Promise<PaymentResponse[]>;
    };
    payments: {
      capture(paymentId: string, amount: number): Promise<PaymentResponse>;
      fetch(paymentId: string): Promise<PaymentResponse>;
      all(options?: { from?: Date; to?: Date; count?: number; skip?: number }): Promise<PaymentResponse[]>;
    };
  }
}
