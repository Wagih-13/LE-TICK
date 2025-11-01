import { Product } from '@/components/ProductCard';
import silverWatch from '@assets/generated_images/Silver_chronograph_watch_product_38ee6ab0.png';
import goldWatch from '@assets/generated_images/Gold_dress_watch_product_bf3ee143.png';
import blueWatch from '@assets/generated_images/Blue_diving_watch_product_4a6b275b.png';
import roseGoldWatch from '@assets/generated_images/Rose_gold_skeleton_watch_c378b8df.png';
import blackWatch from '@assets/generated_images/Black_tactical_watch_product_f1f951a8.png';

export const allProducts: Product[] = [
  { 
    id: '1', 
    name: 'Classic Chronograph', 
    price: 2499, 
    image: silverWatch,
    description: 'A timeless silver chronograph watch featuring precision Swiss movement, sapphire crystal glass, and water resistance up to 100m. Perfect for both formal and casual occasions.'
  },
  { 
    id: '2', 
    name: 'Elegant Gold Dress', 
    price: 3299, 
    image: goldWatch,
    description: 'Luxurious gold dress watch with an elegant design. Features automatic movement, scratch-resistant sapphire crystal, and premium leather strap. A statement piece for any collection.'
  },
  { 
    id: '3', 
    name: 'Ocean Diver Pro', 
    price: 1899, 
    image: blueWatch,
    description: 'Professional diving watch with 300m water resistance. Equipped with unidirectional rotating bezel, luminous hands, and durable stainless steel construction. Built for adventure.'
  },
  { 
    id: '4', 
    name: 'Rose Gold Skeleton', 
    price: 4599, 
    image: roseGoldWatch,
    description: 'Exquisite skeleton watch showcasing intricate mechanical movement. Rose gold case with transparent dial reveals the beauty of watchmaking craftsmanship. A true masterpiece.'
  },
  { 
    id: '5', 
    name: 'Tactical Pro Black', 
    price: 1599, 
    image: blackWatch, 
    isNew: true,
    description: 'Military-grade tactical watch with rugged black design. Features shock resistance, night vision compatibility, and multi-function display. Built to withstand extreme conditions.'
  },
  { 
    id: '6', 
    name: 'Silver Executive', 
    price: 2799, 
    image: silverWatch, 
    isNew: true,
    description: 'Sophisticated executive timepiece with refined silver finish. Combines classic elegance with modern functionality. Perfect for the modern professional.'
  },
  { 
    id: '7', 
    name: 'Deep Blue Ceramic', 
    price: 2299, 
    image: blueWatch, 
    isNew: true,
    description: 'Contemporary ceramic watch with stunning deep blue dial. Scratch-resistant ceramic bezel and case provide durability with style. A modern classic.'
  },
  { 
    id: '8', 
    name: 'Skeleton Masterpiece', 
    price: 5299, 
    image: roseGoldWatch, 
    isNew: true,
    description: 'Ultimate skeleton watch featuring exposed automatic movement with rose gold accents. Every component visible through the transparent case. A work of art on your wrist.'
  },
];

export const bestSellers = allProducts.filter(p => ['1', '2', '3', '4'].includes(p.id));
export const newArrivals = allProducts.filter(p => p.isNew);

export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
}
