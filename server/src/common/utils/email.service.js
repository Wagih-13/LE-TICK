/**
 * Email Service
 * Handles sending emails using Nodemailer
 * @module common/utils/email
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Ensure environment variables are loaded
dotenv.config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.notificationEmail = process.env.NOTIFICATION_EMAIL || 'wagiha498@gmail.com';
  }

  async sendNewsletterSubscription(subscriberEmail) {
    if (!this.isConfigured()) {
      console.warn('⚠️  Email service not configured. Skipping newsletter email.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: `"LE TICK Store" <${process.env.EMAIL_USER}>`,
        to: this.notificationEmail,
        subject: '📰 New Newsletter Subscription',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Newsletter Subscription</h1>
            </div>
            <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p style="margin: 0; font-size: 16px;">A user has subscribed to the newsletter.</p>
                <p style="margin: 12px 0 0 0; font-size: 18px;"><strong>Email:</strong> ${subscriberEmail}</p>
                <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">Time: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Newsletter subscription email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send newsletter subscription email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize email transporter
   */
  initialize() {
    try {
      // Configure email transporter
      // For Gmail, you need to enable "Less secure app access" or use App Password
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      this.initialized = true;
      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.initialized = false;
    }
  }

  /**
   * Check if email service is configured
   */
  isConfigured() {
    return this.initialized && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
  }

  /**
   * Send new order notification email
   */
  async sendNewOrderNotification(orderData) {
    if (!this.isConfigured()) {
      console.warn('⚠️  Email service not configured. Skipping email notification.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const {
        orderId,
        orderNumber,
        customerName,
        customerEmail,
        totalAmount,
        orderDate,
        orderStatus,
        items,
      } = orderData;

      const mailOptions = {
        from: `"LE TICK Store" <${process.env.EMAIL_USER}>`,
        to: this.notificationEmail,
        subject: `🛍️ New Order Received - ${orderNumber}`,
        html: this.getNewOrderEmailTemplate(orderData),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Order notification email sent:', info.messageId);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send order notification email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order status update email to customer
   */
  async sendOrderStatusUpdate(orderData) {
    if (!this.isConfigured()) {
      console.warn('⚠️  Email service not configured. Skipping email notification.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const {
        orderNumber,
        customerName,
        customerEmail,
        orderStatus,
        trackingNumber,
      } = orderData;

      const mailOptions = {
        from: `"LE TICK Store" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Order Update - ${orderNumber}`,
        html: this.getOrderStatusUpdateTemplate(orderData),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Order status update email sent:', info.messageId);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send order status update email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get new order email template
   */
  getNewOrderEmailTemplate(orderData) {
    const {
      orderId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      deliveryFee,
      orderDate,
      orderStatus,
      items,
      shippingAddress,
    } = orderData;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.productName}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          EG ${Number(item.price).toLocaleString()}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          EG ${(Number(item.price) * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛍️ New Order Received!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #667eea; margin-top: 0;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Order Number:</td>
                <td style="padding: 8px 0;">${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Order ID:</td>
                <td style="padding: 8px 0;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Order Date:</td>
                <td style="padding: 8px 0;">${new Date(orderDate).toLocaleString('en-US', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                    ${orderStatus.toUpperCase()}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #667eea; margin-top: 0;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 8px 0;">${customerName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${customerEmail || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${customerPhone || 'N/A'}</td>
              </tr>
              ${shippingAddress ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Address:</td>
                <td style="padding: 8px 0;">${shippingAddress}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #667eea; margin-top: 0;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #667eea; margin-top: 0;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px 0; text-align: right; width: 30%;">
                  EG ${(Number(totalAmount) - Number(deliveryFee || 0)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">Delivery Fee:</td>
                <td style="padding: 8px 0; text-align: right;">
                  EG ${Number(deliveryFee || 0).toLocaleString()}
                </td>
              </tr>
              <tr style="border-top: 2px solid #667eea;">
                <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">
                  Total Amount:
                </td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">
                  EG ${Number(totalAmount).toLocaleString()}
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-left: 4px solid #667eea; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>📌 Action Required:</strong> Please process this order and update the customer with shipping information.
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>This is an automated notification from LE TICK Store</p>
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} LE TICK. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get order status update email template
   */
  getOrderStatusUpdateTemplate(orderData) {
    const {
      orderNumber,
      customerName,
      orderStatus,
      trackingNumber,
      estimatedDelivery,
    } = orderData;

    const statusMessages = {
      CONFIRMED: 'Your order has been confirmed and is being prepared.',
      PROCESSING: 'Your order is currently being processed.',
      SHIPPED: 'Great news! Your order has been shipped.',
      DELIVERED: 'Your order has been delivered. Thank you for shopping with us!',
      CANCELLED: 'Your order has been cancelled.',
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📦 Order Update</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
            <h2 style="color: #667eea; margin-top: 0;">Hello ${customerName || 'Customer'}!</h2>
            <p style="font-size: 16px; color: #666;">
              ${statusMessages[orderStatus] || 'Your order status has been updated.'}
            </p>
            
            <div style="margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
              <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #667eea;">
                ${orderNumber}
              </p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #eff6ff; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Current Status</p>
              <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #1e40af;">
                ${orderStatus}
              </p>
            </div>

            ${trackingNumber ? `
              <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">Tracking Number</p>
                <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold; color: #15803d;">
                  ${trackingNumber}
                </p>
              </div>
            ` : ''}

            ${estimatedDelivery ? `
              <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">Estimated Delivery</p>
                <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold; color: #92400e;">
                  ${new Date(estimatedDelivery).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </p>
              </div>
            ` : ''}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>Thank you for shopping with LE TICK!</p>
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} LE TICK. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
