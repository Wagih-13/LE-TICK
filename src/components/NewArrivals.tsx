import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import ProductCard from './ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { newArrivals } from '@/data/products';

export default function NewArrivals() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="newarrivals" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-radial-bw" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4" data-testid="text-newarrivals-title">
            New Arrivals
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2" data-testid="text-newarrivals-subtitle">
            Just arrived: The latest additions to our collection, featuring cutting-edge design and innovation.
          </p>
        </motion.div>

        <div className="relative">
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent className="-ml-2 sm:-ml-4">
              {newArrivals.map((product, index) => (
                <CarouselItem key={product.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <ProductCard product={product} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="w-full flex justify-center gap-2 mt-6 sm:mt-8 md:mt-10">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
