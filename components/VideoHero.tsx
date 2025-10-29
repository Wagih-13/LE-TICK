import { motion } from 'framer-motion';

export default function VideoHero() {
  return (
    <section id="videohero" className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-black">
   <video
  className="absolute inset-0 w-full h-full object-cover"
  src="/Cinematic%20Watch%20Product%20Video%20Commercial%20Example%20_%20Rolex%20Timex%20Omega%20Samsung%20Apple%20Jewelry%20Amazon%20Ad.mp4"
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
