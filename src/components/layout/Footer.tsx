import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 border-b border-white/10 pb-16">
        
        {/* Brand & Newsletter */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2 text-3xl font-bold text-white">
            <span className="w-10 h-10 rounded-lg bg-primary text-secondary flex-center text-2xl">E</span>
            EstateX
          </Link>
          <p className="text-neutral-400 max-w-sm text-lg">
            Find more than a house. Find home. Experience premium real estate services with EstateX.
          </p>
          
          <div className="mt-8 space-y-4">
            <h4 className="font-semibold text-lg text-secondary">Subscribe to Newsletter</h4>
            <div className="flex gap-2 max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white"
              />
              <Button className="px-5"><ArrowRight className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6">
          <h4 className="font-semibold text-lg text-white">Company</h4>
          <ul className="space-y-4">
            {['About Us', 'Careers', 'Blog', 'Contact'].map(link => (
              <li key={link}>
                <Link to="#" className="text-neutral-400 hover:text-secondary transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-semibold text-lg text-white">Services</h4>
          <ul className="space-y-4">
            {['Buy Property', 'Sell Property', 'Rent Property', 'Property Valuation'].map(link => (
              <li key={link}>
                <Link to="#" className="text-neutral-400 hover:text-secondary transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-semibold text-lg text-white">Legal</h4>
          <ul className="space-y-4">
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map(link => (
              <li key={link}>
                <Link to="#" className="text-neutral-400 hover:text-secondary transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="container-custom pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-neutral-500">© {new Date().getFullYear()} EstateX. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex-center text-neutral-400 hover:bg-primary hover:text-white transition-all"><Share2 className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
