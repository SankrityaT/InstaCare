"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Clock, Search, ArrowLeft, Navigation, AlertCircle, MessageSquare, Layers3, SlidersHorizontal, Filter } from "lucide-react";
import Link from 'next/link';
import PredictionFactors from '@/components/PredictionFactors';
import { Badge } from "@/components/ui/badge";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import Map, { Marker, Popup, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

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

interface HospitalWithCoords extends Hospital {
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

// Hospital coordinates - dynamically loaded from API response
// The coordinates are now embedded in the hospital data from the backend

// Free OpenStreetMap-based styles - no API key needed!
const MAP_STYLES = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalWithCoords[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urgency, setUrgency] = useState("Medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalWithCoords | null>(null);
  const [popupInfo, setPopupInfo] = useState<HospitalWithCoords | null>(null);
  const [show3DBuildings, setShow3DBuildings] = useState(true);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: -122.4194,
    latitude: 37.7749,
    zoom: 11,
    pitch: 45,
    bearing: 0
  });

  // Get user's location
  const getUserLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(newLocation);
        setViewState(prev => ({
          ...prev,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: 12
        }));
        fetchHospitals(position.coords.latitude, position.coords.longitude, urgency);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  }, [urgency]);

  // Fetch hospitals data
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
      
      // Hospitals now come with coordinates from the backend
      const hospitalsWithCoords = data.hospitals.map((hospital: Hospital & { coordinates?: { lat: number; lng: number } }) => ({
        ...hospital,
        coordinates: hospital.coordinates || { lat: 0, lng: 0 }
      }));
      
      setHospitals(hospitalsWithCoords);
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

  // Format distance
  const formatDistance = (distance: number) => {
    const miles = distance * 0.621371;
    return `${miles.toFixed(1)} mi`;
  };

  // Format wait time
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get wait time category
  const getWaitTimeCategory = (minutes: number) => {
    if (minutes < 30) return 'Low';
    if (minutes < 60) return 'Medium';
    return 'High';
  };

  // Get marker color based on wait time
  const getMarkerColor = (waitTime: number) => {
    if (waitTime < 30) return '#10b981'; // green
    if (waitTime < 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  // Get wait time badge color
  const getWaitTimeBadgeColor = (waitTime: number) => {
    const category = getWaitTimeCategory(waitTime);
    return category === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
           category === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
           'bg-red-500/20 text-red-400 border-red-500/30';
  };

  // Get directions to hospital
  const getDirections = (hospital: HospitalWithCoords) => {
    if (!userLocation) return;
    const searchQuery = encodeURIComponent(`${hospital.name}, ${hospital.region}`);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${searchQuery}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Focus on hospital
  const focusOnHospital = (hospital: HospitalWithCoords) => {
    if (!hospital.coordinates) return;
    setViewState({
      longitude: hospital.coordinates.lng,
      latitude: hospital.coordinates.lat,
      zoom: 15,
      pitch: 60,
      bearing: 0
    });
    setPopupInfo(hospital);
  };

  // Handle map load to add 3D buildings
  const onMapLoad = useCallback(() => {
    // Map is loaded, 3D buildings will be added via style
  }, []);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (selectedHospital) {
      focusOnHospital(selectedHospital);
    }
  }, [selectedHospital]);

  // Group hospitals by region
  const groupedHospitals = Object.entries(
    filteredHospitals.reduce((acc, hospital) => {
      const region = hospital.region.split(',')[0].trim();
      if (!acc[region]) acc[region] = [];
      acc[region].push(hospital);
      return acc;
    }, {} as Record<string, HospitalWithCoords[]>)
  ).map(([region, hospitals]) => ({ region, hospitals }));

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-slate-800/30 bg-slate-950/30 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Nearby Hospitals
                </h1>
                <p className="text-sm text-slate-400 mt-1">Real-time wait times with 3D visualization</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={getUserLocation} 
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20"
              >
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Modern Compact Search Bar */}
        <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-3 mb-6 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search hospitals by name or region..."
                className="w-full pl-10 pr-4 py-2 bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-slate-700/50"></div>
            
            {/* Filters Button */}
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/50 backdrop-blur-sm transition-all text-slate-300 text-sm"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            
            {/* Divider */}
            <div className="h-6 w-px bg-slate-700/50"></div>
            
            {/* Urgency Dropdown */}
            <Select value={urgency} onValueChange={(value) => {
              setUrgency(value);
              if (userLocation) {
                fetchHospitals(userLocation.latitude, userLocation.longitude, value);
              }
            }}>
              <SelectTrigger className="w-[120px] border-none bg-transparent text-slate-200 text-sm h-auto py-2 focus:ring-0 hover:bg-slate-800/50 backdrop-blur-sm rounded-xl transition-all">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 backdrop-blur-xl">
                <SelectItem value="Critical" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">🔴 Critical</SelectItem>
                <SelectItem value="High" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">🟠 High</SelectItem>
                <SelectItem value="Medium" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">🟡 Medium</SelectItem>
                <SelectItem value="Low" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">🟢 Low</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Divider */}
            <div className="h-6 w-px bg-slate-700/50 hidden sm:block"></div>
            
            {/* 3D Toggle */}
            <button
              onClick={() => setShow3DBuildings(!show3DBuildings)}
              className={`p-2 rounded-xl transition-all backdrop-blur-sm hidden sm:block ${
                show3DBuildings 
                  ? 'bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20' 
                  : 'hover:bg-slate-800/50 text-slate-400'
              }`}
              title="Toggle 3D View"
            >
              <Layers3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <MedicalDisclaimer />

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 shadow-xl shadow-red-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Split view: Hospital list and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Hospital list */}
          <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto px-1 pr-3 custom-scrollbar">
            {!userLocation && !loading && (
              <div className="text-center p-12 border border-dashed border-slate-700/50 rounded-3xl bg-slate-900/20 backdrop-blur-xl">
                <MapPin className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Share Your Location</h3>
                <p className="text-slate-400 mb-6">
                  To find hospitals near you, we need your location.
                </p>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20" 
                  onClick={getUserLocation}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Share Location
                </Button>
              </div>
            )}
            
            {loading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-16 w-16 animate-spin text-orange-500 mb-4" />
                <p className="text-lg font-medium text-slate-200">Finding hospitals near you...</p>
                <p className="text-slate-400">This may take a moment</p>
              </div>
            )}
            
            {groupedHospitals.map((group, index) => (
              <div key={index} className="mb-4">
                <h2 className="text-sm font-semibold text-slate-400 mb-2 px-1 uppercase tracking-wider">
                  {group.region}
                </h2>
                <div className="space-y-2">
                  {group.hospitals.map((hospital, idx) => (
                    <div 
                      key={hospital.id} 
                      className={`group cursor-pointer transition-all duration-200 rounded-2xl p-3.5 backdrop-blur-xl ${
                        selectedHospital?.id === hospital.id 
                          ? 'bg-orange-500/10 ring-2 ring-orange-500/60 shadow-xl shadow-orange-500/20' 
                          : 'bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/30'
                      }`}
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      <div className="flex items-center gap-3">
                        {/* Hospital Icon/Avatar */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          getWaitTimeCategory(hospital.prediction.predictedWaitTime) === 'Low' ? 'bg-emerald-500' :
                          getWaitTimeCategory(hospital.prediction.predictedWaitTime) === 'Medium' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}>
                          {idx + 1}
                        </div>
                        
                        {/* Hospital Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-100 truncate text-sm">
                                {hospital.name}
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {formatDistance(hospital.distance)} • <span className="text-emerald-400">Open til 6pm</span>
                              </p>
                            </div>
                            
                            {/* Action Icons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  getDirections(hospital);
                                }}
                                className="p-1.5 rounded-full hover:bg-slate-700/50 backdrop-blur-sm transition-all"
                                title="Get Directions"
                              >
                                <Navigation className="h-4 w-4 text-slate-400 hover:text-orange-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/report?id=${hospital.id}&name=${encodeURIComponent(hospital.name)}`;
                                }}
                                className="p-1.5 rounded-full hover:bg-slate-700/50 backdrop-blur-sm transition-all"
                                title="Report Wait Time"
                              >
                                <MessageSquare className="h-4 w-4 text-slate-400 hover:text-orange-400" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Expandable Details - Only show when selected */}
                          {selectedHospital?.id === hospital.id && (
                            <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-orange-400" />
                                <span className="text-slate-300">Wait Time:</span>
                                <span className="font-bold text-slate-100">
                                  {formatWaitTime(hospital.prediction.predictedWaitTime)}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ({(hospital.prediction.confidenceScore * 100).toFixed(0)}% confidence)
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-2">
                                  <p className="text-slate-500">Nurse Ratio</p>
                                  <p className="font-semibold text-slate-200">{Math.round(hospital.nurseToPatientRatio)}:1</p>
                                </div>
                                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-2">
                                  <p className="text-slate-500">Satisfaction</p>
                                  <p className="font-semibold text-slate-200">{hospital.patientSatisfaction.toFixed(1)}/10</p>
                                </div>
                                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-2">
                                  <p className="text-slate-500">Beds</p>
                                  <p className="font-semibold text-slate-200">{hospital.facilitySize}</p>
                                </div>
                                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-2">
                                  <p className="text-slate-500">Avg Wait</p>
                                  <p className="font-semibold text-slate-200">{formatWaitTime(Math.round(hospital.historicalWaitTime))}</p>
                                </div>
                              </div>
                              
                              <PredictionFactors factors={hospital.prediction.factors} />
                              
                              <Button 
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm h-9 rounded-xl shadow-lg shadow-orange-500/20" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  getDirections(hospital);
                                }}
                              >
                                <Navigation className="mr-2 h-3.5 w-3.5" />
                                Get Directions
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {userLocation && filteredHospitals.length === 0 && !loading && (
              <div className="text-center p-12 border border-dashed border-slate-700/50 rounded-3xl bg-slate-900/20 backdrop-blur-xl">
                <Search className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-200 mb-2">No hospitals found</h3>
                <p className="text-slate-400">
                  Try adjusting your search or urgency level.
                </p>
              </div>
            )}
          </div>
          
          {/* 3D MapLibre Map - Free & Open Source */}
          <div className="relative h-[calc(100vh-240px)] rounded-3xl overflow-hidden border border-slate-700/30 shadow-2xl backdrop-blur-xl">
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapStyle={MAP_STYLES.dark}
              onLoad={onMapLoad}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Controls */}
              <NavigationControl position="top-right" />
              <GeolocateControl position="top-right" />
              <FullscreenControl position="top-right" />
              <ScaleControl />

              {/* User location marker */}
              {userLocation && (
                <Marker
                  longitude={userLocation.longitude}
                  latitude={userLocation.latitude}
                  anchor="center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" style={{ width: '20px', height: '20px' }}></div>
                    <div className="relative bg-blue-500 border-4 border-white rounded-full shadow-lg" style={{ width: '20px', height: '20px' }}></div>
                  </div>
                </Marker>
              )}

              {/* Hospital markers */}
              {filteredHospitals.map((hospital) => {
                if (!hospital.coordinates || (hospital.coordinates.lat === 0 && hospital.coordinates.lng === 0)) return null;
                
                const color = getMarkerColor(hospital.prediction.predictedWaitTime);
                
                return (
                  <Marker
                    key={hospital.id}
                    longitude={hospital.coordinates.lng}
                    latitude={hospital.coordinates.lat}
                    anchor="bottom"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      setPopupInfo(hospital);
                      setSelectedHospital(hospital);
                    }}
                  >
                    <div className="cursor-pointer transform transition-transform hover:scale-110">
                      <div className="relative">
                        {/* Marker pin */}
                        <svg width="40" height="50" viewBox="0 0 40 50" className="drop-shadow-lg">
                          <path
                            d="M20 0C8.95 0 0 8.95 0 20c0 15 20 30 20 30s20-15 20-30C40 8.95 31.05 0 20 0z"
                            fill={color}
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle cx="20" cy="20" r="8" fill="white" />
                        </svg>
                        {/* Wait time badge */}
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-1 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap"
                          style={{ borderColor: color, borderWidth: '2px' }}
                        >
                          {formatWaitTime(hospital.prediction.predictedWaitTime)}
                        </div>
                      </div>
                    </div>
                  </Marker>
                );
              })}

              {/* Popup */}
              {popupInfo && (
                <Popup
                  longitude={popupInfo.coordinates.lng}
                  latitude={popupInfo.coordinates.lat}
                  anchor="top"
                  onClose={() => setPopupInfo(null)}
                  closeButton={true}
                  closeOnClick={false}
                  className="hospital-popup"
                >
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-slate-900 mb-1">{popupInfo.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{formatDistance(popupInfo.distance)} away</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-slate-900">
                        {formatWaitTime(popupInfo.prediction.predictedWaitTime)}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={() => getDirections(popupInfo)}
                    >
                      <Navigation className="mr-2 h-3 w-3" />
                      Get Directions
                    </Button>
                  </div>
                </Popup>
              )}
            </Map>

            {/* Map overlay info */}
            <div className="absolute bottom-4 left-4 bg-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-3 text-xs text-slate-300 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>&lt; 30 min wait</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>30-60 min wait</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>&gt; 60 min wait</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.5);
        }
        .maplibregl-popup-content, .mapboxgl-popup-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .maplibregl-popup-close-button, .mapboxgl-popup-close-button {
          font-size: 20px;
          padding: 4px 8px;
          color: #64748b;
        }
        .maplibregl-popup-close-button:hover, .mapboxgl-popup-close-button:hover {
          background: #f1f5f9;
          color: #334155;
        }
      `}</style>
    </div>
  );
}
