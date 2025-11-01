import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleCardClick = () => {
    setLocation(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className="group rounded-none border-none overflow-hidden h-full flex flex-col  transition-all duration-500 cursor-pointer" 
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden bg-card aspect-square">
          {product.isNew && (
            <Badge className="absolute py-1 top-3 right-1 z-10" data-testid={`badge-new-${product.id}`}>
              NEW
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            className={`absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background ${
              inWishlist ? 'text-red-500 hover:text-red-600' : 'text-foreground hover:text-red-500'
            }`}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            transition={{ duration: 0.3 }}
            data-testid={`img-product-${product.id}`}
          />
        </div>
        <CardContent className="flex-1 p-6 bg-transparent flex flex-col">
          <h3 className="text-lg font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-2xl font-bold mb-4" data-testid={`text-product-price-${product.id}`}>
            EG {product.price.toLocaleString()}
          </p>
          <Button 
            onClick={handleAddToCart}
            className="mt-auto w-full"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
