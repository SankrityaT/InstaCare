
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle } from 'lucide-react';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically submit to an API
    console.log('Submitted email:', email);
    
    toast({
      title: "Thank you for signing up!",
      description: "We'll keep you updated on our launch.",
    });
    
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-instacare-800 text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Be the First to Know When We Launch
          </h2>
          
          <p className="text-lg text-white/80 mb-8">
            Join our early access list and be among the first to experience InstaCare.
            We're launching soon in select cities.
          </p>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button 
                  type="submit" 
                  className="h-12 px-6 bg-medgreen-500 hover:bg-medgreen-600 text-white"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
              <CheckCircle className="h-12 w-12 text-medgreen-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">You're on the list!</h3>
              <p className="text-white/80">
                Thank you for your interest in InstaCare. We'll notify you when we launch.
              </p>
            </div>
          )}
          
          <div className="mt-10 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>No spam, ever</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Unsubscribe anytime</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Your data stays private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
