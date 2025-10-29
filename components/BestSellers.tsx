import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import ProductCard, { type Product } from './ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import silverWatch from '@assets/generated_images/Silver_chronograph_watch_product_38ee6ab0.png';
import goldWatch from '@assets/generated_images/Gold_dress_watch_product_bf3ee143.png';
import blueWatch from '@assets/generated_images/Blue_diving_watch_product_4a6b275b.png';
import roseGoldWatch from '@assets/generated_images/Rose_gold_skeleton_watch_c378b8df.png';

const bestSellers: Product[] = [
  { id: '1', name: 'Classic Chronograph', price: 2499, image: silverWatch },
  { id: '2', name: 'Elegant Gold Dress', price: 3299, image: goldWatch },
  { id: '3', name: 'Ocean Diver Pro', price: 1899, image: blueWatch },
  { id: '4', name: 'Rose Gold Skeleton', price: 4599, image: roseGoldWatch },
];

export default function BestSellers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="bestsellers" className="py-20 md:py-32 bg-radial-bw" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-bestsellers-title">
            Best Sellers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-bestsellers-subtitle">
            Our most loved timepieces, chosen by customers worldwide for their exceptional quality and timeless design.
          </p>
        </motion.div>

        <div className="relative">
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent>
              {bestSellers.map((product, index) => (
                <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
