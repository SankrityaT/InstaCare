
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, BarChart, Brain, Users, Sparkles, Shield, Zap, Target, TrendingUp, CheckCircle2 } from "lucide-react";

const Solution = () => {
  return (
    <section id="solution" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">The Solution</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Wait Time Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            InstaCare uses <span className="font-semibold text-indigo-600">machine learning</span> and crowdsourced data to predict ER wait times,
            helping you find the <span className="font-semibold text-indigo-600">fastest care</span> when every minute counts.
          </p>
        </div>
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Feature Cards */}
          <div className="space-y-6">
            {[
              {
                icon: <Database className="h-6 w-6 text-white" />,
                title: "Data Aggregation",
                description: "We collect anonymized wait-time data from hospitals through public APIs and crowdsourcing.",
                gradient: "from-blue-500 to-indigo-600"
              },
              {
                icon: <Brain className="h-6 w-6 text-white" />,
                title: "AI Prediction Model",
                description: "Our machine learning algorithms predict wait times based on historical patterns and real-time data.",
                gradient: "from-indigo-500 to-purple-600"
              },
              {
                icon: <Zap className="h-6 w-6 text-white" />,
                title: "Real-time Updates",
                description: "Get instant notifications when wait times change or when a less crowded ER is available nearby.",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: <Users className="h-6 w-6 text-white" />,
                title: "Community-powered",
                description: "Users contribute anonymous data to improve predictions for everyone.",
                gradient: "from-pink-500 to-red-600"
              }
            ].map((item, i) => (
              <div key={i} className="group flex gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right: MVP Card */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-semibold">Our Approach</span>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-8">How We Built It</h3>
                  
                  <div className="space-y-4">
                    {[
                      {
                        title: "Data Collection Engine",
                        description: "Web scraper connecting to public hospital APIs and collecting wait time data."
                      },
                      {
                        title: "Prediction Algorithm",
                        description: "Effective ML model predicting wait times based on historical patterns."
                      },
                      {
                        title: "User Interface",
                        description: "Clean, map-based interface with color-coded wait time indicators."
                      },
                      {
                        title: "Feedback Loop",
                        description: "Users confirm or correct wait times, improving predictions for everyone."
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 text-lg">{item.title}</h4>
                          <p className="text-white/80 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2">Privacy First</h4>
                        <p className="text-white/90 text-sm leading-relaxed">
                          All data is anonymous. We never collect personal health information or identifiable data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center hover:scale-[1.02] transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Prediction Accuracy</div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center hover:scale-[1.02] transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">45min</div>
            <div className="text-gray-600 font-medium">Average Time Saved</div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center hover:scale-[1.02] transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">10k+</div>
            <div className="text-gray-600 font-medium">Lives Impacted</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
