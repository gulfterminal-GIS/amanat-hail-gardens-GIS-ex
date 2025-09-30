// Configuration constants for the GIS application
export const CONFIG = {
  // ArcGIS API Configuration
  ARCGIS_API_KEY: "AAPK67a9b2041fcc449d90ab91d6bae4a156HTaBtzlYSKLe8L-zBuIgrSGvxOopzVQEtdwVrlp6RKN9Rrq_y2qkTax7Do1cHqm9",
  
  // Map Configuration
  DEFAULT_BASEMAP: "hybrid",
  DEFAULT_CENTER: [-95.7129, 37.0902],
  DEFAULT_ZOOM: 4,
  
  // UI Configuration
  HIGHLIGHT_COLOR: "#39ff14",
  
  // Default GeoJSON Layer
  DEFAULT_GEOJSON_URL: "Gardens.geojson",
  
  // Animation and Timing
  COUNTRY_INFO_TIMEOUT: 3000,
  TOUR_INTERVAL: 5000,
  
  // Heatmap Configuration
  HEATMAP_BASE_RADIUS: 20,
  HEATMAP_MIN_ZOOM_FACTOR: 1,
  HEATMAP_MAX_ZOOM_FACTOR: 3,
  HEATMAP_ZOOM_DIVISOR: 10,
  
  // Analysis Configuration
  BUFFER_DEFAULT_DISTANCE: 1000,
  BUFFER_DEFAULT_UNIT: "meters",
  
  // Measurement Configuration
  MEASUREMENT_ZOOM_LEVEL: 16,
  FEATURE_ZOOM_LEVEL: 17,
  FEATURE_TILT: 45,
  
  // Notification Configuration
  NOTIFICATION_DURATION: 5000,
  
  // Table Configuration
  TABLE_PAGE_SIZE: 50,
  
  // Tour Configuration
  TOUR_POPUP_ZOOM: 17
};