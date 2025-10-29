import { motion } from 'framer-motion';

export default function VideoHero() {
  return (
    <section id="videohero" className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-black">
   <video
  className="absolute inset-0 w-full h-full object-cover"
  src="/videos/watch-hero.mp4"
  poster="/videos/watch-hero.jpg"
  preload="metadata"
  autoPlay
  muted
  loop
  playsInline
/>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-white text-3xl md:text-5xl font-serif font-bold mb-3">Crafted for Motion</h2>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
            Experience our watches in action. Precision. Elegance. Endurance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
