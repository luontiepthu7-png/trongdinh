import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    bgColor: '#EEE5DD',
    image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-1-1.webp',
    subtitle: 'DAILY OFFER',
    title: 'Country Feast Set',
    link: '/shop',
    hotspots: [
      {
        id: 'hs1-1',
        top: '60%',
        left: '45%',
        product: {
          name: 'Country Feast set',
          price: '$39.00',
          image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-1-2.webp',
          productId: 'p7'
        }
      }
    ]
  },
  {
    id: 2,
    bgColor: '#F5F1F1',
    image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-2-1.webp',
    subtitle: 'DAILY OFFER',
    title: 'DESIGNS FOR YOU',
    link: '/shop',
    hotspots: [
      {
        id: 'hs2-1',
        top: '40%',
        left: '30%',
        product: {
          name: 'Ceramic Flower Vase',
          price: '$29.00',
          image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-2-2.webp',
          productId: 'p5'
        }
      },
      {
        id: 'hs2-2',
        top: '65%',
        left: '60%',
        product: {
          name: 'Lucky Wooden Elephant',
          price: '$35.00',
          image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-2-3.webp',
          productId: 'p2'
        }
      }
    ]
  },
  {
    id: 3,
    bgColor: '#F1DED0',
    image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-3-1.webp',
    subtitle: 'DAILY OFFER',
    title: 'Country Feast Set',
    link: '/shop',
    hotspots: [
      {
        id: 'hs3-1',
        top: '55%',
        left: '35%',
        product: {
          name: 'Walnut Cutting Board',
          price: '$100.00',
          image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-3-2.webp',
          productId: 'p1'
        }
      },
      {
        id: 'hs3-2',
        top: '45%',
        left: '70%',
        product: {
          name: 'Handmade Wool Basket',
          price: '$45.00',
          image: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/slider/home2/slider-3-3.webp',
          productId: 'p6'
        }
      }
    ]
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      setActiveHotspot(null);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setActiveHotspot(null);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setActiveHotspot(null);
  };

  const toggleHotspot = (id, e) => {
    e.stopPropagation();
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const slide = SLIDES[currentSlide];

  return (
    <section className="home2-slider" style={{ backgroundColor: slide.bgColor }}>
      <div className="slider-wrapper">
        {/* Slide Item */}
        <div className="slide-item active-slide">
          {/* Slide Content */}
          <div className="slide-content">
            <h5 className="sub-title">{slide.subtitle}</h5>
            <h2 className="title">{slide.title}</h2>
            <div className="link">
              <Link to={slide.link}>shop collection</Link>
            </div>
          </div>

          {/* Slide Image with Hotspots */}
          <div className="slide-image-container">
            <img src={slide.image} alt={slide.title} className="slide-main-image" />
            
            {slide.hotspots.map((hs) => (
              <div 
                key={hs.id} 
                className="slide-pointer-container"
                style={{ top: hs.top, left: hs.left }}
              >
                <button 
                  className={`slide-pointer ${activeHotspot === hs.id ? 'active' : ''}`}
                  onClick={(e) => toggleHotspot(hs.id, e)}
                >
                  <span>+</span>
                </button>
                
                {activeHotspot === hs.id && (
                  <div className="slide-product-popover">
                    <div className="popover-image">
                      <img src={hs.product.image} alt={hs.product.name} />
                    </div>
                    <div className="popover-info">
                      <h6 className="popover-title">
                        <Link to={`/product/${hs.product.productId}`}>{hs.product.name}</Link>
                      </h6>
                      <span className="popover-price">{hs.product.price}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Slide Page Indicator */}
          <div className="slide-pages">
            <span className="current">{slide.id}</span>
            <span className="border-line"></span>
            <span className="total">{SLIDES.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button className="slider-nav slider-prev" onClick={handlePrev} aria-label="Previous slide">
        <i className="ti-angle-left"></i>
      </button>
      <button className="slider-nav slider-next" onClick={handleNext} aria-label="Next slide">
        <i className="ti-angle-right"></i>
      </button>
    </section>
  );
}
