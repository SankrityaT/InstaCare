"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Clock, Search, ArrowLeft, Navigation } from "lucide-react";
import Link from 'next/link';
import Script from 'next/script';
import PredictionFactors from '@/components/PredictionFactors';

/// <reference types="@types/google.maps" />

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

// Add coordinates to our hospital interface for mapping
interface HospitalWithCoords extends Hospital {
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Hospital coordinates for mapping
const hospitalCoordinates: Record<string, { lat: number; lng: number }> = {
  // San Francisco / California
  'HOSP-1': { lat: 37.7749, lng: -122.4194 },
  'HOSP-2': { lat: 37.3382, lng: -121.8863 },
  'HOSP-3': { lat: 38.5816, lng: -121.4944 },
  'HOSP-4': { lat: 36.7783, lng: -119.4179 },
  'HOSP-5': { lat: 34.0522, lng: -118.2437 },
  // New York
  'NYC-1': { lat: 40.7128, lng: -74.0060 },
  'NYC-2': { lat: 40.7589, lng: -73.9851 },
  'NYC-3': { lat: 40.8448, lng: -73.8648 },
  // Phoenix
  'PHX-1': { lat: 33.4484, lng: -112.0740 },
  'PHX-2': { lat: 33.5722, lng: -112.0891 },
  'PHX-3': { lat: 33.3883, lng: -111.9647 },
  // London
  'LDN-1': { lat: 51.5074, lng: -0.1278 },
  'LDN-2': { lat: 51.5225, lng: -0.1539 },
  'LDN-3': { lat: 51.4700, lng: -0.1534 }
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalWithCoords[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urgency, setUrgency] = useState("Medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalWithCoords | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

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
      
      // Add coordinates to each hospital
      const hospitalsWithCoords = data.hospitals.map((hospital: Hospital) => ({
        ...hospital,
        coordinates: hospitalCoordinates[hospital.id] || { 
          // Default to hospital's actual location if we don't have coordinates
          lat: latitude + (Math.random() - 0.5) * 0.1, 
          lng: longitude + (Math.random() - 0.5) * 0.1 
        }
      }));
      
      setHospitals(hospitalsWithCoords);
      setLoading(false);
      
      // Initialize or update map with new hospitals
      if (mapLoaded && hospitalsWithCoords.length > 0) {
        initializeMap(hospitalsWithCoords, { lat: latitude, lng: longitude });
      }
    } catch (error) {
      setError("Error fetching hospital data");
      setLoading(false);
    }
  };

  // Initialize Google Map
  const initializeMap = (hospitals: HospitalWithCoords[], userLocation: { lat: number, lng: number }) => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Center map on user location
    mapRef.current.setCenter(userLocation);
    
    // Add user location marker
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: mapRef.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
      title: "Your Location"
    });
    markersRef.current.push(userMarker);
    
    // Add hospital markers
    hospitals.forEach((hospital, index) => {
      if (hospital.coordinates.lat === 0 && hospital.coordinates.lng === 0) return;
      
      const waitTimeCategory = getWaitTimeCategory(hospital.prediction.predictedWaitTime);
      const markerColor = waitTimeCategory === 'Low' ? '#4CAF50' : 
                          waitTimeCategory === 'Medium' ? '#FFC107' : '#F44336';
      
      const marker = new google.maps.Marker({
        position: hospital.coordinates,
        map: mapRef.current!,
        title: hospital.name,
        label: {
          text: (index + 1).toString(),
          color: 'white'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });
      
      // Add click listener to marker
      marker.addListener('click', () => {
        setSelectedHospital(hospital);
        
        // Create info window content
        const contentString = `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px;">${hospital.name}</h3>
            <p style="margin: 0 0 5px 0; font-size: 14px;">${formatWaitTime(hospital.prediction.predictedWaitTime)} wait</p>
            <p style="margin: 0; font-size: 12px;">${formatDistance(hospital.distance)} away</p>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
        });
        
        infoWindow.open(mapRef.current!, marker);
      });
      
      markersRef.current.push(marker);
    });
    
    // Fit bounds to include all markers
    if (markersRef.current.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      mapRef.current.fitBounds(bounds);
    }
  };

  // Function to initialize map when Google Maps script is loaded
  const handleMapInit = () => {
    if (!window.google || !document.getElementById('map')) return;
    
    mapRef.current = new google.maps.Map(document.getElementById('map')!, {
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 10,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi.medical",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#f5f5f5" }]
        },
        {
          featureType: "poi.medical",
          elementType: "labels.text.fill",
          stylers: [{ color: "#4285F4" }]
        }
      ]
    });
    
    setMapLoaded(true);
    
    // If we already have hospitals and user location, initialize the map
    if (hospitals.length > 0 && userLocation) {
      initializeMap(hospitals, { lat: userLocation.latitude, lng: userLocation.longitude });
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

  // Get wait time category for color coding
  const getWaitTimeCategory = (minutes: number) => {
    if (minutes < 30) return 'Low';
    if (minutes < 60) return 'Medium';
    return 'High';
  };

  // Get directions to hospital
  const getDirections = (hospital: HospitalWithCoords) => {
    if (!userLocation) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Get user location on page load
  useEffect(() => {
    getUserLocation();
  }, []);

  // Update map when hospitals or selected hospital changes
  useEffect(() => {
    if (mapLoaded && hospitals.length > 0 && userLocation) {
      initializeMap(hospitals, { lat: userLocation.latitude, lng: userLocation.longitude });
    }
  }, [mapLoaded, selectedHospital]);

  return (
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDmP20jgL_cGHLz7qLkIQSVkv5w5AfjkrE&libraries=places"
        onLoad={handleMapInit}
      />
      
      <main className="container mx-auto px-4 py-8">
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
        
        {/* Split view: Hospital list and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hospital list */}
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
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
                  }, {} as Record<string, HospitalWithCoords[]>)
                ).map(([region, hospitals]) => (
                  <div key={region} className="mb-8">
                    <h3 className="text-lg font-medium mb-4 bg-muted p-2 rounded">
                      {region} ({hospitals.length} hospitals)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {hospitals.map((hospital, index) => {
                        const waitTimeCategory = getWaitTimeCategory(hospital.prediction.predictedWaitTime);
                        const waitTimeColor = 
                          waitTimeCategory === 'Low' ? 'text-green-600 bg-green-50' : 
                          waitTimeCategory === 'Medium' ? 'text-amber-600 bg-amber-50' : 
                          'text-red-600 bg-red-50';
                        
                        return (
                          <Card 
                            key={hospital.id} 
                            className={`border-l-4 ${
                              selectedHospital?.id === hospital.id ? 'border-l-primary' : 'border-l-transparent'
                            } hover:shadow-md transition-all`}
                            onClick={() => setSelectedHospital(hospital)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-2">
                                      {index + 1}
                                    </div>
                                    <CardTitle className="text-xl">{hospital.name}</CardTitle>
                                  </div>
                                  <CardDescription>{hospital.region}</CardDescription>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${waitTimeColor}`}>
                                  {waitTimeCategory} Wait
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Distance</p>
                                  <p className="font-medium flex items-center">
                                    <MapPin className="mr-1 h-4 w-4 text-slate-400" />
                                    {formatDistance(hospital.distance)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Wait Time</p>
                                  <p className="font-medium flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-slate-400" />
                                    {formatWaitTime(hospital.prediction.predictedWaitTime)}
                                    <PredictionFactors factors={hospital.prediction.factors} />
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Confidence</p>
                                  <p className="font-medium">
                                    {Math.round(hospital.prediction.confidenceScore * 100)}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Historical Wait</p>
                                  <p className="font-medium">{formatWaitTime(hospital.historicalWaitTime)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                                  <p className="font-medium">{hospital.patientSatisfaction.toFixed(1)}/10</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Facility Size</p>
                                  <p className="font-medium">{hospital.facilitySize} beds</p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                className="w-full" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  getDirections(hospital);
                                }}
                              >
                                <Navigation className="mr-2 h-4 w-4" />
                                Get Directions
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
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
          
          {/* Google Map */}
          <div className="relative h-[calc(100vh-200px)] rounded-lg overflow-hidden border">
            <div id="map" className="w-full h-full"></div>
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}