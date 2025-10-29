import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import ProductCard, { type Product } from './ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import blackWatch from '@assets/generated_images/Black_tactical_watch_product_f1f951a8.png';
import silverWatch from '@assets/generated_images/Silver_chronograph_watch_product_38ee6ab0.png';
import blueWatch from '@assets/generated_images/Blue_diving_watch_product_4a6b275b.png';
import roseGoldWatch from '@assets/generated_images/Rose_gold_skeleton_watch_c378b8df.png';

const newArrivals: Product[] = [
  { id: '5', name: 'Tactical Pro Black', price: 1599, image: blackWatch, isNew: true },
  { id: '6', name: 'Silver Executive', price: 2799, image: silverWatch, isNew: true },
  { id: '7', name: 'Deep Blue Ceramic', price: 2299, image: blueWatch, isNew: true },
  { id: '8', name: 'Skeleton Masterpiece', price: 5299, image: roseGoldWatch, isNew: true },
];

export default function NewArrivals() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="newarrivals" className="py-20 md:py-32 bg-radial-bw" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-newarrivals-title">
            New Arrivals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-newarrivals-subtitle">
            Just arrived: The latest additions to our collection, featuring cutting-edge design and innovation.
          </p>
        </motion.div>

        <div className="relative">
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent>
              {newArrivals.map((product, index) => (
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
