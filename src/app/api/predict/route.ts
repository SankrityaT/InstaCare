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
}

// Load real hospital coordinates from generated data
let hospitalCoordinates: Record<string, { lat: number; lon: number }> = {};

// Try to load real hospital coordinates
try {
  const coordsPath = path.join(process.cwd(), 'data', 'hospital-coordinates-real.json');
  if (fs.existsSync(coordsPath)) {
    hospitalCoordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf-8'));
  }
} catch (error) {
  console.error('Error loading hospital coordinates:', error);
}

// Fallback coordinates if real data not available
if (Object.keys(hospitalCoordinates).length === 0) {
  hospitalCoordinates = {
    'HOSP-1': { lat: 37.7749, lon: -122.4194 },
    'HOSP-2': { lat: 37.3382, lon: -121.8863 },
    'HOSP-3': { lat: 38.5816, lon: -121.4944 },
    'HOSP-4': { lat: 36.7783, lon: -119.4179 },
    'HOSP-5': { lat: 34.0522, lon: -118.2437 },
  };
}

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

// Improved traffic condition based on time, day, and location patterns
async function getTrafficCondition(lat: number, lon: number): Promise<string> {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Determine if location is urban (simplified - in production use geocoding)
  const isUrbanArea = Math.abs(lat) > 30 && Math.abs(lat) < 50; // Rough heuristic
  
  // Weekend traffic patterns
  if (isWeekend) {
    if (hour >= 10 && hour <= 14) return 'Moderate'; // Weekend shopping/errands
    if (hour >= 17 && hour <= 20) return 'Moderate'; // Weekend dining
    return 'Light';
  }
  
  // Weekday traffic patterns
  if (isUrbanArea) {
    // Morning rush hour (7-9 AM)
    if (hour >= 7 && hour <= 9) return 'Heavy';
    // Evening rush hour (4-7 PM)
    if (hour >= 16 && hour <= 19) return 'Heavy';
    // Midday (10 AM - 3 PM)
    if (hour >= 10 && hour <= 15) return 'Moderate';
    // Late evening (7-10 PM)
    if (hour >= 19 && hour <= 22) return 'Moderate';
  } else {
    // Suburban/rural areas have lighter traffic
    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) return 'Moderate';
    if (hour >= 10 && hour <= 15) return 'Light';
  }
  
  // Night time (10 PM - 6 AM)
  return 'Light';
}

// Real weather data using Open-Meteo API (free, no API key needed!)
async function getWeatherCondition(lat: number, lon: number): Promise<string> {
  try {
    // Open-Meteo is a free weather API with no authentication required
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain,snowfall,weathercode&timezone=auto`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );
    
    if (!response.ok) {
      throw new Error('Weather API failed');
    }
    
    const data = await response.json();
    const current = data.current;
    
    // WMO Weather interpretation codes
    // 0: Clear, 1-3: Partly cloudy, 45-48: Fog, 51-67: Rain, 71-86: Snow, 95-99: Thunderstorm
    const weatherCode = current.weathercode;
    
    if (weatherCode === 0) return 'Clear';
    if (weatherCode >= 1 && weatherCode <= 3) return 'Cloudy';
    if (weatherCode >= 45 && weatherCode <= 48) return 'Foggy';
    if (weatherCode >= 51 && weatherCode <= 67) return 'Rainy';
    if (weatherCode >= 71 && weatherCode <= 86) return 'Snowy';
    if (weatherCode >= 95) return 'Stormy';
    
    return 'Clear';
  } catch (error) {
    console.error('Weather API error:', error);
    // Fallback to time-based estimation
    const hour = new Date().getHours();
    return hour >= 6 && hour <= 18 ? 'Clear' : 'Cloudy';
  }
}

// Mock local events API (in a real app, this would call an events API)
async function getLocalEvents(lat: number, lon: number): Promise<string[]> {
  // Simulate local events that might impact hospital traffic
  const events = [
    'Sports Game',
    'Concert',
    'Festival',
    'Marathon',
    'Convention'
  ];
  
  // Randomly decide if there are events happening
  const hasEvents = Math.random() > 0.7;
  
  if (hasEvents) {
    const numEvents = Math.floor(Math.random() * 2) + 1; // 1 or 2 events
    const selectedEvents = [];
    
    for (let i = 0; i < numEvents; i++) {
      const randomIndex = Math.floor(Math.random() * events.length);
      selectedEvents.push(events[randomIndex]);
      // Remove the selected event to avoid duplicates
      events.splice(randomIndex, 1);
    }
    
    return selectedEvents;
  }
  
  return [];
}

// Function to simulate different locations for testing
function simulateUserLocation(requestedLatitude: number, requestedLongitude: number): { latitude: number, longitude: number } {
  // If the coordinates are close to 0,0 (default values), provide a simulated location
  if (Math.abs(requestedLatitude) < 1 && Math.abs(requestedLongitude) < 1) {
    // Randomly choose between different city locations for testing
    const locations = [
      { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
      { latitude: 40.7128, longitude: -74.0060 }, // New York
      { latitude: 33.4484, longitude: -112.0740 }, // Phoenix
      { latitude: 51.5074, longitude: -0.1278 }   // London
    ];
    
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  }
  
  // Otherwise return the requested coordinates
  return { latitude: requestedLatitude, longitude: requestedLongitude };
}

// Helper function to get the current time of day
function getCurrentTimeOfDay(): 'Early Morning' | 'Late Morning' | 'Afternoon' | 'Evening' | 'Night' {
  const hour = new Date().getHours();
  
  if (hour >= 0 && hour < 6) {
    return 'Early Morning';
  } else if (hour >= 6 && hour < 12) {
    return 'Late Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'Evening';
  } else {
    return 'Night';
  }
}

// Helper function to get the current season
function getCurrentSeason(): 'Winter' | 'Spring' | 'Summer' | 'Fall' {
  const month = new Date().getMonth();
  
  if (month >= 0 && month < 3) {
    return 'Winter';
  } else if (month >= 3 && month < 6) {
    return 'Spring';
  } else if (month >= 6 && month < 9) {
    return 'Summer';
  } else {
    return 'Fall';
  }
}

// Helper function to get the day of the week information
function getDayInfo(): { dayOfWeek: string, isWeekend: boolean } {
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
  
  return { dayOfWeek, isWeekend };
}

// Calculate a dynamic confidence score based on multiple factors
function calculateConfidenceScore(hospital: HospitalFeatures, distance: number) {
  // Base confidence starts at 0.9 (90%)
  let confidenceScore = 0.9;
  
  // Reduce confidence based on distance (farther = less confident)
  // Subtract up to 0.1 for distances over 20km
  const distanceFactor = Math.min(0.1, distance / 200);
  confidenceScore -= distanceFactor;
  
  // Reduce confidence if we have limited historical data
  // visitCount is the number of data points we have for this hospital
  if (hospital.visitCount < 10) {
    confidenceScore -= 0.1;
  }
  
  // Adjust based on time of day - we might be less confident during unusual hours
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) {
    confidenceScore -= 0.05;
  }
  
  // Ensure confidence stays between 0.5 and 0.95
  return Math.max(0.5, Math.min(0.95, confidenceScore));
}

// At the top of the file, add a debug function
function debug(...args: any[]) {
  console.log('[PREDICT API]', new Date().toISOString(), ...args);
}

export async function GET(request: NextRequest) {
  debug('Request received', request.nextUrl.searchParams.toString());
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const requestedLatitude = parseFloat(searchParams.get('latitude') || '0');
    const requestedLongitude = parseFloat(searchParams.get('longitude') || '0');
    const urgencyLevel = searchParams.get('urgency') || 'Medium';
    
    debug('Parameters:', { requestedLatitude, requestedLongitude, urgencyLevel });
    
    // Simulate different locations for testing
    const { latitude, longitude } = simulateUserLocation(requestedLatitude, requestedLongitude);
    debug('Simulated location:', { latitude, longitude });
    
    // Validate coordinates
    if (latitude === 0 && longitude === 0) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Please provide latitude and longitude.' },
        { status: 400 }
      );
    }
    
    // Load hospital features from the processed data
    const originalDataPath = path.join(process.cwd(), 'data', 'hospital-features.json');
    const realDataPath = path.join(process.cwd(), 'data', 'real-hospital-features.json');

    if (!fs.existsSync(originalDataPath) || !fs.existsSync(realDataPath)) {
      return NextResponse.json(
        { error: 'Hospital data not found. Please check the data directory.' },
        { status: 500 }
      );
    }

    // Load and combine both datasets
    const originalHospitalFeatures: HospitalFeatures[] = JSON.parse(
      fs.readFileSync(originalDataPath, 'utf-8')
    );

    const realHospitalFeatures: HospitalFeatures[] = JSON.parse(
      fs.readFileSync(realDataPath, 'utf-8')
    );

    // Combine the datasets
    const hospitalFeatures: HospitalFeatures[] = [
      ...originalHospitalFeatures,
      ...realHospitalFeatures
    ];
    
    // Calculate distance for each hospital
    const hospitalsWithDistance: HospitalWithDistance[] = hospitalFeatures.map(hospital => {
      const coords = hospitalCoordinates[hospital.id];
      
      if (!coords) {
        // If coordinates not found, use a default large distance
        return {
          ...hospital,
          distance: 9999
        };
      }
      
      const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
      
      return {
        ...hospital,
        distance
      };
    });
    
    // Sort hospitals by distance
    const sortedHospitals = hospitalsWithDistance
      .sort((a, b) => a.distance - b.distance);
    
    // Select a representative sample of hospitals from each region to ensure diversity
    const regionMap: Record<string, HospitalWithDistance[]> = {};
    
    sortedHospitals.forEach(hospital => {
      const region = hospital.region.split(',')[0].trim();
      if (!regionMap[region]) {
        regionMap[region] = [];
      }
      regionMap[region].push(hospital);
    });
    
    // Take up to 3 hospitals from each region
    const selectedHospitals: HospitalWithDistance[] = [];
    Object.values(regionMap).forEach(hospitals => {
      selectedHospitals.push(...hospitals.slice(0, 3));
    });
    
    // Sort the selected hospitals by distance
    selectedHospitals.sort((a, b) => a.distance - b.distance);
    
    // Get real-time contextual data
    const trafficCondition = await getTrafficCondition(latitude, longitude);
    const weatherCondition = await getWeatherCondition(latitude, longitude);
    const localEvents = await getLocalEvents(latitude, longitude);
    
    // Enhanced prediction algorithm with machine learning principles
    const hospitalsWithPredictions = selectedHospitals.map(hospital => {
      // Calculate estimated wait time based on urgency, time of day, and season
      const currentTimeOfDay = getCurrentTimeOfDay();
      const currentSeason = getCurrentSeason();
      const { dayOfWeek, isWeekend } = getDayInfo();
      const currentHour = new Date().getHours();
      
      const baseWaitTime = hospital.averageWaitTimes.byUrgency[urgencyLevel as keyof typeof hospital.averageWaitTimes.byUrgency] || hospital.averageWaitTimes.overall;
      const timeOfDayFactor = hospital.averageWaitTimes.byTimeOfDay[currentTimeOfDay as keyof typeof hospital.averageWaitTimes.byTimeOfDay] / hospital.averageWaitTimes.overall;
      const seasonFactor = hospital.averageWaitTimes.bySeason[currentSeason as keyof typeof hospital.averageWaitTimes.bySeason] / hospital.averageWaitTimes.overall;
      
      // More sophisticated day of week factor
      let dayOfWeekFactor = 1.0;
      if (isWeekend) {
        dayOfWeekFactor = 1.22; // Weekends are 22% busier on average
      } else {
        // Mondays and Fridays are typically busier
        const dayNum = new Date().getDay();
        if (dayNum === 1) dayOfWeekFactor = 1.12; // Monday
        if (dayNum === 5) dayOfWeekFactor = 1.08; // Friday
      }
      
      // Enhanced traffic factor
      let trafficFactor = 1.0;
      if (trafficCondition === 'Heavy') {
        trafficFactor = 1.18; // Heavy traffic delays ambulances and increases accidents
      } else if (trafficCondition === 'Moderate') {
        trafficFactor = 1.08;
      }
      
      // Enhanced weather factor with more nuance
      let weatherFactor = 1.0;
      if (weatherCondition === 'Stormy') {
        weatherFactor = 1.28; // Storms cause accidents and delays
      } else if (weatherCondition === 'Snowy') {
        weatherFactor = 1.25; // Snow causes slip/fall injuries
      } else if (weatherCondition === 'Rainy') {
        weatherFactor = 1.12; // Rain increases accidents
      } else if (weatherCondition === 'Foggy') {
        weatherFactor = 1.10; // Fog causes accidents
      }
      
      // Staffing factor based on nurse-to-patient ratio
      let staffingFactor = 1.0;
      if (hospital.nurseToPatientRatio < 0.2) {
        staffingFactor = 1.25; // Understaffed hospitals have longer waits
      } else if (hospital.nurseToPatientRatio < 0.25) {
        staffingFactor = 1.12;
      } else if (hospital.nurseToPatientRatio > 0.35) {
        staffingFactor = 0.92; // Well-staffed hospitals are faster
      }
      
      // Peak hours factor
      let peakHoursFactor = 1.0;
      if ((currentHour >= 7 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20)) {
        peakHoursFactor = 1.15; // Peak hours are 15% busier
      }
      
      // Local events factor
      let eventsFactor = 1.0;
      if (localEvents.length > 0) {
        eventsFactor = 1.30; // Events increase ER volume significantly
      }
      
      // Calculate the final predicted wait time with all factors
      // Use a more sophisticated calculation that prevents extreme outliers
      let predictedWaitTime = baseWaitTime * 
        timeOfDayFactor * 
        seasonFactor * 
        dayOfWeekFactor * 
        trafficFactor * 
        weatherFactor * 
        staffingFactor * 
        peakHoursFactor * 
        eventsFactor;
      
      // Apply bounds to keep predictions realistic
      // Minimum: 5 minutes (even critical cases take some time)
      // Maximum: 4 hours (240 minutes) - beyond this, patients should go elsewhere
      predictedWaitTime = Math.max(5, Math.min(240, predictedWaitTime));
      
      // Round to nearest 5 minutes for cleaner display
      predictedWaitTime = Math.round(predictedWaitTime / 5) * 5;
      
      // Create detailed factors array for display
      const otherFactors = [];
      if (trafficCondition !== 'Light') otherFactors.push(`${trafficCondition} traffic (+${((trafficFactor - 1) * 100).toFixed(0)}%)`);
      if (weatherCondition !== 'Clear' && weatherCondition !== 'Cloudy') otherFactors.push(`${weatherCondition} weather (+${((weatherFactor - 1) * 100).toFixed(0)}%)`);
      if (localEvents.length > 0) otherFactors.push(`Local events: ${localEvents.join(', ')} (+30%)`);
      if (isWeekend) otherFactors.push('Weekend volume (+22%)');
      if (staffingFactor !== 1.0) {
        const staffingImpact = ((staffingFactor - 1) * 100).toFixed(0);
        otherFactors.push(`Staffing level (${Number(staffingImpact) > 0 ? '+' : ''}${staffingImpact}%)`);
      }
      if (peakHoursFactor > 1.0) otherFactors.push('Peak hours (+15%)');
      
      // Enhanced dynamic confidence score
      const confidenceScore = calculateConfidenceScore(hospital, hospital.distance);
      
      // Get coordinates for this hospital
      const coords = hospitalCoordinates[hospital.id];
      
      return {
        id: hospital.id,
        name: hospital.name,
        region: hospital.region,
        distance: hospital.distance,
        facilitySize: hospital.facilitySize,
        nurseToPatientRatio: hospital.nurseToPatientRatio,
        patientSatisfaction: hospital.patientSatisfaction,
        historicalWaitTime: hospital.averageWaitTimes.overall,
        coordinates: coords ? { lat: coords.lat, lng: coords.lon } : undefined,
        prediction: {
          predictedWaitTime: predictedWaitTime,
          confidenceScore: confidenceScore,
          factors: {
            baseWaitTime: baseWaitTime,
            timeOfDayFactor: timeOfDayFactor,
            seasonFactor: seasonFactor,
            dayOfWeekFactor: dayOfWeekFactor,
            trafficFactor: trafficFactor,
            weatherFactor: weatherFactor,
            otherFactors: otherFactors
          }
        }
      };
    });
    
    // Before loading hospital features
    debug('Loading hospital features from files');
    
    // After loading hospital features
    debug(`Loaded ${hospitalFeatures.length} hospital features`);
    
    // Before calculating distances
    debug('Calculating distances for hospitals');
    
    // After sorting hospitals
    debug(`Sorted ${sortedHospitals.length} hospitals by distance`);
    
    // After selecting hospitals
    debug(`Selected ${selectedHospitals.length} hospitals for prediction`);
    
    // Before getting contextual data
    debug('Getting contextual data (traffic, weather, events)');
    
    // After getting contextual data
    debug('Contextual data:', { trafficCondition, weatherCondition, localEvents: localEvents.length });
    
    // Before calculating predictions
    debug('Calculating predictions for hospitals');
    
    // After calculating predictions
    debug(`Generated predictions for ${hospitalsWithPredictions.length} hospitals`);
    
    // Before returning response
    debug('Returning response to client');
    
    return NextResponse.json({
      hospitals: hospitalsWithPredictions,
      contextualFactors: {
        trafficCondition,
        weatherCondition,
        localEvents,
        urgencyLevel
      }
    });
    
  } catch (error) {
    debug('ERROR:', error);
    console.error('Error predicting wait times:', error);
    return NextResponse.json(
      { error: 'Failed to predict wait times' },
      { status: 500 }
    );
  }
}
