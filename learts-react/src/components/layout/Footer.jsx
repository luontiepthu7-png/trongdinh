export default function Footer() {
  return (
    <footer className="footer2-section bg-white border-top">
      <div className="container">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-col widget-about">
            <img 
              src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/logo/logo-2.webp" 
              alt="Learts Logo" 
              className="footer-logo" 
            />
            <p>
              Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, 
              where you can enjoy yourself while pulling out some ideas and busy perfecting your work.
            </p>
          </div>

          {/* Nav Column 1 */}
          <div className="footer-col">
            <ul className="widget-list">
              <li><a href="#" onClick={(e) => e.preventDefault()}>About us</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Store location</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Contact</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Orders</a></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="footer-col">
            <ul className="widget-list">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Returns</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Support Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Size Guide</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>FAQs</a></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="footer-col widget-social">
            <ul className="widget-list">
              <li>
                <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> Youtube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer2-copyright">
          <p className="copyright text-center">
            &copy; {new Date().getFullYear()} learts. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
