// modified from: https://github.com/hibiken/react-places-autocomplete

import React, {useState,} from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

export const addAddress = (address, addMarker) => {
  console.log(address);
  geocodeByAddress(address)
    .then(results => {
      getLatLng(results[0])
    })
    .then(latLng => {
      console.log('Success', latLng)
      addMarker(latLng.lat, latLng.lng);
    })
    .catch(error => console.error('Error', error));
};

const Search = ({setCoords, addMarker}) => {
  const [address, setAddress] = useState("");
  const handleSelect = (address) => {
    console.log(address);
    geocodeByAddress(address)
      .then(results => {
        getLatLng(results[0])
      })
      .then(latLng => {
        console.log('Success', latLng)
        setAddress(address);
        setCoords({lat:latLng.lat, lng:latLng.lng});
        addMarker(latLng.lat, latLng.lng);  // can remove later
      })
      .catch(error => console.error('Error', error));
  };

  return (
    <div className="search">
      <PlacesAutocomplete
          value={address}
          onChange={ (address) => {
            setAddress(address);
          }}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
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
  )
}

export default Search;