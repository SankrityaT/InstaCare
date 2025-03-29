import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface PredictionFactorsProps {
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

const PredictionFactors: React.FC<PredictionFactorsProps> = ({ factors }) => {
  // Format factor as percentage change (e.g., 1.2 -> +20%, 0.8 -> -20%)
  const formatFactor = (factor: number): string => {
    const percentage = (factor - 1) * 100;
    return percentage >= 0 
      ? `+${percentage.toFixed(0)}%` 
      : `${percentage.toFixed(0)}%`;
  };

  // Determine color based on factor impact (green for reducing wait time, red for increasing)
  const getFactorColor = (factor: number): string => {
    return factor <= 1 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Info className="h-4 w-4" />
          <span className="sr-only">Show prediction factors</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Prediction Factors</h4>
          <p className="text-sm text-muted-foreground">
            These factors influenced the predicted wait time:
          </p>
          <div className="grid gap-2 pt-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Base Wait Time:</span>
              <span className="text-sm font-medium">{factors.baseWaitTime.toFixed(0)} min</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Time of Day:</span>
              <span className={`text-sm font-medium ${getFactorColor(factors.timeOfDayFactor)}`}>
                {formatFactor(factors.timeOfDayFactor)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Season:</span>
              <span className={`text-sm font-medium ${getFactorColor(factors.seasonFactor)}`}>
                {formatFactor(factors.seasonFactor)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Day of Week:</span>
              <span className={`text-sm font-medium ${getFactorColor(factors.dayOfWeekFactor)}`}>
                {formatFactor(factors.dayOfWeekFactor)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Traffic:</span>
              <span className={`text-sm font-medium ${getFactorColor(factors.trafficFactor)}`}>
                {formatFactor(factors.trafficFactor)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Weather:</span>
              <span className={`text-sm font-medium ${getFactorColor(factors.weatherFactor)}`}>
                {formatFactor(factors.weatherFactor)}
              </span>
            </div>
            {factors.otherFactors.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Other Factors:</span>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {factors.otherFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PredictionFactors;
