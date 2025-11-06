'use client';

import React from 'react';
import { Zap, Github, Heart, Twitter, Linkedin, Mail, ArrowRight, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-12 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center">
                <span className="font-black text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  InstaCare
                </span>
                <Sparkles className="h-5 w-5 text-purple-400 ml-1 animate-pulse" />
              </div>
            </a>
            
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              InstaCare helps you find the fastest emergency care when every minute counts. 
              Our <span className="text-indigo-400 font-semibold">AI-powered platform</span> predicts ER wait times 
              so you can make <span className="text-purple-400 font-semibold">informed decisions</span>.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Github className="h-5 w-5" />, href: "https://github.com/SankrityaT/instant-waitwise", label: "GitHub" },
                { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Problem', href: '#problem' },
                { label: 'Solution', href: '#solution' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Benefits', href: '#benefits' }
              ].map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {[
                { label: 'View Hospitals', href: '/hospitals' },
                { label: 'Submit Report', href: '/report' },
                { label: 'Documentation', href: '#' },
                { label: 'API Access', href: '#' }
              ].map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} InstaCare. Built with{' '}
              <Heart className="inline h-4 w-4 text-red-500 fill-red-500 mx-1" />
              for better healthcare.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="mailto:contact@instacare.com" className="text-gray-500 hover:text-pink-400 transition-colors flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
