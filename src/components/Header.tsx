
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Clock, AlertCircle } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-instacare-600" />
          <span className="font-bold text-xl text-instacare-800">Insta<span className="text-medgreen-500">Care</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-foreground/80 hover:text-instacare-600 transition-colors">Problem</a>
          <a href="#solution" className="text-foreground/80 hover:text-instacare-600 transition-colors">Solution</a>
          <a href="#how-it-works" className="text-foreground/80 hover:text-instacare-600 transition-colors">How It Works</a>
          <a href="#benefits" className="text-foreground/80 hover:text-instacare-600 transition-colors">Benefits</a>
          <Button className="bg-instacare-600 hover:bg-instacare-700">Get Early Access</Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t">
          <nav className="flex flex-col gap-4">
            <a 
              href="#problem" 
              className="text-foreground/80 hover:text-instacare-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Problem
            </a>
            <a 
              href="#solution" 
              className="text-foreground/80 hover:text-instacare-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Solution
            </a>
            <a 
              href="#how-it-works" 
              className="text-foreground/80 hover:text-instacare-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#benefits" 
              className="text-foreground/80 hover:text-instacare-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </a>
            <Button 
              className="bg-instacare-600 hover:bg-instacare-700 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Early Access
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
