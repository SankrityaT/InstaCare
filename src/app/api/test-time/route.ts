import { NextRequest, NextResponse } from 'next/server';

// Function to get current time of day
function getCurrentTimeOfDay(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 9) return 'Early Morning';
  if (hour >= 9 && hour < 12) return 'Late Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

// Function to get current season
function getCurrentSeason(): string {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

export async function GET(request: NextRequest) {
  const now = new Date();
  
  return NextResponse.json({
    currentDateTime: now.toString(),
    hour: now.getHours(),
    month: now.getMonth(),
    timeOfDay: getCurrentTimeOfDay(),
    season: getCurrentSeason()
  });
}