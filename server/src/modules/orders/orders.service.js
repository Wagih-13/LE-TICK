/**
 * Orders Service
 * Business logic for order management
 */

import { PrismaClient } from '@prisma/client';
import settingsService from '../settings/settings.service.js';
import emailService from '../../common/utils/email.service.js';

const prisma = new PrismaClient();

/**
 * Create a new order from cart
 */
export const createOrder = async (userId = null, orderData) => {
  try {
    console.log('📦 Creating order for user:', userId || 'GUEST');
    console.log('📦 Order data:', JSON.stringify(orderData, null, 2));

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      notes,
      items: payloadItems,
    } = orderData;

    // Items come from frontend localStorage cart
    console.log('📦 Payload items:', payloadItems);
    let itemsForOrder = [];

    // Items must be sent from frontend (localStorage cart)
    if (!Array.isArray(payloadItems) || payloadItems.length === 0) {
      console.error('❌ No items provided in request');
      throw new Error('Cart items are required. Please add items to cart.');
    }

    console.log('📦 Using items from client (localStorage cart)');
    
    // Validate and enrich items using products from DB
    const productIds = payloadItems.map((i) => i.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, is_deleted: false, is_active: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    itemsForOrder = payloadItems.map((i) => {
      const prod = productMap.get(i.product_id);
      if (!prod) {
        console.error(`❌ Product not found: ${i.product_id}`);
        throw new Error(`Product not found: ${i.product_id}`);
      }
      if (prod.stock_quantity < i.quantity) {
        console.error(`❌ Insufficient stock for ${prod.name}`);
        throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stock_quantity}`);
      }
      const priceNum = Number(i.price ?? prod.price);
      const deliveryFeeNum = Number(i.delivery_fee ?? prod.delivery_fee ?? 0);
      return {
        product_id: prod.id,
        product: prod,
        quantity: i.quantity,
        price: priceNum,
        delivery_fee: deliveryFeeNum,
      };
    });

    console.log('📦 Items for order:', itemsForOrder.length);

    // Calculate totals
    const subtotal = itemsForOrder.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);
    const totalDeliveryFees = itemsForOrder.reduce((sum, item) => {
      return sum + Number(item.delivery_fee || 0) * item.quantity;
    }, 0);
    console.log('📦 Subtotal:', subtotal);
    console.log('📦 Total Delivery Fees:', totalDeliveryFees);

    // Read settings (with sensible defaults)
    console.log('📦 Fetching settings...');
    const taxRate = await settingsService.getNumber('tax_rate', 0.10); // can be 0.10 (decimal) or 10 (percent)
  const shippingFee = await settingsService.getNumber('shipping_fee', 10);
  const freeShippingThreshold = await settingsService.getNumber('free_shipping_threshold', 100);
  const taxRateNum = Number(taxRate || 0);
  const taxNormalized = taxRateNum > 1 ? (taxRateNum / 100) : taxRateNum;
    const tax_amount = subtotal * taxNormalized;
    const shipping_amount = subtotal >= Number(freeShippingThreshold || 0) ? 0 : Number(shippingFee || 0);
    const total = subtotal + tax_amount + shipping_amount + totalDeliveryFees;
    console.log('📦 Tax:', tax_amount, 'Shipping:', shipping_amount, 'Delivery Fees:', totalDeliveryFees, 'Total:', total);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log('📦 Order number:', orderNumber);

    // Create order with items in a transaction
    console.log('📦 Starting transaction...');
    const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        user_id: userId || undefined, // Use undefined instead of null for optional relation
        order_number: orderNumber,
        status: 'PENDING',
        payment_status: 'PENDING',
        subtotal,
        tax_amount,
        shipping_amount,
        discount_amount: 0,
        total,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        notes,
      },
    });

    // Create order items
    const orderItems = await Promise.all(
      itemsForOrder.map((item) =>
        tx.orderItem.create({
          data: {
            order_id: newOrder.id,
            product_id: item.product_id,
            product_name: item.product.name,
            product_sku: item.product.sku,
            quantity: item.quantity,
            price: item.price,
            delivery_fee: item.delivery_fee || 0,
            total: (Number(item.price) + Number(item.delivery_fee || 0)) * item.quantity,
          },
        })
      )
    );

    // Update product stock
    // Note: Cart clearing is handled on frontend (localStorage)
    for (const item of itemsForOrder) {
      await tx.product.update({
        where: { id: item.product_id },
        data: {
          stock_quantity: { decrement: item.quantity },
          sale_count: { increment: item.quantity },
        },
      });
    }

      console.log('📦 Transaction completed successfully');
      return { ...newOrder, items: orderItems };
    });

    console.log('✅ Order created:', order.id);
    
    // Send email notification to admin
    try {
      const emailData = {
        orderId: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        totalAmount: order.total,
        deliveryFee: totalDeliveryFees,
        orderDate: order.created_at,
        orderStatus: order.status,
        shippingAddress: order.shipping_address,
        items: order.items.map(item => ({
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      
      await emailService.sendNewOrderNotification(emailData);
      console.log('✅ Order notification email sent');
    } catch (emailError) {
      console.error('⚠️  Failed to send order notification email:', emailError.message);
      // Don't fail the order creation if email fails
    }
    
    return order;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
};

/**
 * Get orders (filtered by user if not admin)
 */
export const getOrders = async (userId, isAdmin, { page = 1, limit = 10, status } = {}) => {
  const skip = (page - 1) * limit;

  const where = {
    is_deleted: false,
    ...(isAdmin ? {} : { user_id: userId }),
    ...(status ? { status } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            product_name: true,
            product_sku: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId, userId, isAdmin) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                where: { is_primary: true },
                take: 1,
              },
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Check authorization (non-admin can only view own orders, guests can view their own)
  if (!isAdmin && userId && order.user_id && order.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  return order;
};

/**
 * Get order by order number (for guest tracking)
 */
export const getOrderByNumber = async (orderNumber) => {
  const order = await prisma.order.findFirst({
    where: { order_number: orderNumber },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                where: { is_primary: true },
                take: 1,
              },
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return order;
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId, userId, isAdmin) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Check authorization
  if (!isAdmin && order.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  // Can only cancel pending or confirmed orders
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new Error('Order cannot be cancelled');
  }

  // Update order status and restore stock
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Update order
    const cancelled = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    // Restore product stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.product_id },
        data: {
          stock_quantity: { increment: item.quantity },
          sale_count: { decrement: item.quantity },
        },
      });
    }

    return cancelled;
  });

  return updatedOrder;
};

/**
 * Get order statistics (Admin only)
 */
export const getOrderStatistics = async () => {
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count({ where: { is_deleted: false } }),
    prisma.order.count({ where: { status: 'PENDING', is_deleted: false } }),
    prisma.order.count({ where: { status: 'DELIVERED', is_deleted: false } }),
    prisma.order.aggregate({
      where: { status: 'DELIVERED', is_deleted: false },
      _sum: { total: true },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: Number(totalRevenue._sum.total || 0),
  };
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStatistics,
};
