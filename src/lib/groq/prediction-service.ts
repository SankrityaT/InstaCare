import { getGroqClient, GROQ_MODEL } from './client';
import { format } from 'date-fns';

// Define interfaces for our data types
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
  distance?: number;
}

interface PredictionInput {
  hospital: HospitalFeatures;
  urgencyLevel: string;
  currentTimeOfDay: string;
  currentSeason: string;
  dayOfWeek: string;
  isWeekend: boolean;
  trafficCondition?: string;
  localEvents?: string[];
  weatherCondition?: string;
}

interface PredictionResult {
  hospitalId: string;
  predictedWaitTime: number;
  confidenceScore: number;
  factors: {
    baseWaitTime: number;
    timeOfDayFactor: number;
    seasonFactor: number;
    dayOfWeekFactor: number;
    trafficFactor: number;
    weatherFactor: number;
    otherFactors: string[];
  };
}

/**
 * Generates a prompt for the Groq AI model to predict ER wait times
 */
function generatePredictionPrompt(input: PredictionInput): string {
  return `
You are an expert AI system for predicting emergency room wait times based on historical and real-time data.

HOSPITAL INFORMATION:
- Name: ${input.hospital.name}
- Region: ${input.hospital.region}
- Facility Size: ${input.hospital.facilitySize} beds
- Nurse-to-Patient Ratio: ${input.hospital.nurseToPatientRatio.toFixed(2)}
- Specialist Availability: ${input.hospital.specialistAvailability.toFixed(2)}
- Patient Satisfaction: ${input.hospital.patientSatisfaction.toFixed(2)}/10
- Total Visit Count in Dataset: ${input.hospital.visitCount}
${input.hospital.distance ? `- Distance from User: ${input.hospital.distance.toFixed(2)} km` : ''}

HISTORICAL WAIT TIME DATA:
- Overall Average Wait Time: ${input.hospital.averageWaitTimes.overall.toFixed(2)} minutes
- Average Wait Time for ${input.urgencyLevel} Urgency: ${input.hospital.averageWaitTimes.byUrgency[input.urgencyLevel as keyof typeof input.hospital.averageWaitTimes.byUrgency].toFixed(2)} minutes
- Average Wait Time during ${input.currentTimeOfDay}: ${input.hospital.averageWaitTimes.byTimeOfDay[input.currentTimeOfDay as keyof typeof input.hospital.averageWaitTimes.byTimeOfDay].toFixed(2)} minutes
- Average Wait Time during ${input.currentSeason}: ${input.hospital.averageWaitTimes.bySeason[input.currentSeason as keyof typeof input.hospital.averageWaitTimes.bySeason].toFixed(2)} minutes

CURRENT CONDITIONS:
- Day of Week: ${input.dayOfWeek}
- Is Weekend: ${input.isWeekend ? 'Yes' : 'No'}
- Time of Day: ${input.currentTimeOfDay}
- Season: ${input.currentSeason}
${input.trafficCondition ? `- Traffic Condition: ${input.trafficCondition}` : ''}
${input.weatherCondition ? `- Weather Condition: ${input.weatherCondition}` : ''}
${input.localEvents && input.localEvents.length > 0 ? `- Local Events: ${input.localEvents.join(', ')}` : ''}

TASK:
Based on the above information, predict the current wait time in minutes for this hospital's emergency room.
Provide your prediction as a JSON object with the following structure:
{
  "predictedWaitTime": [number of minutes],
  "confidenceScore": [number between 0 and 1],
  "factors": {
    "baseWaitTime": [base wait time in minutes],
    "timeOfDayFactor": [factor as a decimal],
    "seasonFactor": [factor as a decimal],
    "dayOfWeekFactor": [factor as a decimal],
    "trafficFactor": [factor as a decimal],
    "weatherFactor": [factor as a decimal],
    "otherFactors": [array of strings describing other factors]
  }
}

Only respond with the JSON object and no other text.
`;
}

/**
 * Predicts ER wait times using Groq AI
 */
export async function predictWaitTime(input: PredictionInput): Promise<PredictionResult> {
  try {
    const groqClient = getGroqClient();
    const prompt = generatePredictionPrompt(input);
    
    const response = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert AI system for predicting emergency room wait times.' },
        { role: 'user', content: prompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.3, // Lower temperature for more deterministic predictions
      max_tokens: 1024,
    });
    
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No prediction received from Groq AI');
    }
    
    // Parse the JSON response
    const prediction = JSON.parse(content);
    
    return {
      hospitalId: input.hospital.id,
      ...prediction
    };
  } catch (error) {
    console.error('Error predicting wait time with Groq AI:', error);
    
    // Fallback to a simpler calculation if AI prediction fails
    const baseWaitTime = input.hospital.averageWaitTimes.byUrgency[input.urgencyLevel as keyof typeof input.hospital.averageWaitTimes.byUrgency];
    const timeOfDayFactor = input.hospital.averageWaitTimes.byTimeOfDay[input.currentTimeOfDay as keyof typeof input.hospital.averageWaitTimes.byTimeOfDay] / input.hospital.averageWaitTimes.overall;
    const seasonFactor = input.hospital.averageWaitTimes.bySeason[input.currentSeason as keyof typeof input.hospital.averageWaitTimes.bySeason] / input.hospital.averageWaitTimes.overall;
    const dayOfWeekFactor = input.isWeekend ? 1.2 : 1.0; // Assume weekends are 20% busier
    
    const predictedWaitTime = Math.round(baseWaitTime * timeOfDayFactor * seasonFactor * dayOfWeekFactor);
    
    return {
      hospitalId: input.hospital.id,
      predictedWaitTime,
      confidenceScore: 0.7, // Lower confidence for fallback calculation
      factors: {
        baseWaitTime,
        timeOfDayFactor,
        seasonFactor,
        dayOfWeekFactor,
        trafficFactor: 1.0,
        weatherFactor: 1.0,
        otherFactors: ['Fallback calculation used due to AI prediction failure']
      }
    };
  }
}

/**
 * Helper function to get current time of day
 */
export function getCurrentTimeOfDay(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 9) return 'Early Morning';
  if (hour >= 9 && hour < 12) return 'Late Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

/**
 * Helper function to get current season
 */
export function getCurrentSeason(): string {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

/**
 * Helper function to get day of week and check if it's a weekend
 */
export function getDayInfo(): { dayOfWeek: string; isWeekend: boolean } {
  const date = new Date();
  const dayOfWeek = format(date, 'EEEE'); // e.g., "Monday", "Tuesday", etc.
  const dayNum = date.getDay();
  const isWeekend = dayNum === 0 || dayNum === 6; // 0 is Sunday, 6 is Saturday
  
  return { dayOfWeek, isWeekend };
}

/**
 * Predicts wait times for multiple hospitals
 */
export async function predictWaitTimesForHospitals(
  hospitals: HospitalFeatures[],
  urgencyLevel: string,
  additionalFactors?: {
    trafficCondition?: string;
    localEvents?: string[];
    weatherCondition?: string;
  }
): Promise<PredictionResult[]> {
  const currentTimeOfDay = getCurrentTimeOfDay();
  const currentSeason = getCurrentSeason();
  const { dayOfWeek, isWeekend } = getDayInfo();
  
  // Process hospitals in parallel for efficiency
  const predictions = await Promise.all(
    hospitals.map(hospital => 
      predictWaitTime({
        hospital,
        urgencyLevel,
        currentTimeOfDay,
        currentSeason,
        dayOfWeek,
        isWeekend,
        ...additionalFactors
      })
    )
  );
  
  return predictions;
}
