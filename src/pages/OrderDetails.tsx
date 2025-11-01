import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, Phone, Mail, CheckCircle, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/contexts/OrderContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { getOrderById } = useOrder();

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The order you're looking for doesn't exist.
            </p>
            <Button onClick={() => setLocation('/')}>Return Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle2;
      case 'shipped':
        return Truck;
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
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

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4"
          >
            <CheckCircle className="h-12 w-12 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-1">
                Order Placed Successfully!
              </h2>
              <p className="text-green-700">
                Thank you for your order. We'll contact you soon to confirm delivery details.
              </p>
            </div>
          </motion.div>

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-2">
                  Order Details
                </h1>
                <p className="text-muted-foreground">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
              <Badge className={`${getStatusColor(order.status)} text-white px-4 py-2 text-sm`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div 
                          className="w-full h-48 sm:w-20 sm:h-20 bg-card rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => setLocation(`/product/${item.id}`)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="font-semibold mb-1 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setLocation(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-bold">
                            EG {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Order Tracking Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Order Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Estimated Delivery
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {order.tracking.map((event, index) => {
                        const Icon = getStatusIcon(event.status);
                        const isLast = index === order.tracking.length - 1;
                        
                        return (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full p-2 ${getStatusColor(event.status)} text-white`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              {!isLast && (
                                <div className="w-0.5 h-full min-h-[40px] bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <p className="font-semibold mb-1">
                                {getStatusText(event.status)}
                              </p>
                              <p className="text-sm text-muted-foreground mb-1">
                                {event.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(event.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p className="font-semibold">{order.customerInfo.fullName}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </p>
                        <p className="font-semibold">{order.customerInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Phone
                        </p>
                        <p className="font-semibold">{order.customerInfo.phone}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                      <p className="font-semibold">{order.customerInfo.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.city}
                        {order.customerInfo.postalCode && `, ${order.customerInfo.postalCode}`}
                      </p>
                    </div>
                    {order.customerInfo.notes && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Delivery Notes</p>
                          <p className="text-sm">{order.customerInfo.notes}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        EG {order.total.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">
                        EG {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-semibold mb-2">Payment Method</p>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="text-sm">Cash on Delivery</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setLocation('/')}
                    className="w-full" 
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
