'use client';

import React from 'react';
import { Search, MapPin, ArrowRight, MessageSquare, Zap, Database, PieChart, AlertCircle, TrendingUp, Target, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Simple & Effective
          </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            How{' '}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              InstaCare
            </span>
            {' '}Works
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform combines <span className="font-semibold text-indigo-600">real-time data</span> with 
            <span className="font-semibold text-purple-600"> machine learning</span> to provide accurate predictions.
          </p>
        </div>
        
        {/* Process Steps */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 -translate-y-1/2 -z-10"></div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 text-white" />,
                title: "Find Nearby ERs",
                description: "Enter your location to see wait times at hospitals near you.",
                gradient: "from-blue-500 to-indigo-600",
                tag: "Geo-enabled"
              },
              {
                icon: <Target className="h-8 w-8 text-white" />,
                title: "Compare Times",
                description: "View ML-predicted wait times for each facility.",
                gradient: "from-indigo-500 to-purple-600",
                tag: "AI-powered"
              },
              {
                icon: <MapPin className="h-8 w-8 text-white" />,
                title: "Get Directions",
                description: "Follow turn-by-turn directions to your chosen hospital.",
                gradient: "from-purple-500 to-pink-600",
                tag: "Maps integrated"
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-white" />,
                title: "Provide Feedback",
                description: "Help improve predictions for everyone.",
                gradient: "from-pink-500 to-red-600",
                tag: "Community"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4 min-h-[60px]">{item.description}</p>
                  
                  {/* Tag */}
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                    <span className="text-xs font-semibold text-indigo-700">{item.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Technology Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Technology Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-6">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700">Advanced Technology</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-900">
              The Brain Behind{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                the Magic
              </span>
            </h3>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Our prediction model leverages multiple data sources to provide the most accurate wait time estimates possible.
            </p>
            
            {/* Tech Cards */}
            <div className="space-y-5">
              {[
                {
                  icon: <Database className="h-6 w-6 text-white" />,
                  title: "Hospital-provided Data",
                  description: "Direct integration with official hospital databases for real-time reports.",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-white" />,
                  title: "Historical Patterns",
                  description: "Analysis of time-based trends and seasonal factors for better predictions.",
                  color: "from-indigo-500 to-purple-600"
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-white" />,
                  title: "Crowdsourced Data",
                  description: "Anonymous user reports validate and correct predictions in real-time.",
                  color: "from-purple-500 to-pink-600"
                },
                {
                  icon: <AlertCircle className="h-6 w-6 text-white" />,
                  title: "Machine Learning",
                  description: "Algorithms continuously improve as they process more data.",
                  color: "from-pink-500 to-red-600"
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Prediction Model Visualization */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Prediction Model</h4>
                  <p className="text-sm text-gray-500">Data Sources Breakdown</p>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-8">
                {[
                  { label: "Historical Data", value: 40, color: "from-blue-500 to-indigo-600" },
                  { label: "Real-time API", value: 30, color: "from-indigo-500 to-purple-600" },
                  { label: "User Feedback", value: 20, color: "from-purple-500 to-pink-600" },
                  { label: "ML Predictions", value: 10, color: "from-pink-500 to-red-600" }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      <span className={`text-2xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.value}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">98%</div>
                  <div className="text-xs text-gray-600 font-medium">Accuracy Rate</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">24/7</div>
                  <div className="text-xs text-gray-600 font-medium">Live Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;