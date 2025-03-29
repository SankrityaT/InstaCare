const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Define interfaces for our data types
interface ProcessedVisit {
  visitId: string;
  hospitalId: string;
  hospitalName: string;
  region: string;
  visitDate: string;
  dayOfWeek: string;
  season: string;
  timeOfDay: string;
  urgencyLevel: string;
  nurseToPatientRatio: number;
  specialistAvailability: number;
  facilitySize: number;
  timeToRegistration: number;
  timeToTriage: number;
  timeToMedicalProfessional: number;
  totalWaitTime: number;
  patientOutcome: string;
  patientSatisfaction: number;
}

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

// Helper function to calculate average wait time
function calculateAverageWaitTime(visits: ProcessedVisit[]): number {
  if (visits.length === 0) return 0;
  return visits.reduce((sum: number, visit: ProcessedVisit) => sum + visit.totalWaitTime, 0) / visits.length;
}

async function featureEngineerCSV(filePath: string): Promise<{
  processedVisits: ProcessedVisit[];
  hospitalFeatures: HospitalFeatures[];
}> {
  const rawVisits: any[] = [];
  
  // Parse the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: any) => {
        rawVisits.push(row);
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  // Process each visit to extract features
  const processedVisits = rawVisits.map(visit => ({
    visitId: visit['Visit ID'],
    hospitalId: visit['Hospital ID'],
    hospitalName: visit['Hospital Name'],
    region: visit['Region'],
    visitDate: visit['Visit Date'],
    dayOfWeek: visit['Day of Week'],
    season: visit['Season'],
    timeOfDay: visit['Time of Day'],
    urgencyLevel: visit['Urgency Level'],
    nurseToPatientRatio: parseFloat(visit['Nurse-to-Patient Ratio']),
    specialistAvailability: parseInt(visit['Specialist Availability'], 10),
    facilitySize: parseInt(visit['Facility Size (Beds)'], 10),
    timeToRegistration: parseInt(visit['Time to Registration (min)'], 10),
    timeToTriage: parseInt(visit['Time to Triage (min)'], 10),
    timeToMedicalProfessional: parseInt(visit['Time to Medical Professional (min)'], 10),
    totalWaitTime: parseInt(visit['Total Wait Time (min)'], 10),
    patientOutcome: visit['Patient Outcome'],
    patientSatisfaction: parseInt(visit['Patient Satisfaction'], 10)
  }));

  // Group visits by hospital to calculate aggregate features
  const hospitalMap = new Map<string, ProcessedVisit[]>();
  
  processedVisits.forEach(visit => {
    if (!hospitalMap.has(visit.hospitalId)) {
      hospitalMap.set(visit.hospitalId, []);
    }
    hospitalMap.get(visit.hospitalId)!.push(visit);
  });

  // Calculate features for each hospital
  const hospitalFeatures: HospitalFeatures[] = [];
  
  hospitalMap.forEach((visits, hospitalId) => {
    const firstVisit = visits[0];
    
    // Calculate average wait times by different categories
    const waitTimesByUrgency = {
      Critical: calculateAverageWaitTime(visits.filter(v => v.urgencyLevel === 'Critical')),
      High: calculateAverageWaitTime(visits.filter(v => v.urgencyLevel === 'High')),
      Medium: calculateAverageWaitTime(visits.filter(v => v.urgencyLevel === 'Medium')),
      Low: calculateAverageWaitTime(visits.filter(v => v.urgencyLevel === 'Low'))
    };
    
    const waitTimesByTimeOfDay = {
      'Early Morning': calculateAverageWaitTime(visits.filter(v => v.timeOfDay === 'Early Morning')),
      'Late Morning': calculateAverageWaitTime(visits.filter(v => v.timeOfDay === 'Late Morning')),
      'Afternoon': calculateAverageWaitTime(visits.filter(v => v.timeOfDay === 'Afternoon')),
      'Evening': calculateAverageWaitTime(visits.filter(v => v.timeOfDay === 'Evening')),
      'Night': calculateAverageWaitTime(visits.filter(v => v.timeOfDay === 'Night'))
    };
    
    const waitTimesBySeason = {
      Winter: calculateAverageWaitTime(visits.filter(v => v.season === 'Winter')),
      Spring: calculateAverageWaitTime(visits.filter(v => v.season === 'Spring')),
      Summer: calculateAverageWaitTime(visits.filter(v => v.season === 'Summer')),
      Fall: calculateAverageWaitTime(visits.filter(v => v.season === 'Fall'))
    };
    
    // Calculate average nurse-to-patient ratio and specialist availability
    const avgNurseToPatientRatio = visits.reduce((sum, v) => sum + v.nurseToPatientRatio, 0) / visits.length;
    const avgSpecialistAvailability = visits.reduce((sum, v) => sum + v.specialistAvailability, 0) / visits.length;
    const avgPatientSatisfaction = visits.reduce((sum, v) => sum + v.patientSatisfaction, 0) / visits.length;
    
    hospitalFeatures.push({
      id: hospitalId,
      name: firstVisit.hospitalName,
      region: firstVisit.region,
      facilitySize: firstVisit.facilitySize,
      averageWaitTimes: {
        overall: calculateAverageWaitTime(visits),
        byUrgency: waitTimesByUrgency,
        byTimeOfDay: waitTimesByTimeOfDay,
        bySeason: waitTimesBySeason
      },
      nurseToPatientRatio: avgNurseToPatientRatio,
      specialistAvailability: avgSpecialistAvailability,
      patientSatisfaction: avgPatientSatisfaction,
      visitCount: visits.length
    });
  });

  return {
    processedVisits,
    hospitalFeatures
  };
}

// Function to save the processed data to JSON files
async function saveProcessedData(
  processedVisits: ProcessedVisit[],
  hospitalFeatures: HospitalFeatures[],
  outputDir: string,
  visitsFileName: string = 'processed-visits.json',
  hospitalFeaturesFileName: string = 'hospital-features.json'
): Promise<void> {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save processed visits
  fs.writeFileSync(
    path.join(outputDir, visitsFileName),
    JSON.stringify(processedVisits, null, 2)
  );
  
  // Save hospital features
  fs.writeFileSync(
    path.join(outputDir, hospitalFeaturesFileName),
    JSON.stringify(hospitalFeatures, null, 2)
  );
}

module.exports = {
  featureEngineerCSV,
  saveProcessedData
};