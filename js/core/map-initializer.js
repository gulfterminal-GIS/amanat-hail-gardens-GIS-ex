/**
 * MapInitializer - Handles map setup, loading screen, and initial layer loading
 * Dependencies: StateManager, NotificationManager, module-loader
 */

import { loadModule } from "./module-loader.js";
import { CONFIG } from "./config.js";

export class MapInitializer {
  constructor(stateManager, notificationManager, tourManager = null, layerManager = null, classificationManager = null, visualizationManager = null, widgetManager = null) {
    this.stateManager = stateManager;
    this.notificationManager = notificationManager;
    this.tourManager = tourManager;
    this.layerManager = layerManager;
    this.classificationManager = classificationManager;
    this.visualizationManager = visualizationManager;
    this.widgetManager = widgetManager;
  }

  /**
   * Initialize the ArcGIS map and view
   * @returns {Promise<Array>} [view, map]
   */
  async initializeMap() {
    try {
      const [esriConfig, Map, MapView, GraphicsLayer, reactiveUtils] =
        await Promise.all([
          loadModule("esri/config"),
          loadModule("esri/Map"),
          loadModule("esri/views/MapView"),
          loadModule("esri/layers/GraphicsLayer"),
          loadModule("esri/core/reactiveUtils"),
        ]);

      esriConfig.apiKey = CONFIG.ARCGIS_API_KEY;

      const displayMap = new Map({
        basemap: CONFIG.DEFAULT_BASEMAP || "hybrid",
      });

      const view = new MapView({
        center: CONFIG.DEFAULT_CENTER || [-95.7129, 37.0902],
        container: "displayMap",
        map: displayMap,
        zoom: CONFIG.DEFAULT_ZOOM || 4,
        highlightOptions: {
          color: "#39ff14",
          haloOpacity: 0.9,
          fillOpacity: 0.2,
        },
      });

      const drawLayer = new GraphicsLayer({
        title: "Drawings",
        listMode: "show",
      });
      displayMap.add(drawLayer);

      await view.when();

      view.ui.remove(["compass", "zoom"]);

      // Store home extent
      const homeExtent = view.extent.clone();

      // Store in StateManager (single source of truth)
      this.stateManager.setMap(displayMap);
      this.stateManager.setView(view);
      this.stateManager.setDrawLayer(drawLayer);
      this.stateManager.setHomeExtent(homeExtent);
      
      // StateManager automatically syncs to window globals for backward compatibility
      // This allows old code to still work during the transition

      // Load default GeoJSON layer
      await this.loadDefaultGeoJSON(displayMap, view);

      // Initialize countries layer for click feature
      await this.initializeCountriesLayer(displayMap);

      // Initialize zoom watcher for heatmap using reactiveUtils
      reactiveUtils.watch(
        () => view.zoom,
        (zoom) => {
          if (this.visualizationManager && this.visualizationManager.isHeatmapEnabled()) {
            const heatmapLayer = this.visualizationManager.getHeatmapLayer();
            if (heatmapLayer) {
              // Adjust radius based on zoom level for better visualization
              const currentSettings = this.visualizationManager.getCurrentHeatmapSettings();
              const baseRadius = currentSettings.radius;
              const zoomFactor = Math.max(1, Math.min(3, zoom / 10));

              if (
                heatmapLayer.renderer &&
                heatmapLayer.renderer.type === "heatmap"
              ) {
                heatmapLayer.renderer.radius = baseRadius * zoomFactor;
              }
            }
          }
        }
      );

      // Note: UI initialization and event handlers are now handled by individual managers in main.js

      // Handle loading screen
      this.handleLoadingScreen();

      // Check if it's the first visit and start tour
      const hasSeenTour = localStorage.getItem("gisStudioTourCompleted");
      if (!hasSeenTour && this.tourManager) {
        // Start tour after a short delay
        setTimeout(() => {
          this.tourManager.startAppTour();
          // Mark tour as seen
          localStorage.setItem("gisStudioTourCompleted", "true");
        }, 1500);
      }

      console.log("Map initialized successfully", displayMap, view);
      return [view, displayMap];
    } catch (error) {
      console.error("Error initializing map:", error);
      throw error;
    }
  }

  /**
   * Load the default GeoJSON layer
   */
  async loadDefaultGeoJSON(displayMap, view) {
    try {
      const [GeoJSONLayer] = await Promise.all([
        loadModule("esri/layers/GeoJSONLayer"),
      ]);

      // Create the GeoJSON layer
      const geojsonLayer = new GeoJSONLayer({
        url: "Gardens.geojson",
        title: "حدائق حائل",
        outFields: ["*"],
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [34, 139, 34, 0.4], // Forest green with transparency
            outline: {
              color: [0, 100, 0, 1], // Dark green outline
              width: 2,
            },
          },
        },
      });

      // Add to map
      displayMap.add(geojsonLayer);

      // Add to uploaded layers array via StateManager
      this.stateManager.addUploadedLayer(geojsonLayer);

      // Store for tour via StateManager
      this.stateManager.setTourLayer(geojsonLayer);

      // Wait for layer to load
      await geojsonLayer.load();

      // Zoom to the layer extent
      if (geojsonLayer.fullExtent) {
        await view.goTo(geojsonLayer.fullExtent.expand(1.1));
      }

      // Update layer list UI
      if (this.layerManager) {
        this.layerManager.updateLayerList();
      }

      // Setup feature tour after layer loads
      if (this.tourManager) {
        await this.tourManager.setupFeatureTour(geojsonLayer);
      }

      console.log("Default GeoJSON layer loaded successfully");

      // Apply classification automatically on GARDENSTATUS
      if (this.classificationManager) {
        await this.classificationManager.autoApplyDefaultClassification(geojsonLayer, "GARDENSTATUS");
      }
    } catch (error) {
      console.error("Error loading default GeoJSON:", error);
      // Don't show error to user since this is a default layer
    }
  }

  /**
   * Initialize countries layer for click info display
   */
  async initializeCountriesLayer(displayMap) {
    try {
      const [FeatureLayer, GraphicsLayer] = await Promise.all([
        loadModule("esri/layers/FeatureLayer"),
        loadModule("esri/layers/GraphicsLayer"),
      ]);

      // Create graphics layer for flash animation
      const flashGraphicsLayer = new GraphicsLayer({
        title: "Flash Animation",
        listMode: "hide",
      });
      displayMap.add(flashGraphicsLayer);

      // Create countries layer but don't display it (only for queries)
      const countriesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
        visible: false, // Hidden layer, only for queries
      });

      displayMap.add(countriesLayer);

      // Store in StateManager (single source of truth)
      this.stateManager.setFlashGraphicsLayer(flashGraphicsLayer);
      this.stateManager.setCountriesLayer(countriesLayer);
    } catch (error) {
      console.error("Error loading countries layer:", error);
    }
  }

  /**
   * Handle the loading screen animation
   */
  handleLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingContent = document.querySelector(".loading-content");

    if (!loadingScreen || !loadingContent) {
      console.warn("Loading screen elements not found");
      return;
    }

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
        if (this.widgetManager) {
          this.widgetManager.toggleWidget("legend");
        }
      });
  }

  /**
   * Show the loading screen
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.classList.remove("fade-out");
      loadingScreen.style.display = "flex";
    }
  }

  /**
   * Hide the loading screen
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.classList.add("fade-out");
    }
  }
}
