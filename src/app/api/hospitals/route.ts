import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define types for our data
interface HospitalFeatures {
  id: string;
  name: string;
  region: string;
  facilitySize: number;
  averageWaitTimes: {
    overall: number;
    byUrgency: {
      Critical: number;
      High: number;
      Medium: number;
      Low: number;
    };
    byTimeOfDay: {
      'Early Morning': number;
      'Late Morning': number;
      'Afternoon': number;
      'Evening': number;
      'Night': number;
    };
    bySeason: {
      Winter: number;
      Spring: number;
      Summer: number;
      Fall: number;
    };
  };
  nurseToPatientRatio: number;
  specialistAvailability: number;
  patientSatisfaction: number;
  visitCount: number;
}

interface HospitalWithDistance extends HospitalFeatures {
  distance: number; // Distance in kilometers
  estimatedWaitTime: number; // Predicted wait time based on current conditions
}

// Mock hospital coordinates (in a real app, these would come from a database)
const hospitalCoordinates: Record<string, { lat: number; lon: number }> = {
  // Original California hospitals
  'HOSP-1': { lat: 37.7749, lon: -122.4194 }, // San Francisco
  'HOSP-2': { lat: 37.3382, lon: -121.8863 }, // San Jose
  'HOSP-3': { lat: 38.5816, lon: -121.4944 }, // Sacramento
  'HOSP-4': { lat: 36.7783, lon: -119.4179 }, // Fresno
  'HOSP-5': { lat: 34.0522, lon: -118.2437 }, // Los Angeles
  
  // New York City hospitals
  'NYC-1': { lat: 40.8142, lon: -73.9419 }, // Harlem Hospital Center
  'NYC-2': { lat: 40.7845, lon: -73.9440 }, // Metropolitan Hospital Center
  'NYC-3': { lat: 40.7392, lon: -73.9767 }, // Bellevue Hospital Center
  'NYC-4': { lat: 40.8019, lon: -73.9662 }, // Mount Sinai St Luke's Roosevelt Hospital
  'NYC-5': { lat: 40.7644, lon: -73.9552 }, // New York-Presbyterian Hospital
  'NYC-6': { lat: 40.7900, lon: -73.9526 }, // Mount Sinai Hospital
  
  // Phoenix hospitals
  'PHX-1': { lat: 33.4805, lon: -112.0741 }, // Banner University Medical Center Phoenix
  'PHX-2': { lat: 33.6107, lon: -111.8910 }, // Mayo Clinic Hospital
  'PHX-3': { lat: 33.4794, lon: -112.0980 }, // St. Joseph's Hospital And Medical Center
  
  // London hospitals
  'LON-1': { lat: 51.4987, lon: -0.1178 }, // St. Thomas' Hospital
  'LON-2': { lat: 51.5182, lon: -0.0594 }, // Royal London Hospital
  'LON-3': { lat: 51.5246, lon: -0.1357 }  // University College Hospital
};

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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

// Add this at the top of the file after imports
function debug(...args: any[]) {
  console.log('[HOSPITALS API]', new Date().toISOString(), ...args);
}

// Define a config object to make the route dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    // When using searchParams, it will now work correctly with the dynamic setting
    const searchParams = request.nextUrl.searchParams;
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const urgencyLevel = searchParams.get('urgency') || 'Medium';
    
    // Validate coordinates
    if (latitude === 0 && longitude === 0) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Please provide latitude and longitude.' },
        { status: 400 }
      );
    }
    
    // Load hospital features from the processed data
    const dataPath = path.join(process.cwd(), 'data', 'hospital-features.json');
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Hospital data not found. Please run the data processing script first.' },
        { status: 500 }
      );
    }
    
    const hospitalFeatures: HospitalFeatures[] = JSON.parse(
      fs.readFileSync(dataPath, 'utf-8')
    );
    
    // Get current time of day and season for wait time prediction
    const currentTimeOfDay = getCurrentTimeOfDay();
    const currentSeason = getCurrentSeason();
    
    // Calculate distance and estimated wait time for each hospital
    const hospitalsWithDistance: HospitalWithDistance[] = hospitalFeatures.map(hospital => {
      const coords = hospitalCoordinates[hospital.id];
      
      if (!coords) {
        // If coordinates not found, use a default large distance
        return {
          ...hospital,
          distance: 9999,
          estimatedWaitTime: hospital.averageWaitTimes.overall
        };
      }
      
      const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
      
      // Calculate estimated wait time based on urgency, time of day, and season
      const baseWaitTime = hospital.averageWaitTimes.byUrgency[urgencyLevel as keyof typeof hospital.averageWaitTimes.byUrgency] || hospital.averageWaitTimes.overall;
      const timeOfDayFactor = hospital.averageWaitTimes.byTimeOfDay[currentTimeOfDay as keyof typeof hospital.averageWaitTimes.byTimeOfDay] / hospital.averageWaitTimes.overall;
      const seasonFactor = hospital.averageWaitTimes.bySeason[currentSeason as keyof typeof hospital.averageWaitTimes.bySeason] / hospital.averageWaitTimes.overall;
      
      // Apply factors to get the estimated wait time
      const estimatedWaitTime = baseWaitTime * timeOfDayFactor * seasonFactor;
      
      return {
        ...hospital,
        distance,
        estimatedWaitTime: Math.round(estimatedWaitTime)
      };
    });
    
    // Sort hospitals by distance
    const sortedHospitals = hospitalsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Return top 10 closest hospitals
    
    return NextResponse.json({
      hospitals: sortedHospitals,
      metadata: {
        timeOfDay: currentTimeOfDay,
        season: currentSeason,
        urgencyLevel
      }
    });
    
  } catch (error) {
    console.error('Error fetching hospital data:', error);
    return NextResponse.json(
      { error: 'Failed to process hospital data' },
      { status: 500 }
    );
  }
}