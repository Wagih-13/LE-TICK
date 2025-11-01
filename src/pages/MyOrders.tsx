import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, Eye } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/contexts/OrderContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const { orders } = useOrder();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <Button onClick={() => setLocation('/')} size="lg">
              Start Shopping
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-serif font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              View and track all your orders
            </p>
          </motion.div>

          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">
                            Order #{order.orderNumber}
                          </h3>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="text-2xl font-bold">
                            EG {order.total.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => setLocation(`/order/${order.id}`)}
                          variant="outline"
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t pt-4">
                      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item) => (
                          <div
                            key={item.id}
                            className="flex-shrink-0 cursor-pointer group"
                            onClick={() => setLocation(`/product/${item.id}`)}
                          >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-lg overflow-hidden mb-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <p className="text-[10px] sm:text-xs text-center text-muted-foreground line-clamp-1 w-16 sm:w-20">
                              {item.name}
                            </p>
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg flex items-center justify-center">
                            <p className="text-sm font-semibold text-muted-foreground">
                              +{order.items.length - 4}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-semibold mb-1">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.address}, {order.customerInfo.city}
                        {order.customerInfo.postalCode && `, ${order.customerInfo.postalCode}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
