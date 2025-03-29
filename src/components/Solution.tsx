
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, BarChart, Brain, Users } from "lucide-react";

const Solution = () => {
  return (
    <section id="solution" className="section bg-gradient-to-br from-instacare-50 to-blue-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="mb-6">Our Solution: <span className="gradient-text">Smart Wait Time Prediction</span></h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              InstaCare uses machine learning and crowdsourced data to predict ER wait times at hospitals
              near you, helping you find the fastest care when every minute counts.
            </p>
            
            <div className="space-y-6">
              {[
                {
                  icon: <Database className="h-6 w-6 text-instacare-600" />,
                  title: "Data Aggregation",
                  description: "We collect anonymized wait-time data from hospitals through public APIs and crowdsourcing."
                },
                {
                  icon: <Brain className="h-6 w-6 text-instacare-600" />,
                  title: "AI Prediction Model",
                  description: "Our machine learning algorithms predict wait times based on historical patterns and real-time data."
                },
                {
                  icon: <BarChart className="h-6 w-6 text-instacare-600" />,
                  title: "Real-time Updates",
                  description: "Get instant notifications when wait times change or when a less crowded ER is available nearby."
                },
                {
                  icon: <Users className="h-6 w-6 text-instacare-600" />,
                  title: "Community-powered",
                  description: "Users contribute anonymous data to improve predictions for everyone."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">{item.title}</h3>
                    <p className="text-foreground/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <Button size="lg" className="bg-instacare-600 hover:bg-instacare-700">
                Learn More About Our Technology
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Our MVP Approach</h3>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-100 rounded-lg">
                <h4 className="font-medium text-lg mb-2">Data Collection Engine</h4>
                <p className="text-foreground/70">
                  Web scraper that connects to public hospital APIs and collects wait time data where available.
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg">
                <h4 className="font-medium text-lg mb-2">Prediction Algorithm</h4>
                <p className="text-foreground/70">
                  Simple but effective linear regression model to predict wait times based on historical patterns.
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg">
                <h4 className="font-medium text-lg mb-2">User Interface</h4>
                <p className="text-foreground/70">
                  Clean, map-based interface showing nearby hospitals with color-coded wait time indicators.
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg">
                <h4 className="font-medium text-lg mb-2">Anonymous Feedback Loop</h4>
                <p className="text-foreground/70">
                  Users can confirm or correct wait times, improving predictions for everyone.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-medgreen-700 mb-2">Data Privacy Commitment</h4>
              <p className="text-medgreen-700/80 text-sm">
                All user data is anonymous. We never collect personal health information or identifiable data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
