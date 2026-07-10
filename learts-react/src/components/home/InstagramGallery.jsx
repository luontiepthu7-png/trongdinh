export default function InstagramGallery() {
  const INSTA_IMAGES = [
    'https://html-demo-orcin.vercel.app/premium/learts/assets/images/instagram/instagram-1.webp',
    'https://html-demo-orcin.vercel.app/premium/learts/assets/images/instagram/instagram-2.webp',
    'https://html-demo-orcin.vercel.app/premium/learts/assets/images/instagram/instagram-3.webp',
    'https://html-demo-orcin.vercel.app/premium/learts/assets/images/instagram/instagram-4.webp',
    'https://html-demo-orcin.vercel.app/premium/learts/assets/images/instagram/instagram-1.webp', // loop or placeholder
  ];

  return (
    <section className="section-padding border-top instagram-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-title2 text-center">
          <h3 className="sub-title">Follow us on Instagram</h3>
          <h2 className="title">@learts_shop</h2>
        </div>

        {/* Feed Grid */}
        <div className="instafeed-grid">
          {INSTA_IMAGES.map((imgUrl, idx) => (
            <a 
              key={idx}
              className="instafeed-item" 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src={imgUrl} alt={`Instagram ${idx + 1}`} loading="lazy" />
              <div className="insta-overlay">
                <i className="fab fa-instagram"></i>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
