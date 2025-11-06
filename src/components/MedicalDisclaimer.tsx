import { AlertTriangle } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-200">
          <p className="font-semibold mb-1">Medical Disclaimer</p>
          <p className="text-amber-300/90">
            Wait times are estimates based on historical data and current conditions. 
            Actual wait times may vary. <strong>For real-time information and medical emergencies, 
            call 911 or contact the hospital directly.</strong> This tool is for informational 
            purposes only and does not constitute medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DataSourceBadge({ source, lastUpdated }: { source: string; lastUpdated?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      <span>Source: {source}</span>
      {lastUpdated && (
        <span className="text-slate-500">• Updated {lastUpdated}</span>
      )}
    </div>
  );
}
