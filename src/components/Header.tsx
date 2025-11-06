'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Sparkles } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-3 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
        : 'py-5 bg-white/95 backdrop-blur-lg'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <span className="font-black text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                InstaCare
              </span>
              <Sparkles className="h-4 w-4 text-purple-600 ml-1 animate-pulse" />
            </div>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { href: '#problem', label: 'Problem' },
              { href: '#solution', label: 'Solution' },
              { href: '#how-it-works', label: 'How It Works' },
              { href: '#benefits', label: 'Benefits' }
            ].map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
            <div className="ml-4 flex items-center gap-3">
              <Button 
                variant="outline"
                className="border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 font-semibold"
                onClick={() => window.location.href = '/hospitals'}
              >
                View Hospitals
              </Button>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.location.href = '/hospitals'}
              >
                <Zap className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl animate-fade-in-up">
          <nav className="container-custom py-6 flex flex-col gap-2">
            {[
              { href: '#problem', label: 'Problem', emoji: '⚠️' },
              { href: '#solution', label: 'Solution', emoji: '💡' },
              { href: '#how-it-works', label: 'How It Works', emoji: '⚙️' },
              { href: '#benefits', label: 'Benefits', emoji: '✨' }
            ].map((item, i) => (
              <a 
                key={item.href}
                href={item.href} 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-xl">{item.emoji}</span>
                {item.label}
              </a>
            ))}
            <div className="mt-4 space-y-3">
              <Button 
                variant="outline"
                className="w-full border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 font-semibold"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.href = '/hospitals';
                }}
              >
                View Hospitals
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.href = '/hospitals';
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;