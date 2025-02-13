import Razorpay from 'razorpay';
import { supabase } from '../supabase';

export class PaymentManager {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID!,
      key_secret: process.env.VITE_RAZORPAY_KEY_SECRET!
    });
  }

  // Create payment order
  async createOrder({
    amount,
    currency = 'INR',
    userId,
    email
  }: {
    amount: number;
    currency?: string;
    userId: string;
    email: string;
  }) {
    try {
      const order = await this.razorpay.orders.create({
        amount: amount * 100, // Convert to paisa
        currency,
        receipt: `order_${Date.now()}_${userId}`,
        notes: {
          userId,
          email
        }
      });

      // Store order in database
      await supabase
        .from('payment_orders')
        .insert({
          order_id: order.id,
          user_id: userId,
          amount,
          currency,
          status: 'created'
        });

      return order;
    } catch (error) {
      console.error('Payment order creation failed:', error);
      throw error;
    }
  }

  // Verify webhook signature
  async verifyWebhook(
    body: any,
    signature: string
  ): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const secret = process.env.VITE_RAZORPAY_WEBHOOK_SECRET!;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(JSON.stringify(body));
      const generatedSignature = hmac.digest('hex');
      return generatedSignature === signature;
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return false;
    }
  }

  // Verify payment signature
  async verifyPayment({
    orderId,
    paymentId,
    signature
  }: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const secret = process.env.VITE_RAZORPAY_KEY_SECRET!;
      const hmac = crypto.createHmac('sha256', secret);
      const data = `${orderId}|${paymentId}`;
      hmac.update(data);
      const generatedSignature = hmac.digest('hex');
      return generatedSignature === signature;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  // Process refund
  async processRefund(
    paymentId: string,
    amount: number
  ): Promise<any> {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      if (payment) {
        return await this.razorpay.payments.capture(paymentId, amount * 100); // Convert to paisa
      }
      throw new Error('Payment not found');
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment.status;
    } catch (error) {
      console.error('Payment status check failed:', error);
      throw error;
    }
  }
}
