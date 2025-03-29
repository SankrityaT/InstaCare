
import React from 'react';
import { AlertCircle, Clock, UserX, Activity, TrendingUp } from "lucide-react";

const Problem = () => {
  return (
    <section id="problem" className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-red-100 text-red-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
            The Crisis
          </span>
          <h2 className="mb-4 relative">
            ER Overcrowding is <span className="text-destructive relative">
              Dangerous
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-red-200 rounded-full"></span>
            </span>
          </h2>
          <p className="text-lg text-foreground/80">
            Emergency room wait times can vary dramatically, and patients often have no way to know
            which nearby hospital can provide the fastest care.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock className="h-10 w-10 text-instacare-600" />,
              title: "Long Wait Times",
              description: "Average ER wait times can exceed 4 hours during peak periods, delaying critical care.",
              stat: "4+ hours",
              statLabel: "average wait"
            },
            {
              icon: <AlertCircle className="h-10 w-10 text-destructive" />,
              title: "Critical Delays",
              description: "Every minute counts in emergencies like heart attacks, strokes, and severe injuries.",
              stat: "30%",
              statLabel: "increased mortality risk per hour"
            },
            {
              icon: <UserX className="h-10 w-10 text-medgreen-600" />,
              title: "Uneven Distribution",
              description: "Some ERs are overcrowded while others nearby may have shorter wait times.",
              stat: "60%",
              statLabel: "capacity variation"
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-8 border border-gray-100 card-shadow hover:border-instacare-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-foreground/70 mb-4">{item.description}</p>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-2xl font-bold text-instacare-700">{item.stat}</div>
                <div className="text-sm text-foreground/60">{item.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-6 md:p-10 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-100 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-red-100 z-10 relative shadow-md">
                  <Activity className="h-16 w-16 text-destructive" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-red-200 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-red-200 rounded-full animate-pulse-slow delay-300"></div>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-red-200 text-red-800 mb-4">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Alarming Statistics</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">The Hidden Healthcare Crisis</h3>
              <p className="text-lg leading-relaxed">
                Studies show that longer ER wait times are associated with worse outcomes, including higher mortality rates.
                For time-sensitive conditions like stroke or heart attack, delays can lead to permanent damage or death.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="bg-white/80 backdrop-blur p-4 rounded-lg flex-1">
                  <div className="text-3xl font-bold text-destructive">47%</div>
                  <div className="text-sm text-foreground/70">increase in negative outcomes due to delays</div>
                </div>
                <div className="bg-white/80 backdrop-blur p-4 rounded-lg flex-1">
                  <div className="text-3xl font-bold text-destructive">1 in 4</div>
                  <div className="text-sm text-foreground/70">patients leave without being seen</div>
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
