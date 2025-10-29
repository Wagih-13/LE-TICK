import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden h-full flex flex-col hover-elevate hover:scale-105 transition-all duration-300" >
        <div className="relative overflow-hidden bg-card aspect-square">
          {product.isNew && (
            <Badge className="absolute py-1 top-3 right-1 z-1000" data-testid={`badge-new-${product.id}`}>
              NEW
            </Badge>
          )}
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            
            transition={{ duration: 0.3 }}
            data-testid={`img-product-${product.id}`}
          />
        </div>
        <CardContent className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-2xl font-bold" data-testid={`text-product-price-${product.id}`}>
            EG {product.price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
