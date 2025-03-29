// Import path and feature engineering utility
const pathLib = require('path');
const featureEngineeringUtil = require('../utils/featureEngineering');

async function main() {
  try {
    console.log('Starting Real ER wait time data processing...');
    
    const csvFilePath = pathLib.resolve(process.cwd(), 'Real ER Wait Time Dataset.csv');
    const outputDir = pathLib.resolve(process.cwd(), 'data');
    
    console.log(`Reading data from: ${csvFilePath}`);
    
    const { processedVisits, hospitalFeatures } = await featureEngineeringUtil.featureEngineerCSV(csvFilePath);
    
    console.log(`Processed ${processedVisits.length} visits from ${hospitalFeatures.length} hospitals`);
    
    await featureEngineeringUtil.saveProcessedData(
      processedVisits, 
      hospitalFeatures, 
      outputDir,
      'real-processed-visits.json',
      'real-hospital-features.json'
    );
    
    console.log(`Data successfully saved to: ${outputDir}`);
    console.log('Hospital features summary:');
    
    // Add type annotation to fix the implicit 'any' error
    hospitalFeatures.forEach((hospital: any) => {
      console.log(`- ${hospital.name} (${hospital.id}): ${hospital.visitCount} visits, avg wait: ${hospital.averageWaitTimes.overall.toFixed(1)} mins`);
    });
    
  } catch (error) {
    console.error('Error processing Real ER data:', error);
    process.exit(1);
  }
}

main();
