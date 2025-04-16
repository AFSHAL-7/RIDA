
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Sample accident data for demonstration
const SAMPLE_ACCIDENTS = [
  { id: 1, lat: 40.7128, lng: -74.006, severity: "high", date: "2023-11-10", type: "collision", casualties: 2 },
  { id: 2, lat: 40.7178, lng: -73.996, severity: "medium", date: "2023-11-08", type: "pedestrian", casualties: 0 },
  { id: 3, lat: 40.7148, lng: -74.016, severity: "low", date: "2023-11-05", type: "single-vehicle", casualties: 0 },
  { id: 4, lat: 40.7118, lng: -74.026, severity: "high", date: "2023-11-01", type: "collision", casualties: 1 },
  { id: 5, lat: 40.7138, lng: -74.036, severity: "medium", date: "2023-10-28", type: "pedestrian", casualties: 0 },
  { id: 6, lat: 34.0522, lng: -118.2437, severity: "high", date: "2023-11-12", type: "collision", casualties: 3 },
  { id: 7, lat: 34.0502, lng: -118.2517, severity: "medium", date: "2023-11-09", type: "pedestrian", casualties: 1 },
  { id: 8, lat: 34.0532, lng: -118.2337, severity: "low", date: "2023-11-07", type: "single-vehicle", casualties: 0 },
  { id: 9, lat: 41.8781, lng: -87.6298, severity: "high", date: "2023-11-11", type: "collision", casualties: 2 },
  { id: 10, lat: 41.8791, lng: -87.6318, severity: "medium", date: "2023-11-06", type: "pedestrian", casualties: 0 },
  { id: 11, lat: 41.8771, lng: -87.6278, severity: "low", date: "2023-11-03", type: "single-vehicle", casualties: 0 },
  { id: 12, lat: 37.7749, lng: -122.4194, severity: "high", date: "2023-11-10", type: "collision", casualties: 1 },
  { id: 13, lat: 37.7759, lng: -122.4184, severity: "medium", date: "2023-11-08", type: "pedestrian", casualties: 1 },
  { id: 14, lat: 37.7739, lng: -122.4204, severity: "low", date: "2023-11-04", type: "single-vehicle", casualties: 0 },
];

type MapViewType = "points" | "heatmap" | "clusters";

export default function AccidentMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapView, setMapView] = useState<MapViewType>("points");
  const [filter, setFilter] = useState("all");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");

  // Check for a saved token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("mapbox_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || map.current || !token) return;
    
    // Validate token format
    if (!token.startsWith('pk.')) {
      setTokenError("Invalid token format. MapBox public tokens must start with 'pk.'");
      setToken("");
      localStorage.removeItem("mapbox_token");
      return;
    }

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });

      map.current.on("load", () => {
        setMapLoaded(true);
        
        // Add a source for accident data
        map.current?.addSource("accidents", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: SAMPLE_ACCIDENTS.map(accident => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [accident.lng, accident.lat]
              },
              properties: {
                id: accident.id,
                severity: accident.severity,
                date: accident.date,
                type: accident.type,
                casualties: accident.casualties
              }
            }))
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
        
        // Add a layer for individual points
        map.current?.addLayer({
          id: "accident-points",
          type: "circle",
          source: "accidents",
          filter: ["!=", ["get", "cluster"], true],
          paint: {
            "circle-color": [
              "match",
              ["get", "severity"],
              "high", "#c30000",
              "medium", "#ffaf00",
              "low", "#009bb2",
              "#009bb2"
            ],
            "circle-radius": 8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        });
        
        // Add a layer for clusters
        map.current?.addLayer({
          id: "clusters",
          type: "circle",
          source: "accidents",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#009bb2",
              4,
              "#ffaf00",
              10,
              "#c30000"
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              4,
              20,
              10,
              30
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        });
        
        // Add a layer for cluster counts
        map.current?.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "accidents",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
          },
          paint: {
            "text-color": "#ffffff"
          }
        });
        
        // Add a heatmap layer
        map.current?.addLayer({
          id: "accidents-heat",
          type: "heatmap",
          source: "accidents",
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'casualties'],
              0, 0.5,
              3, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 155, 178, 0)',
              0.2, 'rgba(0, 155, 178, 0.5)',
              0.4, 'rgba(255, 175, 0, 0.5)',
              0.6, 'rgba(255, 175, 0, 0.8)',
              0.8, 'rgba(195, 0, 0, 0.8)',
              1, 'rgba(195, 0, 0, 1)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20
            ],
            'heatmap-opacity': 0.8
          },
          layout: {
            visibility: 'none'
          }
        });
        
        // Add click events for popups
        map.current?.on("click", "accident-points", (e) => {
          if (!e.features || !e.features[0]) return;
          
          const coordinates = e.features[0].geometry.type === "Point" 
            ? (e.features[0].geometry as any).coordinates.slice()
            : null;
            
          if (!coordinates) return;
          
          const properties = e.features[0].properties;
          if (!properties) return;
          
          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold">Accident #${properties.id}</h3>
              <div class="text-sm mt-1">
                <p><strong>Date:</strong> ${properties.date}</p>
                <p><strong>Type:</strong> ${properties.type}</p>
                <p><strong>Severity:</strong> ${properties.severity}</p>
                <p><strong>Casualties:</strong> ${properties.casualties}</p>
              </div>
            </div>
          `;
          
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map.current as mapboxgl.Map);
        });
        
        // Change cursor on hover
        map.current?.on("mouseenter", "accident-points", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        
        map.current?.on("mouseleave", "accident-points", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
        
        // Click event for clusters
        map.current?.on("click", "clusters", (e) => {
          if (!e.features || !e.features[0]) return;
          
          const features = map.current?.queryRenderedFeatures(e.point, {
            layers: ["clusters"]
          });
          
          if (!features || !features[0] || !features[0].properties) return;
          
          const clusterId = features[0].properties.cluster_id;
          const source = map.current?.getSource("accidents") as mapboxgl.GeoJSONSource;
          
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !e.features || !e.features[0]) return;
            
            const coordinates = e.features[0].geometry.type === "Point" 
              ? (e.features[0].geometry as any).coordinates
              : null;
              
            if (!coordinates) return;
            
            map.current?.easeTo({
              center: coordinates,
              zoom: zoom ? zoom + 1 : 14
            });
          });
        });
        
        map.current?.on("mouseenter", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        
        map.current?.on("mouseleave", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
        
        // Update visibility based on initial mapView
        updateMapViewLayers(mapView);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setTokenError("Failed to initialize map. Please check your token.");
      setToken("");
      localStorage.removeItem("mapbox_token");
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [token, mapView]);

  // Handle map view type changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    updateMapViewLayers(mapView);
  }, [mapView, mapLoaded]);

  // Handle filter changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    if (filter === "all") {
      map.current.setFilter("accident-points", ["!=", ["get", "cluster"], true]);
    } else {
      map.current.setFilter("accident-points", [
        "all",
        ["!=", ["get", "cluster"], true],
        ["==", ["get", "severity"], filter]
      ]);
    }
  }, [filter, mapLoaded]);

  // Update layer visibility based on map view type
  function updateMapViewLayers(viewType: MapViewType) {
    if (!map.current) return;
    
    // Hide all layers first
    map.current.setLayoutProperty("accident-points", "visibility", "none");
    map.current.setLayoutProperty("clusters", "visibility", "none");
    map.current.setLayoutProperty("cluster-count", "visibility", "none");
    map.current.setLayoutProperty("accidents-heat", "visibility", "none");
    
    // Show only the relevant layers
    switch (viewType) {
      case "points":
        map.current.setLayoutProperty("accident-points", "visibility", "visible");
        break;
      case "clusters":
        map.current.setLayoutProperty("clusters", "visibility", "visible");
        map.current.setLayoutProperty("cluster-count", "visibility", "visible");
        break;
      case "heatmap":
        map.current.setLayoutProperty("accidents-heat", "visibility", "visible");
        break;
    }
  }

  // Save MapBox token to localStorage
  const handleSaveToken = () => {
    if (!tokenInput) {
      toast.error("Please enter a MapBox token");
      return;
    }
    
    if (!tokenInput.startsWith('pk.')) {
      toast.error("Invalid token format. MapBox public tokens must start with 'pk.'");
      return;
    }
    
    localStorage.setItem("mapbox_token", tokenInput);
    setToken(tokenInput);
    setTokenError("");
    toast.success("MapBox token saved successfully");
  };

  const handleClearToken = () => {
    localStorage.removeItem("mapbox_token");
    setToken("");
    setTokenInput("");
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setMapLoaded(false);
    toast.info("MapBox token cleared");
  };

  return (
    <Card className="w-full">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Accident Map</h2>
            <p className="text-muted-foreground text-sm">
              Interactive visualization of accident data
            </p>
          </div>
          
          {token && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="filter">Filter Severity:</Label>
                <Select
                  value={filter}
                  onValueChange={setFilter}
                >
                  <SelectTrigger id="filter" className="w-[140px]">
                    <SelectValue placeholder="Severity filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-danger-500"></span> High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-warning-500"></span> Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-safety-500"></span> Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {token ? (
        <Tabs defaultValue="points" value={mapView} onValueChange={(value) => setMapView(value as MapViewType)} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="points">Individual Points</TabsTrigger>
              <TabsTrigger value="clusters">Clusters</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="points" className="p-0 mt-0">
            <div className="p-4 h-[600px] relative">
              <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
            </div>
          </TabsContent>
          
          <TabsContent value="clusters" className="p-0 mt-0">
            <div className="p-4 h-[600px] relative">
              <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
            </div>
          </TabsContent>
          
          <TabsContent value="heatmap" className="p-0 mt-0">
            <div className="p-4 h-[600px] relative">
              <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-medium mb-2">MapBox Token Required</h3>
            <p className="text-muted-foreground mb-6">
              To use the interactive map, please enter your MapBox public access token (starts with "pk.").
            </p>
            {tokenError && (
              <div className="bg-destructive/10 text-destructive p-4 mb-6 rounded-md">
                {tokenError}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter MapBox token (pk.*)"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleSaveToken}>
                  Save Token
                </Button>
                {localStorage.getItem("mapbox_token") && (
                  <Button variant="outline" onClick={handleClearToken}>
                    Clear Saved Token
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Get your free token at <a href="https://mapbox.com/" target="_blank" rel="noreferrer" className="underline">MapBox.com</a>
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> MapBox requires a token that starts with "pk." (public token).
              </p>
            </div>
          </div>
        </div>
      )}
      
      {token && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing accident data visualization
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-safety-500 text-safety-foreground">Low severity</Badge>
              <Badge variant="outline" className="bg-warning-500 text-warning-foreground">Medium severity</Badge>
              <Badge variant="outline" className="bg-danger-500 text-danger-foreground">High severity</Badge>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleClearToken}>
              Change MapBox Token
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

