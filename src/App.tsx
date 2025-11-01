import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import Checkout from "@/pages/Checkout";
import OrderDetails from "@/pages/OrderDetails";
import MyOrders from "@/pages/MyOrders";
import AdminProducts from "@/pages/AdminProducts";
import NotFound from "@/pages/not-found";
 

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order/:id" component={OrderDetails} />
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserDataProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <ScrollToTop />
                <Toaster />
                <Router />
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </UserDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
