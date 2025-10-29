import ProductCard from '../ProductCard';
import silverWatch from '@assets/generated_images/Silver_chronograph_watch_product_38ee6ab0.png';

export default function ProductCardExample() {
  const product = {
    id: '1',
    name: 'Classic Chronograph',
    price: 2499,
    image: silverWatch,
    isNew: true,
  };

  return (
    <div className="max-w-sm">
      <ProductCard product={product} />
    </div>
  );
}
