
import React from 'react';
import { Search, MapPin, ArrowRight, MessageSquare } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">How InstaCare Works</h2>
          <p className="text-lg text-foreground/80">
            Our platform combines real-time data collection with machine learning to provide accurate ER wait time predictions.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                icon: <Search className="h-8 w-8 text-white" />,
                title: "Find Nearby ERs",
                description: "Enter your location to see wait times at hospitals near you.",
                iconBg: "bg-instacare-600"
              },
              {
                icon: <MapPin className="h-8 w-8 text-white" />,
                title: "Compare Wait Times",
                description: "View predicted wait times for each facility and choose the fastest option.",
                iconBg: "bg-instacare-700"
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-white" />,
                title: "Get Directions",
                description: "Follow turn-by-turn directions to your chosen hospital.",
                iconBg: "bg-medgreen-500"
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-white" />,
                title: "Provide Feedback",
                description: "Anonymously confirm actual wait times to improve future predictions.",
                iconBg: "bg-medgreen-600"
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`${item.iconBg} w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-6`}>
                  {item.icon}
                  <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                <p className="text-foreground/70 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">The Technology Behind InstaCare</h3>
              <p className="text-foreground/80 mb-6">
                Our prediction model uses multiple data sources to provide the most accurate wait time estimates possible.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2">Hospital-provided Data</h4>
                  <p className="text-sm text-foreground/70">
                    Where available, we connect to official hospital APIs to get direct wait time reports.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2">Historical Patterns</h4>
                  <p className="text-sm text-foreground/70">
                    We analyze trends by time of day, day of week, and seasonal factors to improve predictions.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2">Crowdsourced Verification</h4>
                  <p className="text-sm text-foreground/70">
                    Anonymous user reports help validate and correct our predictions in real-time.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2">Machine Learning</h4>
                  <p className="text-sm text-foreground/70">
                    Our algorithms continuously improve as they process more data and learn from outcomes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-md w-full">
                <div className="p-4 bg-gradient-to-r from-instacare-600 to-instacare-700">
                  <h3 className="text-white font-medium">Wait Time Prediction Model</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="h-16 bg-gray-100 rounded flex items-center px-4">
                      <div className="w-3/4">
                        <div className="h-2 bg-instacare-200 rounded-full w-full"></div>
                        <div className="text-xs mt-1 text-gray-500">Historical data</div>
                      </div>
                      <div className="w-1/4 text-right text-xs text-gray-500">70%</div>
                    </div>
                    
                    <div className="h-16 bg-gray-100 rounded flex items-center px-4">
                      <div className="w-1/2">
                        <div className="h-2 bg-medgreen-200 rounded-full w-full"></div>
                        <div className="text-xs mt-1 text-gray-500">Real-time reports</div>
                      </div>
                      <div className="w-1/2 text-right text-xs text-gray-500">20%</div>
                    </div>
                    
                    <div className="h-16 bg-gray-100 rounded flex items-center px-4">
                      <div className="w-1/4">
                        <div className="h-2 bg-yellow-200 rounded-full w-full"></div>
                        <div className="text-xs mt-1 text-gray-500">External factors</div>
                      </div>
                      <div className="w-3/4 text-right text-xs text-gray-500">10%</div>
                    </div>
                    
                    <div className="bg-instacare-50 p-4 rounded-lg mt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">Prediction accuracy</div>
                          <div className="text-xs text-gray-500">Averaging within 12 minutes</div>
                        </div>
                        <div className="text-instacare-700 font-bold">87%</div>
                      </div>
                    </div>
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

export default HowItWorks;
