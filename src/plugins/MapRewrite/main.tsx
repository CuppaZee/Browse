import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, {
  ViewportProps,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  AttributionControl,
  WebMercatorViewport,
  Source,
  Layer,
  MapContext,
} from "react-map-gl";
import useMunzeeRequest from "./hooks/useMunzeeRequest";
import { MapBoundingboxV4 } from "@cuppazee/api/map/v4";
import { QueryClient, QueryClientProvider } from "react-query";

document.addEventListener("securitypolicyviolation", e => {
  console.log(e.blockedURI);
  console.log(e.violatedDirective);
  console.log(e.originalPolicy);
});

export interface MainProps {}

const queryClient = new QueryClient();

export function Main(props: MainProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ height: "100vh" }}>
        <Map />
      </div>
    </QueryClientProvider>
  );
}

export interface HashData {
  mapToken: string;
  coords: {
    lat: string;
    lng: string;
  };
}

export interface IconsProps {
  icons: Set<string>;
}

export function Icons(props: IconsProps) {
  const context = React.useContext(MapContext);
  React.useEffect(() => {
    for (const icon of props.icons) {
      if (!context.map.hasImage(icon)) {
        context.map.loadImage(
          `https://images.cuppazee.app/types/64/${encodeURIComponent(icon)}.png`,
          (error: any, image: any) => {
            if (error) return;
            context.map.addImage(icon, image);
          }
        );
      }
    }
  }, [[...props.icons].join(",")]);
  return null;
}

function Map() {
  const hashData = useMemo(
    () => JSON.parse(decodeURIComponent(window.location.hash.slice(1))) as HashData,
    []
  );
  const [viewport, setViewport] = React.useState<ViewportProps>({
    latitude: Number(hashData.coords.lat),
    longitude: Number(hashData.coords.lng),
    zoom: 16,
  });
  const [location, setLocation] =
    React.useState<MapBoundingboxV4["request"]["params"]["points"]["main"]>();
  const timeout = React.useRef<any>();

  const [satellite, _setSatellite] = useState(false);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const bounds = new WebMercatorViewport(viewport as any).getBounds();
      setLocation({
        lat1: bounds[0][1],
        lat2: bounds[1][1],
        lng1: bounds[0][0],
        lng2: bounds[1][0],
      });
    }, 200);
  }, [viewport]);

  const types = useMunzeeRequest<any>("map/filters/v4", {});
  const pois: { id: string; image: string; name: string }[] | undefined | null = (types.data as any)
    ?.data[2].subcategories.Places.filters;

  const data = useMunzeeRequest(
    "map/boundingbox/v4",
    {
      filters: "13,14," + pois?.map(i => i.id).join(","),
      points: location
        ? {
            main: location,
          }
        : {},
      fields: "latitude,longitude,munzee_id,friendly_name,original_pin_image",
    },
    undefined,
    { keepPreviousData: true, enabled: !!pois && !!location }
  );

  const munzees = data.data?.data?.[0]?.munzees;

  console.log(munzees);

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <div style={{ flex: 3 }}>
        <ReactMapGL
          width="100%"
          height="100%"
          {...viewport}
          attributionControl={false}
          mapStyle={
            satellite
              ? "mapbox://styles/mapbox/satellite-streets-v9"
              : "mapbox://styles/mapbox/streets-v11"
          }
          mapboxApiAccessToken="pk.eyJ1IjoiZnJlZXpldGFnIiwiYSI6ImNqbmtqbThxbTFhdHczdnBhZzl6d2F4aGYifQ.xBXGXzqJkGlIFlkopHmZtw"
          onViewportChange={(nextViewport: ViewportProps) => setViewport(nextViewport)}>
          <GeolocateControl style={{ top: 8, right: 8 }} />
          <NavigationControl style={{ top: 48, right: 8 }} />
          <ScaleControl style={{ bottom: 20, right: 0 }} />
          <AttributionControl
            customAttribution="Powered by CuppaZee Browse"
            style={{
              bottom: 0,
              right: 0,
              fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
              fontSize: 14,
              lineHeight: 20 / 14,
            }}
          />
          <Icons icons={new Set(munzees?.map(i => i.original_pin_image ?? ""))} />
          <Source
            type="geojson"
            id="munzees"
            data={{
              type: "FeatureCollection",
              features:
                munzees?.map(munzee => ({
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [Number(munzee.longitude), Number(munzee.latitude)],
                  },
                  properties: {
                    icon: munzee.original_pin_image,
                  },
                })) ?? [],
            }}>
            <Layer
              id="munzee_icon"
              type="symbol"
              paint={{}}
              layout={{
                "icon-image": ["get", "icon"],
                "icon-anchor": "bottom",
                "icon-size": 0.6,
                "icon-allow-overlap": true,
              }}
            />
          </Source>
        </ReactMapGL>
      </div>
      <div style={{ flex: 1 }}>Sidebar</div>
    </div>
  );
}

ReactDOM.render(<Main />, document.getElementById("app"));
