"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Clock, Search, ArrowLeft, Navigation, AlertCircle, MessageSquare } from "lucide-react";
import Link from 'next/link';
import Script from 'next/script';
import PredictionFactors from '@/components/PredictionFactors';
import { Badge } from "@/components/ui/badge";

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

// Extend the Google Maps Marker type to include our custom infoWindow property
interface ExtendedMarker extends google.maps.Marker {
  infoWindow?: google.maps.InfoWindow;
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
  'LON-1': { lat: 51.5074, lng: -0.1278 },
  'LON-2': { lat: 51.5225, lng: -0.1539 },
  'LON-3': { lat: 51.4700, lng: -0.1534 }
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
  const markersRef = useRef<ExtendedMarker[]>([]);

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
      
      // Add coordinates to each hospital - but don't generate random ones
      const hospitalsWithCoords = data.hospitals.map((hospital: Hospital) => ({
        ...hospital,
        coordinates: hospitalCoordinates[hospital.id] || { 
          // Use null coordinates instead of random ones
          lat: 0, 
          lng: 0 
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
      if (!hospital.coordinates || (hospital.coordinates.lat === 0 && hospital.coordinates.lng === 0)) return;
      
      // Use fixed thresholds for marker colors
      const waitTime = hospital.prediction.predictedWaitTime;
      const markerColor = waitTime > 120 ? '#F44336' :  // High - red
                          waitTime > 60 ? '#FFC107' :   // Medium - amber
                          '#4CAF50';                    // Low - green
      
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
      }) as ExtendedMarker;
      
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
        
        // Close any open info windows
        markersRef.current.forEach(m => {
          const extendedMarker = m as ExtendedMarker;
          if (extendedMarker.infoWindow) {
            extendedMarker.infoWindow.close();
          }
        });
        
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
        });
        
        // Store the info window on the marker for later reference
        marker.infoWindow = infoWindow;
        
        infoWindow.open(mapRef.current!, marker);
        
        // Highlight the marker
        if (marker.setAnimation) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 1500);
        }
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

  // Function to focus map on a specific hospital
  const focusOnHospital = (hospital: HospitalWithCoords) => {
    if (!mapRef.current || !hospital.coordinates) return;
    
    // Close any open info windows first
    markersRef.current.forEach(m => {
      const extendedMarker = m as ExtendedMarker;
      if (extendedMarker.infoWindow) {
        extendedMarker.infoWindow.close();
      }
    });
    
    // Zoom in on the selected hospital
    mapRef.current.setZoom(15);
    mapRef.current.setCenter(hospital.coordinates);
    
    // Find the marker for this hospital
    const marker = markersRef.current.find(marker => 
      marker.getPosition()?.lat() === hospital.coordinates.lat && 
      marker.getPosition()?.lng() === hospital.coordinates.lng
    );
    
    if (marker) {
      // Create and open info window for this hospital
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
      
      // Store the info window on the marker for later reference
      marker.infoWindow = infoWindow;
      
      infoWindow.open(mapRef.current, marker);
      
      // Highlight the marker
      if (marker.setAnimation) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1500);
      }
    }
  };

  // Filter hospitals based on search query
  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format distance to show in miles instead of km
  const formatDistance = (distance: number) => {
    // Convert km to miles (1 km ≈ 0.621371 miles)
    const miles = distance * 0.621371;
    return `${miles.toFixed(1)} mi`;
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
    
    // Use the hospital name and region for a more accurate search
    const searchQuery = encodeURIComponent(`${hospital.name}, ${hospital.region}`);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${searchQuery}&travelmode=driving`;
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
  }, [mapLoaded, selectedHospital, urgency]);

  useEffect(() => {
    if (selectedHospital) {
      focusOnHospital(selectedHospital);
    }
  }, [selectedHospital]);

  // Add styles to remove default margins from body and html and prevent scrolling beyond content
  useEffect(() => {
    // Function to set the document height to match the content
    const setDocumentHeight = () => {
      // Get the main element
      const mainElement = document.querySelector('main');
      if (!mainElement) return;
      
      // Calculate the total height of the main element
      const mainHeight = mainElement.getBoundingClientRect().bottom;
      
      // Set the body and html height to match exactly the content height
      document.body.style.height = `${mainHeight}px`;
      document.documentElement.style.height = `${mainHeight}px`;
      document.body.style.minHeight = `${mainHeight}px`;
      document.body.style.maxHeight = `${mainHeight}px`;
      document.documentElement.style.minHeight = `${mainHeight}px`;
      document.documentElement.style.maxHeight = `${mainHeight}px`;
      document.body.style.overflow = 'hidden';
    };
    
    // Initial setup
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Set height after content is rendered and map is loaded
    const checkMapAndSetHeight = () => {
      if (mapLoaded) {
        setTimeout(setDocumentHeight, 100);
      } else {
        setTimeout(checkMapAndSetHeight, 100);
      }
    };
    
    checkMapAndSetHeight();
    
    // Update height when window is resized
    window.addEventListener('resize', setDocumentHeight);
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      if (mapLoaded) {
        setTimeout(setDocumentHeight, 100);
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      // Clean up styles when component unmounts
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.minHeight = '';
      document.body.style.maxHeight = '';
      document.documentElement.style.minHeight = '';
      document.documentElement.style.maxHeight = '';
      window.removeEventListener('resize', setDocumentHeight);
      observer.disconnect();
    };
  }, [mapLoaded]);

  // Group hospitals by region
  const groupedHospitals = Object.entries(
    filteredHospitals.reduce((acc, hospital) => {
      const region = hospital.region.split(',')[0].trim();
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(hospital);
      return acc;
    }, {} as Record<string, HospitalWithCoords[]>)
  ).map(([region, hospitals]) => ({ region, hospitals }));

  // Get wait time badge color
  const getWaitTimeBadgeColor = (waitTime: number) => {
    const waitTimeCategory = getWaitTimeCategory(waitTime);
    return waitTimeCategory === 'Low' ? 'bg-green-100 text-green-600' : 
           waitTimeCategory === 'Medium' ? 'bg-amber-100 text-amber-600' : 
           'bg-red-100 text-red-600';
  };

  return (
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDmP20jgL_cGHLz7qLkIQSVkv5w5AfjkrE&libraries=places"
        onLoad={handleMapInit}
      />
      
      <main className="container mx-auto px-4 pt-4 pb-0" style={{ marginBottom: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-2 hover:bg-blue-100 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Nearby Hospitals</h1>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={getUserLocation} disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Refresh Location
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
            <Input
              placeholder="Search hospitals by name or region..."
              className="pl-10 border-blue-100 focus:border-blue-300 rounded-md shadow-sm"
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
              <SelectTrigger className="w-[180px] border-blue-100 focus:border-blue-300 rounded-md shadow-sm">
                <SelectValue placeholder="Urgency Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Split view: Hospital list and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-0">
          {/* Hospital list */}
          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 rounded-lg">
            {!userLocation && !loading && (
              <div className="text-center p-8 border border-dashed rounded-lg bg-blue-50 border-blue-200">
                <MapPin className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-blue-800">Share Your Location</h3>
                <p className="text-blue-600 mb-4">
                  To find hospitals near you, we need your location.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md" onClick={getUserLocation}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Share Location
                </Button>
              </div>
            )}
            
            {loading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-lg font-medium text-blue-800">Finding hospitals near you...</p>
                <p className="text-blue-600">This may take a moment</p>
              </div>
            )}
            
            {groupedHospitals.map((group, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{group.region}</h2>
                <div className="space-y-3">
                  {group.hospitals.map((hospital) => (
                    <Card 
                      key={hospital.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedHospital?.id === hospital.id ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold">{hospital.name}</CardTitle>
                            <CardDescription>{hospital.region} • {hospital.distance.toFixed(1)} miles away</CardDescription>
                          </div>
                          <Badge 
                            className={`${getWaitTimeBadgeColor(hospital.prediction.predictedWaitTime)}`}
                          >
                            {formatWaitTime(hospital.prediction.predictedWaitTime)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <div>
                              <span className="text-sm font-medium">Wait Time: </span>
                              <span className="font-semibold">{formatWaitTime(hospital.prediction.predictedWaitTime)}</span>
                              <span className="text-xs text-muted-foreground ml-1">
                                (Confidence: {(hospital.prediction.confidenceScore * 100).toFixed(0)}%)
                              </span>
                              <PredictionFactors factors={hospital.prediction.factors} />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Nurse-Patient Ratio</p>
                              <p className="font-medium">{hospital.nurseToPatientRatio}:1</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Satisfaction</p>
                              <p className="font-medium">{hospital.patientSatisfaction.toFixed(1)}/10</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Facility Size</p>
                              <p className="font-medium">{hospital.facilitySize} beds</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Historical Wait</p>
                              <p className="font-medium">{formatWaitTime(hospital.historicalWaitTime)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex gap-2">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(hospital);
                            }}
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Get Directions
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="bg-white hover:bg-blue-50 border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to the report page with hospital ID as query parameter
                              window.location.href = `/report?id=${hospital.id}&name=${encodeURIComponent(hospital.name)}`;
                            }}
                          >
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {userLocation && filteredHospitals.length === 0 && !loading && (
              <div className="text-center p-8 border border-dashed rounded-lg bg-blue-50 border-blue-200">
                <Search className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-blue-800">No hospitals found</h3>
                <p className="text-blue-600">
                  Try adjusting your search or urgency level.
                </p>
              </div>
            )}
          </div>
          
          {/* Google Map */}
          <div className="relative h-[calc(100vh-180px)] rounded-lg overflow-hidden border shadow-md">
            <div id="map" className="w-full h-full"></div>
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50/80">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-blue-800">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}