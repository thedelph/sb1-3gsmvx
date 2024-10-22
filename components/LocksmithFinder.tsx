"use client"

import React, { useState, useEffect } from 'react'
import Map, { Marker, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Phone, Home, Car } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"

// Simulated locksmith data
const locksmiths = [
  { id: 1, name: "Quick Lock", eta: 20, phone: "0123456789", services: ["home", "car"], lat: 51.5074, lng: -0.1278 },
  { id: 2, name: "Safe & Sound", eta: 30, phone: "9876543210", services: ["home"], lat: 51.5114, lng: -0.1368 },
  { id: 3, name: "Auto Unlock", eta: 25, phone: "5555555555", services: ["car"], lat: 51.5034, lng: -0.1188 },
  { id: 4, name: "Master Key", eta: 40, phone: "1111111111", services: ["home", "car"], lat: 51.5054, lng: -0.1258 },
]

interface Locksmith {
  id: number;
  name: string;
  eta: number;
  phone: string;
  services: string[];
  lat: number;
  lng: number;
}

export default function LocksmithFinder() {
  const [postcode, setPostcode] = useState("")
  const [service, setService] = useState("")
  const [searching, setSearching] = useState(false)
  const [availableLocksmiths, setAvailableLocksmiths] = useState<Locksmith[]>([])
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 51.5074,
    longitude: -0.1278,
    zoom: 12,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  })
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (token) {
      setMapboxToken(token)
    } else {
      console.error("Mapbox access token is missing")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    // Simulate API call to find locksmiths
    setTimeout(() => {
      const filtered = locksmiths.filter(l => 
        service === "both" ? true : l.services.includes(service)
      )
      setAvailableLocksmiths(filtered)
      setSearching(false)
    }, 2000)
  }

  if (!mapboxToken) {
    return <div className="p-4">Loading map...</div>
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
      >
        {availableLocksmiths.map((locksmith, index) => (
          <Marker
            key={locksmith.id}
            latitude={locksmith.lat}
            longitude={locksmith.lng}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {index + 1}
            </div>
          </Marker>
        ))}
      </Map>

      {/* Search overlay */}
      <Card className="absolute top-4 left-4 w-80 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postcode" className="sr-only">Enter your Postcode</Label>
              <Input
                id="postcode"
                type="text"
                placeholder="Enter your Postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
                className="w-full border-gray-300"
              />
            </div>
            <RadioGroup value={service} onValueChange={setService} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="flex items-center text-sm"><Home className="w-4 h-4 mr-1" /> Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="car" id="car" />
                <Label htmlFor="car" className="flex items-center text-sm"><Car className="w-4 h-4 mr-1" /> Car/Van</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="flex items-center text-sm"><Home className="w-4 h-4 mr-1" /><Car className="w-4 h-4 mr-1" /> Both</Label>
              </div>
            </RadioGroup>
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 py-2 rounded-md"
              disabled={searching}
            >
              {searching ? "Searching..." : "Find Locksmiths"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results overlay */}
      {availableLocksmiths.length > 0 && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm shadow-lg max-h-48 overflow-y-auto">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Available Locksmiths</h2>
            <div className="space-y-2">
              {availableLocksmiths.map((locksmith, index) => (
                <div key={locksmith.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">{index + 1}</span>
                    <span className="font-medium">{locksmith.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">ETA: {locksmith.eta} min</span>
                    <a
                      href={`tel:${locksmith.phone}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="sr-only">Call {locksmith.name}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}