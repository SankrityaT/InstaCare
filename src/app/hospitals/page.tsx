"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Clock, Search, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import PredictionFactors from '@/components/PredictionFactors';

interface Hospital {
  id: string;
  name: string;
  region: string;
  distance: number;
  facilitySize: number;
  nurseToPatientRatio: number;
  patientSatisfaction: number;
  historicalWaitTime: number;
  prediction: {
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
    }
  }
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urgency, setUrgency] = useState("Medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  // Function to get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        fetchHospitals(position.coords.latitude, position.coords.longitude, urgency);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  // Function to fetch hospitals data
  const fetchHospitals = async (latitude: number, longitude: number, urgencyLevel: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/predict?latitude=${latitude}&longitude=${longitude}&urgency=${urgencyLevel}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }
      
      const data = await response.json();
      setHospitals(data.hospitals);
      setLoading(false);
    } catch (error) {
      setError("Error fetching hospital data");
      setLoading(false);
    }
  };

  // Filter hospitals based on search query
  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format distance to show in km or miles
  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} km`;
  };

  // Format wait time to show hours and minutes
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get user location on page load
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Nearby Hospitals</h1>
          </div>
          
          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hospitals by name or region..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={urgency} onValueChange={(value) => {
                setUrgency(value);
                if (userLocation) {
                  fetchHospitals(userLocation.latitude, userLocation.longitude, value);
                }
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Urgency Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={getUserLocation} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          )}
          
          {/* Hospital list */}
          <div className="space-y-4">
            {!userLocation && !loading && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Share Your Location</h3>
                <p className="text-muted-foreground mb-4">
                  To find hospitals near you, we need your location.
                </p>
                <Button onClick={getUserLocation}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Share Location
                </Button>
              </div>
            )}
            
            {loading && (
              <div className="text-center p-8">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Finding hospitals near you...</h3>
              </div>
            )}
            
            {filteredHospitals.length > 0 && (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Available Hospitals</h2>
                  <p className="text-muted-foreground">
                    Showing {filteredHospitals.length} hospitals from various locations. 
                    Hospitals are sorted by distance from your current location.
                  </p>
                </div>
                
                {/* Group hospitals by region */}
                {Object.entries(
                  filteredHospitals.reduce((acc, hospital) => {
                    const region = hospital.region.split(',')[0].trim();
                    if (!acc[region]) {
                      acc[region] = [];
                    }
                    acc[region].push(hospital);
                    return acc;
                  }, {} as Record<string, Hospital[]>)
                ).map(([region, hospitals]) => (
                  <div key={region} className="mb-8">
                    <h3 className="text-lg font-medium mb-4 bg-muted p-2 rounded">
                      {region} ({hospitals.length} hospitals)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hospitals.map((hospital) => (
                        <Card key={hospital.id}>
                          <CardHeader>
                            <CardTitle>{hospital.name}</CardTitle>
                            <CardDescription>{hospital.region}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Distance:</span>
                                <span className="font-medium">{formatDistance(hospital.distance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimated Wait:</span>
                                <span className="font-medium flex items-center">
                                  <Clock className="mr-1 h-4 w-4 text-amber-500" />
                                  {formatWaitTime(hospital.prediction.predictedWaitTime)}
                                  <PredictionFactors factors={hospital.prediction.factors} />
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Confidence:</span>
                                <span className="font-medium">
                                  {Math.round(hospital.prediction.confidenceScore * 100)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Historical Wait:</span>
                                <span className="font-medium">{formatWaitTime(hospital.historicalWaitTime)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Satisfaction:</span>
                                <span className="font-medium">{hospital.patientSatisfaction.toFixed(1)}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Facility Size:</span>
                                <span className="font-medium">{hospital.facilitySize} beds</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full">Get Directions</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {userLocation && filteredHospitals.length === 0 && !loading && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hospitals found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or urgency level.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}