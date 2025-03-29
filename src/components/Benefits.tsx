
import React from 'react';
import { Clock, Heart, Users, Shield } from 'lucide-react';

const Benefits = () => {
  return (
    <section id="benefits" className="section bg-gradient-to-br from-instacare-50 to-blue-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Why Use InstaCare?</h2>
          <p className="text-lg text-foreground/80">
            Our platform provides critical information when you need it most, potentially saving lives by reducing wait times.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Clock className="h-10 w-10 text-instacare-600" />,
              title: "Save Precious Time",
              description: "Find the fastest emergency care based on real-time wait predictions."
            },
            {
              icon: <Heart className="h-10 w-10 text-red-500" />,
              title: "Better Outcomes",
              description: "For critical conditions, faster treatment leads to improved recovery chances."
            },
            {
              icon: <Users className="h-10 w-10 text-medgreen-600" />,
              title: "Reduce Overcrowding",
              description: "Help distribute patients more evenly across available emergency rooms."
            },
            {
              icon: <Shield className="h-10 w-10 text-instacare-800" />,
              title: "Peace of Mind",
              description: "Know what to expect before you arrive at the emergency room."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-8 border border-gray-100 card-shadow">
              <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center rounded-full px-4 py-1 bg-medgreen-100 text-medgreen-800 mb-6">
                <Heart className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Using Underutilized Data to Potentially Save Lives
              </h3>
              
              <p className="text-foreground/80 leading-relaxed mb-6">
                Hospital wait times are often publicly available but not easily accessible or understandable for patients.
                By aggregating this data and making it actionable, we help patients find faster care when it matters most.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-medgreen-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-medgreen-600 text-sm">✓</span>
                  </div>
                  <p className="text-foreground/70">Every minute saved can make a difference in critical emergencies</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-medgreen-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-medgreen-600 text-sm">✓</span>
                  </div>
                  <p className="text-foreground/70">Better distribution of patients improves hospital efficiency</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-medgreen-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-medgreen-600 text-sm">✓</span>
                  </div>
                  <p className="text-foreground/70">Transparent information empowers better healthcare decisions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-instacare-600 to-instacare-800 text-white p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                The Impact of ER Wait Times
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">4.3 hrs</div>
                  <p className="text-white/80">Average ER wait time during peak periods</p>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-white mb-2">30%</div>
                  <p className="text-white/80">Patients leave without being seen due to long waits</p>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-white mb-2">1.5x</div>
                  <p className="text-white/80">Mortality risk increase with every hour of delay for critical conditions</p>
                </div>
                
                <div className="text-sm text-white/60 pt-4">
                  Source: Healthcare Access and Quality Index study, 2022
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
