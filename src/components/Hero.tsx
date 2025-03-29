
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white to-blue-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center rounded-full px-4 py-1 bg-instacare-100 text-instacare-800">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Predict ER Wait Times</span>
            </div>
            
            <h1 className="font-bold">
              <span className="block">Know before you go.</span>
              <span className="gradient-text">Save precious minutes.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              InstaCare predicts ER wait times so you can find the fastest care in an emergency. 
              Our real-time data helps you make better decisions when every minute counts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-instacare-600 hover:bg-instacare-700">
                Get Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </div>
            
            <div className="pt-4 flex items-center text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-medgreen-500 mr-2 animate-pulse-slow"></span>
              Currently tracking wait times at 200+ hospitals
            </div>
          </div>
          
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <div className="absolute top-0 right-0 left-0 bottom-0 bg-gradient-to-r from-instacare-600/10 to-medgreen-500/10 rounded-3xl transform rotate-3"></div>
            <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md transform -rotate-3 card-shadow">
              <div className="p-6 bg-gradient-to-r from-instacare-600 to-medgreen-500">
                <h3 className="text-white font-bold text-xl">Current ER Wait Times</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { hospital: "Memorial Hospital", time: "15 min", status: "Low" },
                  { hospital: "City Medical Center", time: "42 min", status: "Medium" },
                  { hospital: "University Hospital", time: "87 min", status: "High" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium">{item.hospital}</h4>
                      <span className="text-sm text-gray-500">5.2 miles away</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{item.time}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "Low" 
                          ? "bg-green-100 text-green-800" 
                          : item.status === "Medium" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {item.status} Wait
                      </span>
                    </div>
                  </div>
                ))}
                <Link href="/hospitals">
                  <Button className="w-full bg-instacare-600 hover:bg-instacare-700 mt-4">
                    <MapPin className="mr-2 h-4 w-4" />
                    View All Nearby Hospitals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
