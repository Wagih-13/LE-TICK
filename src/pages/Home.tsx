import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import BestSellers from '@/components/BestSellers';
import NewArrivals from '@/components/NewArrivals';
import VideoHero from '@/components/VideoHero';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
 

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <BestSellers />
      <NewArrivals />
      <VideoHero />
      <Testimonials />
      <Newsletter />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
