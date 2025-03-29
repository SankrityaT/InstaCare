// Use a different variable name to avoid redeclaration
const pathModule = require('path');
const featureEngineering = require('../utils/featureEngineering');

async function main() {
  try {
    console.log('Starting ER wait time data processing...');
    
    const csvFilePath = pathModule.resolve(process.cwd(), 'ER Wait Time Dataset.csv');
    const outputDir = pathModule.resolve(process.cwd(), 'data');
    
    console.log(`Reading data from: ${csvFilePath}`);
    
    const { processedVisits, hospitalFeatures } = await featureEngineering.featureEngineerCSV(csvFilePath);
    
    console.log(`Processed ${processedVisits.length} visits from ${hospitalFeatures.length} hospitals`);
    
    await featureEngineering.saveProcessedData(processedVisits, hospitalFeatures, outputDir);
    
    console.log(`Data successfully saved to: ${outputDir}`);
    console.log('Hospital features summary:');
    
    // Add type annotation to fix the implicit 'any' error
    hospitalFeatures.forEach((hospital: any) => {
      console.log(`- ${hospital.name} (${hospital.id}): ${hospital.visitCount} visits, avg wait: ${hospital.averageWaitTimes.overall.toFixed(1)} mins`);
    });
    
  } catch (error) {
    console.error('Error processing ER data:', error);
    process.exit(1);
  }
}

main();