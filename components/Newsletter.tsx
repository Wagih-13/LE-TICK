import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    toast({
      title: 'Successfully subscribed!',
      description: 'Thank you for subscribing to our newsletter.',
    });
    setEmail('');
  };

  return (
    <section className="py-20 md:py-32 bg-radial-bw" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Mail className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-newsletter-title">
            Stay Updated
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto" data-testid="text-newsletter-subtitle">
            Subscribe to our newsletter to get updates about new collections, exclusive offers, and special discounts.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-newsletter-email"
            />
            <Button
              type="submit"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
