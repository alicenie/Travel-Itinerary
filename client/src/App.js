import GridLayout from "react-grid-layout";
import Chatbot from "./components/chatbot/Chatbot";
import tempData from "./shared/temp-data";
import { useEffect, useState } from "react";
import Itinerary from "./components/itinerary/Itinerary";
import Map from "./components/map/Map";
import initGLMap from "./components/glmap/GLMap";
import { useSelector } from "react-redux";
import { getAllMessages, getActivities, getDate } from "./reducers/messages";
import { useLoadScript } from "@react-google-maps/api";
import Controls from "./shared/images/controls.png";
import "./App.css";

const libraries = ["places"];

function App() {
  const layout = [
    { i: "map", x: 0, y: 0, w: 4, h: 9, static: true },
    { i: "glmap", x: 0, y: 9, w: 4, h: 1, static: true },
    { i: "itinerary", x: 4, y: 0, w: 4, h: 2, static: true },
    { i: "chatbot", x: 8, y: 0, w: 4, h: 2, static: true },
  ];
  const activities = useSelector(getActivities);
  const date = useSelector(getDate);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const initItineraryData = {
    events: {},
    columns: {
      "column-1": {
        id: "column-1",
        title: "",
        eventIds: [],
      },
    },
    columnOrder: ["column-1"],
  };
  const [itineraryData, setItineraryData] = useState(initItineraryData);
  const [showInstructions, setShowInstructions] = useState("none");
  useEffect(() => {
    console.log(activities);
    console.log(date);

    // update itinerary data
    if (date !== "" && activities.length > 0) {
      // only update after latlng is updated
      if (activities[activities.length - 1].latLng) {
        let newItineraryData = { ...itineraryData };

        let index = itineraryData.columns["column-1"].eventIds.length + 1;
        newItineraryData.events[`event-${index}`] = {
          id: `event-${index}`,
          duration: activities[activities.length - 1].duration,
          content: activities[activities.length - 1].location,
        };
        newItineraryData.columns["column-1"].eventIds.push(`event-${index}`);
        newItineraryData.columns["column-1"].title = date;
        setItineraryData(newItineraryData);
      }
    }
  }, [activities, date]);

  if (loadError) return "Error loading Google Maps";
  if (!isLoaded) return "Loading Google Maps...";

  return (
    <div className="App">
      <div className="header">Travel Itinerary U Illustrate</div>
      <GridLayout
        className="layout"
        layout={layout}
        margin={[15, 10]}
        cols={12}
        rowHeight={30}
        width={window.innerWidth}
      >
        <div key="map">
          <Map />
        </div>
        <div key="glmap">
          {/* <button
          {/* <button
            onClick={() => {
              initGLMap();
            }}
          >
            Show Walkthrough
          </button> */}

          <button
            className="instructions"
            onClick={() => {
              showInstructions === "none"
                ? setShowInstructions("block")
                : setShowInstructions("none");
            }}
          >
            ?
          </button>
          <div style={{ display: showInstructions }}>
            <div className="instruction-box">
              <strong>Press "m" to start or stop the animation.</strong>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={Controls}
                  style={{
                    height: "60px",
                    width: "60px",
                  }}
                />
                <p
                  style={{
                    paddingLeft: "10px",
                  }}
                >
                  <strong>to move around.</strong>
                </p>
              </div>
            </div>
          </div>
          <div
            id="glmap"
            style={{
              height: "45vh",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                position: "absolute",
                padding: "10px",
                top: "15vh",
              }}
            >
              <strong>
                Interact with the Chatbot to experience a virtual trip.
              </strong>
            </p>
          </div>
        </div>
        <div key="itinerary">
          <Itinerary
            itineraryData={itineraryData}
            setItineraryData={setItineraryData}
          />
        </div>
        <div key="chatbot">
          <Chatbot />
        </div>
      </GridLayout>
    </div>
  );
}

export default App;
