import GridLayout from "react-grid-layout";

function App() {
  const layout = [
    { i: "map", x: 0, y: 0, w: 3, h: 2, static: true },
    { i: "itinerary", x: 4, y: 0, w: 4, h: 2, static: true },
    { i: "chatbot", x: 8, y: 0, w: 4, h: 2, static: true },
  ];

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
        <div key="itinerary">itinerary</div>
        <div key="chatbot">chatbot</div>
      </GridLayout>
    </div>
  );
}

export default App;
