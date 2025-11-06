'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Sparkles, MapPin, Users, Zap } from "lucide-react";
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Healthcare Intelligence
              </span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="block text-gray-900">Your Time.</span>
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Our Mission.
                </span>
              </h1>
              <div className="h-2 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light">
              Predict ER wait times with{' '}
              <span className="font-semibold text-indigo-600">AI precision</span>.
              Find the fastest care when every second counts.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  10+
                </div>
                <div className="text-xs text-gray-600 mt-1">Hospitals</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  98%
                </div>
                <div className="text-xs text-gray-600 mt-1">Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-xs text-gray-600 mt-1">Real-time</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/hospitals">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Find Fastest ER Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-6 text-lg rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                >
                  How It Works
                </Button>
              </Link>
            </div>
            
            {/* Live Indicator */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">1,247+ users</span> saved time today
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Interactive Card */}
          <div className="relative">
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-xl animate-float"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl animate-float animation-delay-2000"></div>
            
            {/* Main Card */}
            <div className="relative perspective-1000">
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                {/* Gradient Header */}
                <div className="relative p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/10"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-2xl mb-1">Live Wait Times</h3>
                      <p className="text-white/80 text-sm">Updated 2 min ago</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Hospital List */}
                <div className="p-6 space-y-3">
                  {[
                    { hospital: "Banner University Medical Center", time: "23", mins: "minutes", status: "Low", color: "emerald", miles: "2.5" },
                    { hospital: "Mayo Clinic Hospital", time: "1h", mins: "45m", status: "Medium", color: "amber", miles: "3.8" },
                    { hospital: "St. Joseph's Hospital", time: "3h", mins: "20m", status: "High", color: "red", miles: "5.2" },
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="group relative p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {item.hospital}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{item.miles} miles away</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {item.time}
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Low" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : item.status === "Medium" 
                                ? "bg-amber-100 text-amber-700" 
                                : "bg-red-100 text-red-700"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* View All Button */}
                  <Link href="/hospitals">
                    <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 rounded-xl group">
                      <MapPin className="mr-2 h-4 w-4" />
                      View All Nearby Hospitals
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;