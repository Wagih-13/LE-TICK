import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart, Home, Heart, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useOrder } from '@/contexts/OrderContext';
import { useLocation } from 'wouter';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { orders } = useOrder();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const ordersCount = orders.length;
  
  // Check if we're on cart, checkout, wishlist, order, my-orders, admin, or product details pages
  const isOnSpecialPage = location === '/cart' || 
                          location === '/checkout' || 
                          location === '/wishlist' ||
                          location === '/my-orders' ||
                          location.startsWith('/order/') ||
                          location.startsWith('/admin/') ||
                          location.startsWith('/product/');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Best Sellers', id: 'bestsellers' },
    { label: 'New Arrivals', id: 'newarrivals' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOnSpecialPage ? 'bg-background/90 backdrop-blur-md border-b' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <button
              onClick={() => setLocation('/')}
              className={`text-xl md:text-2xl font-serif font-bold ${isScrolled || isOnSpecialPage ? 'text-foreground' : 'text-white'} hover-elevate active-elevate-2 px-2 py-1 rounded-md`}
              data-testid="button-logo"
            >LE TICK</button>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {isOnSpecialPage ? (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setLocation('/')}
                className="flex items-center gap-2 text-sm font-medium transition-colors hover-elevate active-elevate-2 px-3 py-2 rounded-md text-foreground hover:text-foreground"
                data-testid="link-back-home"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </motion.button>
            ) : (
              navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium transition-colors hover-elevate active-elevate-2 px-3 py-2 rounded-md ${
                    isScrolled ? 'text-foreground hover:text-foreground' : 'text-white/90 hover:text-white'
                  }`}
                  data-testid={`link-${link.id}`}
                >
                  {link.label}
                </motion.button>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${isScrolled || isOnSpecialPage ? 'text-foreground' : 'text-white'}`}
              onClick={() => setLocation('/my-orders')}
              data-testid="button-orders"
            >
              <Package className="h-5 w-5" />
              {ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${isScrolled || isOnSpecialPage ? 'text-foreground' : 'text-white'}`}
              onClick={() => setLocation('/wishlist')}
              data-testid="button-wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${isScrolled || isOnSpecialPage ? 'text-foreground' : 'text-white'}`}
              onClick={() => setLocation('/cart')}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isScrolled || isOnSpecialPage ? 'text-foreground' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden border-b ${
              isScrolled || isOnSpecialPage ? 'bg-background' : 'bg-black/85'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {isOnSpecialPage ? (
                <button
                  onClick={() => {
                    setLocation('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium hover-elevate active-elevate-2 rounded-md text-foreground hover:text-foreground"
                  data-testid="link-mobile-back-home"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </button>
              ) : (
                navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium hover-elevate active-elevate-2 rounded-md ${
                      isScrolled ? 'text-foreground hover:text-foreground' : 'text-white/90 hover:text-white'
                    }`}
                    data-testid={`link-mobile-${link.id}`}
                  >
                    {link.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
