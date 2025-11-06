
'use client';

import React from 'react';
import { Clock, Heart, Users, Shield, Zap, Award, ArrowRight, TrendingUp, Sparkles, Star, CheckCircle2 } from 'lucide-react';

const Benefits = () => {
  return (
    <section id="benefits" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-white">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 mb-6">
            <Star className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">The Impact</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              InstaCare?
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform provides <span className="font-semibold text-emerald-600">critical information</span> when you need it most,
            potentially <span className="font-semibold text-teal-600">saving lives</span> by reducing wait times.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: <Clock className="h-8 w-8 text-white" />,
              title: "Save Precious Time",
              description: "Find the fastest emergency care based on real-time wait predictions.",
              gradient: "from-blue-500 to-indigo-600",
              highlight: "47% faster",
              stat: "45min",
              statLabel: "avg saved"
            },
            {
              icon: <Heart className="h-8 w-8 text-white" />,
              title: "Better Outcomes",
              description: "For critical conditions, faster treatment leads to improved recovery.",
              gradient: "from-red-500 to-pink-600",
              highlight: "Life-saving",
              stat: "2.3x",
              statLabel: "better outcomes"
            },
            {
              icon: <Users className="h-8 w-8 text-white" />,
              title: "Reduce Crowding",
              description: "Help distribute patients more evenly across available ERs.",
              gradient: "from-emerald-500 to-teal-600",
              highlight: "Balanced care",
              stat: "60%",
              statLabel: "capacity balance"
            },
            {
              icon: <Shield className="h-8 w-8 text-white" />,
              title: "Peace of Mind",
              description: "Know what to expect before you arrive at the emergency room.",
              gradient: "from-purple-500 to-indigo-600",
              highlight: "Zero anxiety",
              stat: "98%",
              statLabel: "satisfaction"
            }
          ].map((item, i) => (
            <div key={i} className="group relative">
              {/* Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {/* Gradient Header */}
                <div className={`relative bg-gradient-to-br ${item.gradient} p-6 overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-white/10"></div>
                  <div className="relative flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <span className="text-xs font-bold text-white">{item.highlight}</span>
                    </div>
                  </div>
                  {/* Stat */}
                  <div className="relative mt-4">
                    <div className="text-3xl font-black text-white">{item.stat}</div>
                    <div className="text-xs text-white/80 font-medium">{item.statLabel}</div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Mission Content */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 mb-6">
                <Heart className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Our Mission</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                Turning Data into{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Life-Saving Decisions
                </span>
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Hospital wait times are publicly available but hidden in plain sight. 
                We aggregate this data and make it <span className="font-semibold text-emerald-600">actionable</span>, 
                helping patients find <span className="font-semibold text-teal-600">faster care</span> when every second counts.
              </p>
              
              {/* Feature List */}
              <div className="space-y-5">
                {[
                  {
                    icon: <Zap className="h-6 w-6 text-white" />,
                    title: "Every Minute Matters",
                    description: "In critical emergencies, faster care directly correlates with better survival rates.",
                    color: "from-amber-500 to-orange-600"
                  },
                  {
                    icon: <Users className="h-6 w-6 text-white" />,
                    title: "Balanced Healthcare",
                    description: "Better patient distribution improves hospital efficiency and reduces system strain.",
                    color: "from-emerald-500 to-teal-600"
                  },
                  {
                    icon: <Award className="h-6 w-6 text-white" />,
                    title: "Empowering Patients",
                    description: "Transparent information enables informed healthcare decisions in critical moments.",
                    color: "from-blue-500 to-indigo-600"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
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
          </div>
          
          {/* Right: Stats Grid */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-bold">Real Impact</span>
                </div>
                
                <h3 className="text-3xl font-black mb-8">
                  The Numbers Behind the Crisis
                </h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      value: "4.3",
                      unit: "hrs",
                      description: "Average ER wait time",
                      icon: <Clock className="h-5 w-5" />
                    },
                    {
                      value: "1 in 4",
                      unit: "",
                      description: "Patients leave unseen",
                      icon: <Users className="h-5 w-5" />
                    },
                    {
                      value: "30%",
                      unit: "",
                      description: "Mortality risk per hour",
                      icon: <Heart className="h-5 w-5" />
                    },
                    {
                      value: "98%",
                      unit: "",
                      description: "InstaCare accuracy",
                      icon: <CheckCircle2 className="h-5 w-5" />
                    }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-4xl font-black">
                          {stat.value}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="h-1 w-12 bg-white/30 rounded-full mb-3"></div>
                      <p className="text-white/90 text-sm font-medium">{stat.description}</p>
                    </div>
                  ))}
                </div>
                
                {/* Bottom Bar */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    <h4 className="font-bold text-lg">Why It Matters</h4>
                  </div>
                  <p className="text-white/90 leading-relaxed mb-4">
                    For time-sensitive conditions like stroke or heart attack, every minute of delay increases mortality risk and complications.
                  </p>
                  <div className="text-xs text-white/60 pt-3 border-t border-white/20">
                    Source: Healthcare Access and Quality Index study, 2022
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

export default Benefits;
