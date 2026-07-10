import { useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryList from '../components/home/CategoryList';
import FeaturedProducts from '../components/home/FeaturedProducts';
import InstagramGallery from '../components/home/InstagramGallery';

export default function Home() {
  useEffect(() => {
    document.title = 'Learts – Handmade Shop eCommerce';
  }, []);

  return (
    <div className="page-home">
      <HeroBanner />
      <CategoryList />
      <FeaturedProducts />
      <InstagramGallery />
    </div>
  );
}
