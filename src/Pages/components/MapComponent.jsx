import React from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, Tooltip } from 'react-leaflet'
import { decode } from "@googlemaps/polyline-codec";
import { getAddressBycoOrdinates } from '../../Services/UserServices'


const MapComponent = React.memo(({ setDestination, setOrigin, toggle, originMarker, destinationMarker, PolylineDetails,ActiveTollDetails }) => {
  // state for storing the user current(origin)  location
  const [useroriginLocation, setUserOriginLocation] = useState(null);
  const [userdestinationLocation, setUserDestinationLocation] = useState(null);

  //storing the map reference
  const [map, setMap] = useState(null)

  //marker reference
  const originmarkerRef = useRef(null)
  const destinationmarkerRef = useRef(null)


  const OrigineventHandlers = useMemo(
    () => ({
      dragend() {
        const marker1 = originmarkerRef.current
        if (marker1 != null) {
          // setUserOriginLocation(marker.getLatLng())
          getAddressBycoOrdinates(marker1.getLatLng())
            .then((data) => {
              if (data && data.length > 0) {
                setOrigin(data[0].title, marker1.getLatLng())
              }
              else {
                setOrigin(' ', marker1.getLatLng())
              }
            })
        }
      },
    }),
    [],
  )


  const DestinationeventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = destinationmarkerRef.current
        if (marker != null) {
          // setUserDestinationLocation(marker.getLatLng())
          getAddressBycoOrdinates(marker.getLatLng())
            .then((data) => {
              if (data && data.length > 0) {
                setDestination(data[0].title, marker.getLatLng())
              }
              else {
                setDestination(' ', marker.getLatLng())
              }
            })
        }
      },
    }),
    [],
  )

  // setting the location by clicking on the map
  const OnClick = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        if (toggle) {
          // setUserOriginLocation({ lat, lng })
          getAddressBycoOrdinates({ lat, lng })
            .then((data) => {
              if (data && data.length > 0) {
                setOrigin(data[0].title, { lat, lng })
              }
              else {
                setOrigin(' ', { lat, lng })
              }
            })
        }
        else {
          // setUserDestinationLocation({ lat, lng })
          getAddressBycoOrdinates({ lat, lng })
            .then((data) => {
              if (data && data.length > 0) {
                setDestination(data[0].title, { lat, lng })
              }
              else {
                setDestination(' ', { lat, lng })
              }
            })
        }
      },
    })
  }

  useEffect(() => {
    // Ask for geolocation permission and retrieve user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // setUserOriginLocation({ lat: latitude, lng: longitude })
          getAddressBycoOrdinates({ lat: latitude, lng: longitude })
            .then((data) => {
              if (data && data.length > 0) {
                setOrigin(data[0].title, { lat: latitude, lng: longitude })
              }
              else {
                setOrigin(' ', { lat: latitude, lng: longitude })
              }
            })

        }
      );
    } else {
      console.log('Geolocation is not supported.');
    }
  }, []);

  // flying the map to current location if user provides it
  useEffect(() => {
    if (useroriginLocation) {
      if (map) {
        map.flyTo(useroriginLocation, 15)
      }
    }
  }, [useroriginLocation])


  useEffect(() => {
    if (userdestinationLocation) {
      if (map) {
        map.flyTo(userdestinationLocation, 15)
      }
    }
  }, [userdestinationLocation])

  useEffect(() => {
    if (originMarker) {
      setUserOriginLocation(originMarker);
    }
  }, [originMarker]);

  useEffect(() => {
    if (destinationMarker) {
      setUserDestinationLocation(destinationMarker);
    }
  }, [destinationMarker]);


  return (
    <MapContainer center={[22.3511148, 78.6677428]} zoom={5} scrollWheelZoom={true} ref={setMap} style={{ height: '550px' }}>
      <TileLayer
        attribution='Drag pointer to your location'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(useroriginLocation) && (
        <Marker position={useroriginLocation} draggable={true}
          eventHandlers={OrigineventHandlers} ref={originmarkerRef}>
          <Popup>Your Origin</Popup>
        </Marker>
      )}
      {(userdestinationLocation) && (
        <Marker position={userdestinationLocation} draggable={true}
          eventHandlers={DestinationeventHandlers} ref={destinationmarkerRef}>
          <Popup>Your Destination</Popup>
        </Marker>
      )}
      {(PolylineDetails && PolylineDetails.length > 0) &&
        PolylineDetails.map((route, index) => (
          <>
            <Polyline
              key={index}
              pathOptions={{ color: ActiveTollDetails === index ? 'blue' : 'red' }}
              positions={decode(route.polyline)}
            />
            {(route.data.hasTolls === true&&ActiveTollDetails===index) && route.data.tolls.map((toll, i) => {
              return (
                <Marker key={i} position={[toll.lat, toll.lng]}>
                  <Tooltip permanent><p>Name:{toll.name}<br />CashCost:{toll.cashCost}<br />TagCost:{toll.tagCost}</p></Tooltip>
                </Marker>
              )
            }
            )
            }

          </>
        ))
      }
      <OnClick />
    </MapContainer>
  )
});

export default MapComponent