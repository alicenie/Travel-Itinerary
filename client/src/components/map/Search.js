// modified from: https://github.com/hibiken/react-places-autocomplete

import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./map_style.css";

export const addAddress = (address, addMarker) => {
  console.log(address);
  geocodeByAddress(address)
    .then((results) => {
      getLatLng(results[0]);
    })
    .then((latLng) => {
      console.log("Success", latLng);
      addMarker(latLng.lat, latLng.lng);
    })
    .catch((error) => console.error("Error", error));
};

const Search = ({
  setCoords,
  addMarker,
  onSelect,
  onChange,
  getLatLng,
  address,
}) => {
  // const [address, setAddress] = useState("");
  const handleSelect = (address) => {
    // console.log("handle select" + address);
    geocodeByAddress(address)
      .then((results) => {
        // console.log(results[0]);
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        // console.log(lat);
        // console.log(lng);
        getLatLng({ lat, lng });
        // setCoords({ lat: lat, lng: lng });
        // addMarker(lat, lng);
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <div className="search">
      <PlacesAutocomplete
        value={address}
        onChange={(address) => {
          // setAddress(address);
          onChange(address);
        }}
        onSelect={(address) => {
          onSelect(address);
          handleSelect(address);
          // console.log("select" + address);
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                // const style = suggestion.active
                //   ? { backgroundColor: "#fafafa", cursor: "pointer" }
                //   : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      // style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default Search;
