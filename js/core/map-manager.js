import { CONFIG } from './config.js';

/**
 * MapManager class handles map initialization and core map functionality
 * Preserves global variables (displayMap, view) for compatibility with existing code
 */
export class MapManager {
  constructor() {
    this.map = null;
    this.view = null;
    this.homeExtent = null;
    this.drawLayer = null;
  }

  /**
   * Initialize the map and view
   * Extracted from the original initializeMap function in script.js
   * Preserves all global variables for compatibility
   */
  async initializeMap() {
    try {
      // Use the loadModule utility function from script.js (window.loadModule)
      const [esriConfig, Map, MapView, GraphicsLayer, reactiveUtils] =
        await Promise.all([
          window.loadModule("esri/config"),
          window.loadModule("esri/Map"),
          window.loadModule("esri/views/MapView"),
          window.loadModule("esri/layers/GraphicsLayer"),
          window.loadModule("esri/core/reactiveUtils"),
        ]);

      // Configure ArcGIS API
      esriConfig.apiKey = CONFIG.ARCGIS_API_KEY;

      // Create map instance
      this.map = new Map({
        basemap: CONFIG.DEFAULT_BASEMAP,
      });

      // Set global variable for compatibility
      window.displayMap = this.map;

      // Create map view
      this.view = new MapView({
        center: CONFIG.DEFAULT_CENTER,
        container: "displayMap",
        map: this.map,
        zoom: CONFIG.DEFAULT_ZOOM,
        highlightOptions: {
          color: CONFIG.HIGHLIGHT_COLOR,
          haloOpacity: 0.9,
          fillOpacity: 0.2,
        },
      });

      // Set global variable for compatibility
      window.view = this.view;

      // Create drawing layer
      this.drawLayer = new GraphicsLayer({
        title: "Drawings",
        listMode: "show",
      });
      this.map.add(this.drawLayer);

      // Set global variable for compatibility
      window.drawLayer = this.drawLayer;

      // Wait for view to be ready
      await this.view.when();

      // Remove default UI components
      this.view.ui.remove(["compass", "zoom"]);

      // Store home extent
      this.homeExtent = this.view.extent.clone();
      window.homeExtent = this.homeExtent;

      // Load default GeoJSON layer (using script.js function)
      await window.loadDefaultGeoJSON();

      // Initialize countries layer for click feature (using script.js function)
      await window.initializeCountriesLayer();

      // Initialize zoom watcher for heatmap using reactiveUtils
      reactiveUtils.watch(
        () => this.view.zoom,
        (zoom) => {
          if (window.heatmapEnabled && window.heatmapLayer) {
            // Adjust radius based on zoom level for better visualization
            const baseRadius = window.currentHeatmapSettings.radius;
            const zoomFactor = Math.max(1, Math.min(3, zoom / 10));

            if (
              window.heatmapLayer.renderer &&
              window.heatmapLayer.renderer.type === "heatmap"
            ) {
              window.heatmapLayer.renderer.radius = baseRadius * zoomFactor;
            }
          }
        }
      );

      // Initialize UI and event handlers (using script.js functions)
      window.initializeUI();
      window.initializeEventHandlers();

      // Loading screen logic
      const loadingScreen = document.getElementById("loadingScreen");
      let loadingContent = document.querySelector(".loading-content");

      function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      console.log("Starting loading sequence...");
      wait(0)
        .then(() => {
          loadingContent.innerHTML = `
            <img class="loaded-gif" src="images/map-loading.gif" alt="">
            <div class="loading-text">جاري مسح الخريطة...</div>
          `;
          return wait(3000);
        })
        .finally(() => {
          loadingScreen.classList.add("fade-out");
        });

      // Check if it's the first visit and start tour
      const hasSeenTour = localStorage.getItem("gisStudioTourCompleted");
      if (!hasSeenTour) {
        // Start tour after a short delay (using script.js function)
        setTimeout(() => {
          window.startAppTour();
          // Mark tour as seen
          localStorage.setItem("gisStudioTourCompleted", "true");
        }, 1500);
      }

      console.log("Map initialized successfully", this.map, this.view);
      return [this.view, this.map];
    } catch (error) {
      console.error("Error initializing map:", error);
      throw error;
    }
  }

  /**
   * Get the map instance
   */
  getMap() {
    return this.map;
  }

  /**
   * Get the view instance
   */
  getView() {
    return this.view;
  }

  /**
   * Get the home extent
   */
  getHomeExtent() {
    return this.homeExtent;
  }

  /**
   * Get the drawing layer
   */
  getDrawLayer() {
    return this.drawLayer;
  }

  /**
   * Add a layer to the map
   */
  addLayer(layer) {
    if (this.map) {
      this.map.add(layer);
    }
  }

  /**
   * Remove a layer from the map
   */
  removeLayer(layer) {
    if (this.map) {
      this.map.remove(layer);
    }
  }
}