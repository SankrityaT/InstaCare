import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the feedback data interface
interface FeedbackData {
  hospitalId: string;
  hospitalName: string;
  reportType: string;
  actualWaitTime?: number;
  comments?: string;
  timestamp: number;
}

// Mock database - in a real app, you would use a proper database
const saveFeedback = (feedback: FeedbackData) => {
  try {
    // Create the data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Path to the feedback JSON file
    const feedbackPath = path.join(dataDir, 'feedback.json');
    
    // Read existing feedback or create an empty array
    let feedbackData: FeedbackData[] = [];
    if (fs.existsSync(feedbackPath)) {
      const fileContent = fs.readFileSync(feedbackPath, 'utf-8');
      feedbackData = JSON.parse(fileContent);
    }
    
    // Add the new feedback
    feedbackData.push(feedback);
    
    // Write back to the file
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackData, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error saving feedback:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const feedback: FeedbackData = await request.json();
    
    // Validate the feedback data
    if (!feedback.hospitalId || !feedback.reportType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save the feedback
    const success = saveFeedback(feedback);
    
    if (success) {
      // In a real app, you might want to update predictions based on this feedback
      // For now, we'll just return a success response
      return NextResponse.json(
        { 
          message: 'Feedback received successfully',
          impact: 'Your feedback will help improve wait time predictions for everyone.'
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to retrieve feedback statistics
export async function GET(request: NextRequest) {
  try {
    const feedbackPath = path.join(process.cwd(), 'data', 'feedback.json');
    
    if (!fs.existsSync(feedbackPath)) {
      return NextResponse.json(
        { 
          totalReports: 0,
          recentReports: 0,
          impactScore: 0
        },
        { status: 200 }
      );
    }
    
    const fileContent = fs.readFileSync(feedbackPath, 'utf-8');
    const feedbackData: FeedbackData[] = JSON.parse(fileContent);
    
    // Calculate some basic statistics
    const totalReports = feedbackData.length;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentReports = feedbackData.filter(f => f.timestamp > oneDayAgo).length;
    
    // Mock impact score calculation
    const impactScore = Math.min(100, Math.round(totalReports * 0.5));
    
    return NextResponse.json(
      {
        totalReports,
        recentReports,
        impactScore
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving feedback stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}