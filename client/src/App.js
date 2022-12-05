import GridLayout from "react-grid-layout";
import Chatbot from "./components/chatbot/Chatbot";
import tempData from "./shared/temp-data";
import { useState } from "react";
import Itinerary from "./components/itinerary/Itinerary";

function App() {
  const layout = [
    { i: "map", x: 0, y: 0, w: 3, h: 2, static: true },
    { i: "itinerary", x: 4, y: 0, w: 4, h: 2, static: true },
    { i: "chatbot", x: 8, y: 0, w: 4, h: 2, static: true },
  ];

  const [itineraryData, setItineraryData] = useState(tempData);

  return (
    <div className="App">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="map">map</div>
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
