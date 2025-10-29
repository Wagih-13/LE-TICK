import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

import customer1 from '@assets/generated_images/Male_customer_testimonial_portrait_d832790b.png';
import customer2 from '@assets/generated_images/Female_customer_testimonial_portrait_a64527ff.png';
import customer3 from '@assets/generated_images/Young_professional_testimonial_portrait_b1c6af99.png';

const testimonials = [
  {
    id: 1,
    name: 'Michael Chen',
    location: 'New York, USA',
    image: customer1,
    rating: 5,
    text: 'The craftsmanship is exceptional. I\'ve owned luxury watches before, but this one truly stands out. Worth every penny.',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    location: 'London, UK',
    image: customer2,
    rating: 5,
    text: 'Absolutely stunning timepiece! The attention to detail is remarkable. It\'s become my everyday companion.',
  },
  {
    id: 3,
    name: 'David Martinez',
    location: 'Dubai, UAE',
    image: customer3,
    rating: 5,
    text: 'Purchased as a gift for myself and couldn\'t be happier. The customer service was outstanding too.',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-radial-bw" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-testimonials-title">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-testimonials-subtitle">
            Join thousands of satisfied customers who trust us with their most precious moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-6" data-testid={`text-testimonial-${testimonial.id}`}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" data-testid={`text-customer-name-${testimonial.id}`}>
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-customer-location-${testimonial.id}`}>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
