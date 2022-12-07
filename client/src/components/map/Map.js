import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { getActivities } from "../../reducers/messages";

import Search from "./Search";
import { getPlacesData } from "./api/index";

const zoomLevel = 16;
// const libraries = ["places"];
const mapContainerStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
};
const options = {
  disableDefaultUI: true,
  gestureHandling: "cooperative",
};

const Map = () => {
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries: libraries,
  // });

  const activities = useSelector(getActivities);
  useEffect(() => {
    console.log("Map.js: ", activities);
    const newMarkers = activities.map((d) => {
      if (d.latLng)
        return {
          lat: d.latLng.lat,
          lng: d.latLng.lng,
          time: new Date(),
        };
    });
    console.log(newMarkers);
    setMarkers(newMarkers);
  }, [activities]);

  const [coords, setCoords] = useState({ lat: 40.4432, lng: -79.9428 }); // cmu
  // to use for fetching nearby locations
  const [places, setPlaces] = useState([]);

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directions, setDirections] = useState(null);

  // update labels on marker objects
  let [markerObjs, setMarkerObjs] = useState([]);
  useEffect(() => {
    for (let i = 0; i < markerObjs.length; i++) {
      markerObjs.at(i).setLabel((i + 1).toString());
    }
  }, [markerObjs]);
  const onMarkerLoad = (marker) => {
    // marker.setLabel(markerObjs.length);
    setMarkerObjs((current) => [...current, marker]);
  };

  const addMarker = (lat, lng) => {
    console.log("ADDMARKER");
    setMarkers((current) => [
      ...current,
      {
        lat: lat,
        lng: lng,
        time: new Date(),
      },
    ]);
  };

  // update directions based on markers list
  useEffect(() => {
    console.log("MARKERS CHANGE VALUE");
    if (markers.length <= 1) {
      setDirections(null);
    } else if (markers.length === 2) {
      const directionsService = new window.google.maps.DirectionsService();
      let start = markers.at(0);
      let end = markers.at(-1);
      directionsService.route(
        {
          origin: { lat: start.lat, lng: start.lng },
          destination: { lat: end.lat, lng: end.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
    } else if (markers.length > 2) {
      const directionsService = new window.google.maps.DirectionsService();
      let wayPts = [];
      for (let i = 1; i < markers.length - 1; i++) {
        wayPts.push({
          location: { lat: markers.at(i).lat, lng: markers.at(i).lng },
          stopover: true,
        });
      }

      let start = markers.at(0);
      let end = markers.at(-1);
      directionsService.route(
        {
          origin: { lat: start.lat, lng: start.lng },
          destination: { lat: end.lat, lng: end.lng },
          waypoints: wayPts,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
    }
  }, [markers]);

  // get reference to map instance
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  // TODO: currently only changes when coords change (from search)
  // to avoid too many api calls
  useEffect(() => {
    if (mapRef.current) {
      let ne = mapRef.current.getBounds().getNorthEast();
      let sw = mapRef.current.getBounds().getSouthWest();
      console.log("get places");
      // getPlacesData(sw, ne)
      //   .then((data) => {
      //     console.log(data);
      //     setPlaces(data);
      //   });
    } else {
      console.log("not whee");
    }
  }, [coords]);

  // place marker at position idx in markers list
  const reOrderMarker = (marker, idx) => {
    console.log("reorder marker");
    let markersFiltered = markers.filter((elem) => {
      return elem.lat !== marker.lat || elem.lng !== marker.lng;
    });
    markersFiltered.splice(idx, 0, marker);
    setMarkers(markersFiltered);

    let markerToMove = markerObjs.find((elem) => {
      return (
        marker.lat === elem.getPosition().lat() &&
        marker.lng === elem.getPosition().lng()
      );
    });
    let newMarkerObjs = markerObjs.filter((elem) => {
      return (
        elem.getPosition().lat() !== marker.lat ||
        elem.getPosition().lng() !== marker.lng
      );
    });
    newMarkerObjs.splice(idx, 0, markerToMove);
    setMarkerObjs(newMarkerObjs);

    setSelectedMarker(null);
  };

  // if (loadError) return "Error loading Google Maps";
  // if (!isLoaded) return "Loading Google Maps...";
  return (
    <div>
      <Search setCoords={setCoords} addMarker={addMarker} />

      <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={zoomLevel}
        center={coords}
        options={options}
        onLoad={onMapLoad}
        onClick={(event) => {
          addMarker(event.latLng.lat(), event.latLng.lng());
        }}
        onBoundsChanged={() => {
          // console.log('change');
          // console.log(mapRef.current.getBounds())
        }}
      >
        {/* draw directions on top of the map */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polyLineOptions: {
                // zIndex:50,
                strokeWeight: 5,
              },
              preserveViewport: false,
              suppressMarkers: true,
            }}
          />
        )}

        {/* draw markers onto the map */}
        {markers.map((m) => {
          return (
            <MarkerF
              key={m.time.toISOString()}
              onLoad={onMarkerLoad}
              position={{ lat: m.lat, lng: m.lng }}
              onClick={() => {
                setSelectedMarker(m);
              }}
            />
          );
        })}

        {/* show info window of selected marker */}
        {selectedMarker ? (
          <InfoWindowF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div>
              <select
                onChange={(e) => {
                  reOrderMarker(selectedMarker, parseInt(e.target.value) - 1);
                }}
              >
                {markers.map((m, i) => {
                  let selectedMarkerIdx = markers.findIndex((elem) => {
                    return (
                      selectedMarker.lat === elem.lat &&
                      selectedMarker.lng === elem.lng
                    );
                  });
                  if (selectedMarkerIdx === i) {
                    return (
                      <option value={(i + 1).toString()} selected>
                        {(i + 1).toString()}
                      </option>
                    );
                  } else {
                    return (
                      <option value={(i + 1).toString()}>
                        {(i + 1).toString()}
                      </option>
                    );
                  }
                })}
              </select>

              <button
                onClick={() => {
                  // update markers list
                  let newMarkers = markers.filter((elem) => {
                    return (
                      elem.lat !== selectedMarker.lat ||
                      elem.lng !== selectedMarker.lng
                    );
                  });
                  setMarkers(newMarkers);

                  // update markers objects
                  let newMarkerObjs = markerObjs.filter((marker) => {
                    return (
                      marker.getPosition().lat() !== selectedMarker.lat ||
                      marker.getPosition().lng() !== selectedMarker.lng
                    );
                  });
                  setMarkerObjs(newMarkerObjs);

                  setSelectedMarker(null);
                }}
              >
                Delete
              </button>
            </div>
          </InfoWindowF>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default Map;
