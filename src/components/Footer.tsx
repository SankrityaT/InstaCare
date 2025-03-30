
import React from 'react';
import { Clock, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-instacare-400" />
              <span className="font-bold text-xl">Insta<span className="text-medgreen-400">Care</span></span>
            </div>
            
            <p className="text-gray-400 max-w-md">
              InstaCare helps you find the fastest emergency care when every minute counts.
              Our machine learning platform predicts ER wait times so you can make informed decisions.
            </p>
          </div>
          
          <a 
            href="https://github.com/SankrityaT/instant-waitwise" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-instacare-600 transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} InstaCare. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
