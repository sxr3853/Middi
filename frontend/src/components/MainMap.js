import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { BarLoader } from 'react-spinners'

export const MainMap = withScriptjs(withGoogleMap(({
  coordinates,
  isMarkerShown,
  isMapLoading
}) =>
  <GoogleMap
    defaultZoom={15}
    center={coordinates}
  >
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {
        isMarkerShown
          ? <Marker position={coordinates} />
          : null
      }
      {
        isMapLoading
          ? (
            <BarLoader
              color={'#8ABEFD'}
              loading={true}
              width={2000}
            />
          ) : null
      }
    </div>
  </GoogleMap>
))
