import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">GRIT <span className="text-primary">X</span></h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering athletes and communities with world-class facilities and innovative training environments. The future of performance is here.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook className="h-5 w-5" />} href="#" />
              <SocialIcon icon={<Twitter className="h-5 w-5" />} href="#" />
              <SocialIcon icon={<Instagram className="h-5 w-5" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Explore</h3>
            <ul className="space-y-4">
              <FooterLink to="/facilities">Facilities</FooterLink>
              <FooterLink to="/memberships">Memberships</FooterLink>
              <FooterLink to="/events">Events</FooterLink>
              <FooterLink to="/about">Our Story</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Visit Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Grit Avenue, Sport City<br/>ST 90210, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">contact@gritx.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6">Stay Updated</h3>
            <p className="text-sm mb-4">Subscribe for the latest events and exclusive offers.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white text-sm transition-colors"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-primary rounded-md text-black hover:bg-white transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} GRIT X Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a href={href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300">
    {icon}
  </a>
);

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm hover:text-primary transition-colors flex items-center gap-2 group">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
      {children}
    </Link>
  </li>
);

export default Footer;
