"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import Link from 'next/link';
import { toast } from "sonner";

// Define the feedback data interface
interface FeedbackData {
  hospitalId: string;
  hospitalName: string;
  reportType: string;
  actualWaitTime?: number;
  comments?: string;
  timestamp: number;
}

function ReportPageContent() {
  // Update the searchParams usage with proper null checks
  const searchParams = useSearchParams();
  const hospitalId = searchParams?.get('id') || '';
  const hospitalName = searchParams?.get('name') || '';
  
  const [reportType, setReportType] = useState("incorrect-wait");
  const [actualWaitTime, setActualWaitTime] = useState<number | undefined>(undefined);
  const [feedbackComments, setFeedbackComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Redirect if no hospital ID is provided
  useEffect(() => {
    if (!hospitalId || !hospitalName) {
      window.location.href = '/hospitals';
    }
  }, [hospitalId, hospitalName]);
  
  // Update the handleSubmit function to use the API
  const handleSubmit = async () => {
    if (reportType === "incorrect-wait" && !actualWaitTime) {
      toast.error("Please enter the actual wait time");
      return;
    }
    
    // Create feedback data object
    const feedbackData: FeedbackData = {
      hospitalId: hospitalId!,
      hospitalName: hospitalName!,
      reportType,
      actualWaitTime,
      comments: feedbackComments,
      timestamp: Date.now()
    };
    
    try {
      setLoading(true);
      
      // Send feedback to the API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      const data = await response.json();
      
      // Show success message
      toast.success(data.message || "Thank you for your feedback!", {
        description: data.impact || "Your report helps improve wait time predictions for everyone."
      });
      
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  if (submitted) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/hospitals">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospitals
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Report Submitted</h1>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your feedback has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Your contribution helps improve wait time predictions for everyone.
              The system will use your report to update its predictions.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/hospitals">
              <Button>
                Return to Hospitals
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/hospitals">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hospitals
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Report Wait Time</h1>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report for {hospitalName}</CardTitle>
            <CardDescription>
              Help improve predictions by sharing your experience. Your feedback is anonymous and helps others.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What would you like to report?</h3>
              <RadioGroup value={reportType} onValueChange={setReportType} className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incorrect-wait" id="incorrect-wait" />
                  <Label htmlFor="incorrect-wait">The predicted wait time is incorrect</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="facility-closed" id="facility-closed" />
                  <Label htmlFor="facility-closed">This facility is closed or not accepting patients</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other-issue" id="other-issue" />
                  <Label htmlFor="other-issue">Other issue with this listing</Label>
                </div>
              </RadioGroup>
            </div>
            
            {reportType === "incorrect-wait" && (
              <div className="space-y-2">
                <Label htmlFor="actual-wait">What was the actual wait time (minutes)?</Label>
                <Input 
                  id="actual-wait" 
                  type="number" 
                  min="0"
                  value={actualWaitTime || ''}
                  onChange={(e) => setActualWaitTime(parseInt(e.target.value) || undefined)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="comments">Additional comments (optional)</Label>
              <Textarea 
                id="comments" 
                placeholder="Please provide any additional details that might help us improve..."
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || (reportType === "incorrect-wait" && !actualWaitTime)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">About Crowdsourced Verification</h3>
          <p className="text-blue-700 mb-2">
            InstaCare uses anonymous reports from users like you to improve our wait time predictions.
          </p>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>All reports are completely anonymous</li>
            <li>Multiple reports help verify the accuracy of information</li>
            <li>Our system updates predictions based on user feedback</li>
            <li>Your contribution helps others make informed decisions</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-2" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hospitals
          </Button>
          <h1 className="text-3xl font-bold">Report Wait Time</h1>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-instacare-600" />
                <span className="ml-3 text-lg">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    }>
      <ReportPageContent />
    </Suspense>
  );
}