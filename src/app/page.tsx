import React from 'react';
import Header from '@/components/Header';
// Remove the SignUpForm import
import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';

import Footer from '@/components/Footer';
// The SignUpForm import should be removed

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <Footer />
    </main>
  );
}
