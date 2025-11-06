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
  const currentHour = new Date().getHours();
  const isPeakHours = (currentHour >= 7 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20);
  
  return `You are an advanced AI healthcare analytics system specializing in emergency room wait time predictions. You use machine learning principles, statistical analysis, and real-time contextual data to provide highly accurate predictions.

## HOSPITAL PROFILE
**Facility:** ${input.hospital.name}
**Location:** ${input.hospital.region}
**Capacity:** ${input.hospital.facilitySize} beds
**Staffing Ratio:** ${input.hospital.nurseToPatientRatio.toFixed(2)} nurses per patient (${input.hospital.nurseToPatientRatio < 0.2 ? 'UNDERSTAFFED' : input.hospital.nurseToPatientRatio > 0.35 ? 'WELL-STAFFED' : 'ADEQUATE'})
**Specialist Coverage:** ${(input.hospital.specialistAvailability * 100).toFixed(0)}% availability
**Patient Satisfaction Score:** ${input.hospital.patientSatisfaction.toFixed(1)}/10 (${input.hospital.patientSatisfaction >= 8 ? 'Excellent' : input.hospital.patientSatisfaction >= 6 ? 'Good' : 'Needs Improvement'})
**Historical Data Points:** ${input.hospital.visitCount} visits analyzed
${input.hospital.distance ? `**Distance from Patient:** ${input.hospital.distance.toFixed(1)} km` : ''}

## HISTORICAL PATTERNS (Minutes)
- **Baseline Average:** ${input.hospital.averageWaitTimes.overall.toFixed(0)} min
- **${input.urgencyLevel} Urgency Cases:** ${input.hospital.averageWaitTimes.byUrgency[input.urgencyLevel as keyof typeof input.hospital.averageWaitTimes.byUrgency].toFixed(0)} min (${((input.hospital.averageWaitTimes.byUrgency[input.urgencyLevel as keyof typeof input.hospital.averageWaitTimes.byUrgency] / input.hospital.averageWaitTimes.overall - 1) * 100).toFixed(0)}% vs baseline)
- **${input.currentTimeOfDay} Period:** ${input.hospital.averageWaitTimes.byTimeOfDay[input.currentTimeOfDay as keyof typeof input.hospital.averageWaitTimes.byTimeOfDay].toFixed(0)} min
- **${input.currentSeason} Season:** ${input.hospital.averageWaitTimes.bySeason[input.currentSeason as keyof typeof input.hospital.averageWaitTimes.bySeason].toFixed(0)} min

## REAL-TIME CONTEXT
**Temporal Factors:**
- Current Day: ${input.dayOfWeek} (${input.isWeekend ? '⚠️ WEEKEND - Expect 15-25% higher volume' : 'Weekday'})
- Time Period: ${input.currentTimeOfDay} ${isPeakHours ? '⚠️ PEAK HOURS' : ''}
- Season: ${input.currentSeason}

**External Conditions:**
${input.trafficCondition ? `- Traffic: ${input.trafficCondition} ${input.trafficCondition === 'Heavy' ? '⚠️ May delay ambulances by 10-20%' : ''}` : ''}
${input.weatherCondition ? `- Weather: ${input.weatherCondition} ${['Stormy', 'Snowy', 'Rainy'].includes(input.weatherCondition) ? '⚠️ Increases accident-related visits by 15-30%' : ''}` : ''}
${input.localEvents && input.localEvents.length > 0 ? `- Local Events: ${input.localEvents.join(', ')} ⚠️ May increase ER volume by 20-40%` : '- No major local events'}

## PREDICTION TASK
Analyze ALL factors above using these principles:
1. **Base Calculation:** Start with urgency-specific historical average
2. **Temporal Adjustment:** Apply time-of-day and seasonal multipliers
3. **Staffing Impact:** Lower nurse ratios increase wait times by 15-30%
4. **External Factors:** Heavy traffic (+10-15%), severe weather (+15-25%), local events (+20-40%)
5. **Weekend Effect:** Saturdays/Sundays typically +15-25% due to reduced staffing
6. **Confidence Scoring:** 
   - High confidence (0.85-0.95): Large dataset, normal conditions
   - Medium confidence (0.70-0.84): Limited data or unusual conditions
   - Low confidence (0.50-0.69): Very limited data or extreme conditions

**Output Format (JSON only, no markdown):**
{
  "predictedWaitTime": <integer minutes>,
  "confidenceScore": <0.50-0.95>,
  "factors": {
    "baseWaitTime": <base urgency wait time>,
    "timeOfDayFactor": <0.7-1.5 multiplier>,
    "seasonFactor": <0.8-1.3 multiplier>,
    "dayOfWeekFactor": <1.0-1.25 multiplier>,
    "trafficFactor": <1.0-1.2 multiplier>,
    "weatherFactor": <1.0-1.3 multiplier>,
    "otherFactors": [<array of key impact descriptions>]
  }
}

Respond ONLY with valid JSON. No explanations.`;
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
