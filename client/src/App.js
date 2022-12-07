import GridLayout from "react-grid-layout";
import Chatbot from "./components/chatbot/Chatbot";
import tempData from "./shared/temp-data";
import { useEffect, useState } from "react";
import Itinerary from "./components/itinerary/Itinerary";
import Map from "./components/map/Map";
import initGLMap from "./components/glmap/GLMap";
import { useSelector } from "react-redux";
import { getAllMessages, getActivities, getDate } from "./reducers/messages";

function App() {
  const layout = [
    { i: "map", x: 0, y: 0, w: 4, h: 9, static: true },
    { i: "glmap", x: 0, y: 10, w: 4, h: 1, static: true },
    { i: "itinerary", x: 4, y: 0, w: 4, h: 2, static: true },
    { i: "chatbot", x: 8, y: 0, w: 4, h: 2, static: true },
  ];

  const [itineraryData, setItineraryData] = useState(tempData);

  const activities = useSelector(getActivities);
  const date = useSelector(getDate);
  const messages = useSelector(getAllMessages).messages;

  useEffect(() => {
    console.log(activities);
  }, [activities]);
  useEffect(() => {
    console.log(messages);
    console.log(activities);
    console.log(date);
  }, [messages]);

  return (
    <div className="App">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="map">
          <Map />
        </div>
        <div key="glmap">
          <button
            onClick={() => {
              initGLMap();
            }}
          >
            Show Walkthrough
          </button>
          <p
            style={{
              zIndex: "10",
              position: "absolute",
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: "10px",
            }}
          >
            <strong>Press "m" to start or stop the animation.</strong>
          </p>
          <div id="glmap" style={{ height: "45vh" }}></div>
        </div>
        {/* <div key="map"><Map /></div> */}
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
