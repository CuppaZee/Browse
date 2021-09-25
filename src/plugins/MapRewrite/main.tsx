import React from "react";
import ReactDOM from "react-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { ViewportProps } from "react-map-gl";

export interface MainProps {
}

export function Main(props: MainProps) {
  return (
    <div style={{ height: "100vh" }}>
      <Map />
    </div>
  );
}

function Map() {
  const [viewport, setViewport] = React.useState<ViewportProps>({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <ReactMapGL
      width="100%"
      height="100%"
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1IjoiZnJlZXpldGFnIiwiYSI6ImNqbmtqbThxbTFhdHczdnBhZzl6d2F4aGYifQ.xBXGXzqJkGlIFlkopHmZtw"
      onViewportChange={(nextViewport: ViewportProps) => setViewport(nextViewport)}
    />
  );
}

ReactDOM.render(<Main />, document.getElementById("app"));