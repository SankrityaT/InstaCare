
import React from 'react';
import { Clock, Instagram, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-instacare-400" />
              <span className="font-bold text-xl">Insta<span className="text-medgreen-400">Care</span></span>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              InstaCare helps you find the fastest emergency care when every minute counts.
              Our machine learning platform predicts ER wait times so you can make informed decisions.
            </p>
            
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-instacare-600 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Our Mission', 'Team', 'Careers', 'Contact Us'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {['Blog', 'FAQ', 'Privacy Policy', 'Terms of Service', 'Support'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} InstaCare. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
