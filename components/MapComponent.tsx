"use client"

import React, { useState, useEffect } from 'react'
import Map, { Marker, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Locksmith {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  locksmiths: Locksmith[];
}

export default function MapComponent({ locksmiths }: MapComponentProps) {
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (token) {
      setMapboxToken(token)
    } else {
      setError("Mapbox access token is missing")
    }
  }, [])

  if (error) {
    return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>
  }

  if (!mapboxToken) {
    return <div className="w-full h-full flex items-center justify-center">Loading map...</div>
  }

  return (
    <Map
      {...viewport}
      onMove={evt => setViewport(evt.viewState)}
      style={{width: '100%', height: '100%'}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxToken}
    >
      {locksmiths.map((locksmith, index) => (
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
  )
}