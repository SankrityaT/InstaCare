import React from 'react';
import { Search, MapPin, ArrowRight, MessageSquare, Zap, Database, PieChart, AlertCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-white to-instacare-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-instacare-100 text-instacare-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
            The Process
          </span>
          <h2 className="mb-4">How InstaCare Works</h2>
          <p className="text-lg text-foreground/80">
            Our platform combines real-time data collection with machine learning to provide accurate ER wait time predictions.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                icon: <Search className="h-8 w-8 text-white" />,
                title: "Find Nearby ERs",
                description: "Enter your location to see wait times at hospitals near you.",
                iconBg: "bg-gradient-to-br from-instacare-500 to-instacare-600",
                additionalInfo: "Geo-location enabled"
              },
              {
                icon: <MapPin className="h-8 w-8 text-white" />,
                title: "Compare Wait Times",
                description: "View predicted wait times for each facility and choose the fastest option.",
                iconBg: "bg-gradient-to-br from-instacare-600 to-instacare-700",
                additionalInfo: "ML-powered predictions"
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-white" />,
                title: "Get Directions",
                description: "Follow turn-by-turn directions to your chosen hospital.",
                iconBg: "bg-gradient-to-br from-instacare-700 to-medgreen-500",
                additionalInfo: "Integration with maps"
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-white" />,
                title: "Provide Feedback",
                description: "Anonymously confirm actual wait times to improve future predictions.",
                iconBg: "bg-gradient-to-br from-medgreen-500 to-medgreen-600",
                additionalInfo: "Continuous improvement"
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center transform transition-all duration-300 hover:-translate-y-2">
                <div className={`${item.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-6 relative`}>
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-instacare-700">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-instacare-800">{item.title}</h3>
                <p className="text-foreground/70 text-center mb-6 text-lg font-medium min-h-[80px]">{item.description}</p>
                <span className="inline-block bg-instacare-50 text-instacare-700 rounded-full px-3 py-1 text-xs font-medium transition-shadow duration-300 hover:shadow-lg hover:shadow-instacare-500/50">
                  {item.additionalInfo}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-instacare-100 text-instacare-800 mb-4">
                <Zap className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Cutting-Edge Tech</span>
              </div>
              <h3 className="text-2xl font-bold mb-6">The Technology Behind InstaCare</h3>
              <p className="text-foreground/80 mb-8">
                Our prediction model uses multiple data sources to provide the most accurate wait time estimates possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-6 w-6 text-instacare-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Hospital-provided Data</h4>
                    <p className="text-sm text-foreground/70">
                      Where available, we connect to official hospital databases to get direct wait time reports.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PieChart className="h-6 w-6 text-medgreen-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Historical Patterns</h4>
                    <p className="text-sm text-foreground/70">
                      We analyze trends by time of day, day of week, and seasonal factors to improve predictions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Crowdsourced Verification</h4>
                    <p className="text-sm text-foreground/70">
                      Anonymous user reports help validate and correct our predictions in real-time.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Machine Learning</h4>
                    <p className="text-sm text-foreground/70">
                      Our algorithms continuously improve as they process more data and learn from outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-md w-full border border-gray-200">
                <div className="p-4 bg-gradient-to-r from-instacare-600 to-instacare-700">
                  <h3 className="text-white font-medium flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Wait Time Prediction Model
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Historical data</div>
                        <div className="text-sm text-instacare-700 font-semibold">70%</div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-instacare-400 to-instacare-600 rounded-full w-[70%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Real-time reports</div>
                        <div className="text-sm text-medgreen-700 font-semibold">20%</div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-medgreen-400 to-medgreen-600 rounded-full w-[20%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">External factors</div>
                        <div className="text-sm text-amber-700 font-semibold">10%</div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full w-[10%]"></div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gradient-to-br from-instacare-50 to-blue-50 p-6 rounded-lg border border-instacare-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-semibold text-instacare-800">Prediction accuracy</div>
                          <div className="text-xs text-instacare-600 mt-1">Averaging within 5 minutes</div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-br from-instacare-600 to-instacare-800 bg-clip-text text-transparent">
                          92%
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-instacare-100">
                        <div className="flex items-center text-xs text-instacare-700">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>AI updates based on severity level</span>
                        </div>
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