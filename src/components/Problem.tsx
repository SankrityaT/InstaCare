
'use client';

import React from 'react';
import { AlertCircle, Clock, UserX, Activity, TrendingUp, Skull, AlertTriangle } from "lucide-react";

const Problem = () => {
  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-red-50/30 to-white">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700">The Healthcare Crisis</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            ER Overcrowding is{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Deadly
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-red-200/50 -rotate-1"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Emergency room wait times can vary dramatically. Patients often have no way to know
            which nearby hospital can provide the <span className="font-semibold text-gray-900">fastest, life-saving care</span>.
          </p>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-6 gap-6 mb-12">
          {/* Large Card 1 */}
          <div className="md:col-span-2 group relative bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Long Wait Times</h3>
              <p className="text-white/90 mb-8 text-sm leading-relaxed">
                Average ER wait times can exceed 4 hours during peak periods, delaying critical care.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-5xl font-black text-white mb-1">4+</div>
                <div className="text-white/90 text-sm font-medium">hours average wait</div>
              </div>
            </div>
          </div>
          
          {/* Large Card 2 */}
          <div className="md:col-span-2 group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Critical Delays</h3>
              <p className="text-white/90 mb-8 text-sm leading-relaxed">
                Every minute counts in emergencies like heart attacks, strokes, and severe injuries.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-5xl font-black text-white mb-1">30%</div>
                <div className="text-white/90 text-sm font-medium">mortality risk per hour</div>
              </div>
            </div>
          </div>
          
          {/* Large Card 3 */}
          <div className="md:col-span-2 group relative bg-gradient-to-br from-red-600 to-pink-600 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <UserX className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Uneven Distribution</h3>
              <p className="text-white/90 mb-8 text-sm leading-relaxed">
                Some ERs are overcrowded while others nearby may have shorter wait times.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-5xl font-black text-white mb-1">60%</div>
                <div className="text-white/90 text-sm font-medium">capacity variation</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alarming Statistics Banner */}
        <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100 to-orange-100 rounded-full filter blur-3xl opacity-30"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Icon & Title */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </span>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 mb-4">
                <TrendingUp className="h-3 w-3 text-red-600" />
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Critical Impact</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-4 text-gray-900">
                The Hidden Healthcare Crisis
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Studies show that longer ER wait times are associated with <span className="font-semibold text-red-600">worse outcomes</span>, including higher mortality rates.
                For time-sensitive conditions like stroke or heart attack, <span className="font-semibold text-red-600">delays can be fatal</span>.
              </p>
            </div>
            
            {/* Right: Stats Grid */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="relative z-10">
                  <div className="text-6xl font-black mb-2">47%</div>
                  <div className="text-white/90 text-sm font-medium">
                    Increase in negative outcomes due to delays
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-red-200 rounded-2xl p-5 hover:border-red-400 transition-colors">
                  <div className="text-4xl font-black text-red-600 mb-2">1 in 4</div>
                  <div className="text-gray-600 text-xs font-medium">
                    Patients leave without being seen
                  </div>
                </div>
                
                <div className="bg-white border-2 border-orange-200 rounded-2xl p-5 hover:border-orange-400 transition-colors">
                  <div className="text-4xl font-black text-orange-600 mb-2">2.3x</div>
                  <div className="text-gray-600 text-xs font-medium">
                    Higher risk of complications
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
