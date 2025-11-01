import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/contexts/CartContext';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface TrackingEvent {
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  message: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  total: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash_on_delivery';
  tracking: TrackingEvent[];
  estimatedDelivery?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'tracking' | 'estimatedDelivery'>) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status'], message?: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'letick_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders]);

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'tracking' | 'estimatedDelivery'>): Order => {
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      date: now.toISOString(),
      status: 'pending',
      tracking: [
        {
          status: 'pending',
          timestamp: now.toISOString(),
          message: 'Order placed successfully. Awaiting confirmation.',
        },
      ],
      estimatedDelivery: estimatedDelivery.toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], message?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        
        const statusMessages: Record<Order['status'], string> = {
          pending: 'Order placed successfully. Awaiting confirmation.',
          confirmed: 'Order confirmed. Preparing for shipment.',
          shipped: 'Order shipped. On the way to your location.',
          delivered: 'Order delivered successfully. Thank you!',
          cancelled: 'Order has been cancelled.',
        };
        
        const newTrackingEvent: TrackingEvent = {
          status,
          timestamp: new Date().toISOString(),
          message: message || statusMessages[status],
        };
        
        return {
          ...order,
          status,
          tracking: [...order.tracking, newTrackingEvent],
        };
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
