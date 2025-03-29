
import React from 'react';
import { AlertCircle, Clock, UserX } from "lucide-react";

const Problem = () => {
  return (
    <section id="problem" className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">
            ER Overcrowding is <span className="text-destructive">Dangerous</span>
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
              description: "Average ER wait times can exceed 4 hours during peak periods, delaying critical care."
            },
            {
              icon: <AlertCircle className="h-10 w-10 text-destructive" />,
              title: "Critical Delays",
              description: "Every minute counts in emergencies like heart attacks, strokes, and severe injuries."
            },
            {
              icon: <UserX className="h-10 w-10 text-medgreen-600" />,
              title: "Uneven Distribution",
              description: "Some ERs are overcrowded while others nearby may have shorter wait times."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-8 border border-gray-100 card-shadow">
              <div className="mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-6 md:p-10 bg-red-50 rounded-2xl border border-red-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">The Hidden Healthcare Crisis</h3>
              <p className="text-lg leading-relaxed">
                Studies show that longer ER wait times are associated with worse outcomes, including higher mortality rates.
                For time-sensitive conditions like stroke or heart attack, delays can lead to permanent damage or death.
                <span className="block mt-4 font-medium">Yet patients have no reliable way to know which ER will provide the fastest care when minutes matter most.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
