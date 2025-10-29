import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import aboutImage from '@assets/generated_images/Watchmaking_craftsmanship_about_image_386a74bb.png';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-20 md:py-32 bg-radial-bw" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" data-testid="text-about-title">
              High‑Quality Imported Watches
            </h2>
            <div className="space-y-4 text-muted-foreground max-w-prose">
              <p data-testid="text-about-p1">
                We offer a carefully curated selection of imported watches from leading global brands, with guaranteed authenticity and dependable quality. Each piece is inspected against strict standards to ensure outstanding performance and long‑lasting durability.
              </p>
              <p data-testid="text-about-p2">
                We focus on every detail—from premium materials to precise movements—for a luxurious experience that blends refined design with advanced technology. All watches arrive in original packaging with official warranty booklets.
              </p>
              <p data-testid="text-about-p3">
                Whether you’re looking for an elegant everyday watch or a limited‑edition collector’s piece, we provide options to match your style with competitive pricing and dedicated after‑sales support.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-md overflow-hidden">
              <img
                src={aboutImage}
                alt="Watchmaking craftsmanship"
                className="w-full h-auto"
                data-testid="img-about"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
