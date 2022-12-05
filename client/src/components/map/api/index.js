import axios from "axios";
const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary';


export const getPlacesData = async (sw, ne) => {
  try { 
    console.log("sw " + sw);
    console.log("ne " + ne);
    const placesData = await axios.get(URL, {
      params: {
        bl_latitude: sw.lat(),
        tr_latitude: ne.lat(),
        bl_longitude: sw.lng(),
        tr_longitude: ne.lng(),
      },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_X_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
      }
    });
    return placesData;
  } catch (e) {
    console.log(e);
  }
}