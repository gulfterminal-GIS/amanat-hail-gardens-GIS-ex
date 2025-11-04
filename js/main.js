// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

import { CONFIG } from "./core/config.js";
import { StateManager } from "./core/state-manager.js";
import { NotificationManager } from "./ui/notification-manager.js";
import { MapInitializer } from "./core/map-initializer.js";
import { PanelManager } from "./ui/panel-manager.js";
import { ToolbarManager } from "./ui/toolbar-manager.js";
import { TabSystem } from "./ui/tab-system.js";
import { SearchManager } from "./ui/search-manager.js";
import { LayerManager } from "./layers/layer-manager.js";
import { UploadHandler } from "./layers/upload-handler.js";
import { BasemapManager } from "./layers/basemap-manager.js";
import { DrawingManager } from "./tools/drawing-manager.js";
import { AnalysisManager } from "./tools/analysis-manager.js";
import { MeasurementManager } from "./tools/measurement-manager.js";
import { VisualizationManager } from "./tools/visualization-manager.js";
import { bindWindowFunctions } from "./window-bindings.js";
import { initializeMap } from "../script.js";

// Make CONFIG available globally for backward compatibility
window.CONFIG = CONFIG;

// Create global StateManager instance
const stateManager = new StateManager();

// Create NotificationManager instance (FOUNDATION MODULE - used by all)
const notificationManager = new NotificationManager();

// Create MapInitializer instance
const mapInitializer = new MapInitializer(stateManager, notificationManager, CONFIG);

// Create BasemapManager instance (needed by PanelManager)
const basemapManager = new BasemapManager(stateManager, notificationManager);

// Create PanelManager instance
const panelManager = new PanelManager(stateManager, notificationManager, basemapManager);

// Create DrawingManager instance
const drawingManager = new DrawingManager(stateManager, notificationManager);

// Create ToolbarManager instance
const toolbarManager = new ToolbarManager(stateManager, panelManager, notificationManager, drawingManager);

// Create TabSystem instance
const tabSystem = new TabSystem(notificationManager);

// Create SearchManager instance
const searchManager = new SearchManager(stateManager, notificationManager);

// Create LayerManager instance
const layerManager = new LayerManager(stateManager, notificationManager);

// Create AnalysisManager instance (depends on DrawingManager)
const analysisManager = new AnalysisManager(stateManager, notificationManager, layerManager, drawingManager);

// Create MeasurementManager instance (depends on PanelManager and DrawingManager)
const measurementManager = new MeasurementManager(stateManager, notificationManager, panelManager, drawingManager);

// Create VisualizationManager instance
const visualizationManager = new VisualizationManager(stateManager, notificationManager, layerManager);

// Create UploadHandler instance
const uploadHandler = new UploadHandler(stateManager, layerManager, notificationManager);


// Initialize application
async function initializeApplication() {
  try {
    console.log("Starting GIS application initialization...");
    console.log("StateManager created and ready");
    console.log("NotificationManager created and ready");
    console.log("MapInitializer created and ready");
    console.log("PanelManager created and ready");
    console.log("ToolbarManager created and ready");
    console.log("TabSystem created and ready");
    console.log("SearchManager created and ready");
    console.log("LayerManager created and ready");
    console.log("UploadHandler created and ready");
    console.log("BasemapManager created and ready");
    console.log("DrawingManager created and ready");
    console.log("AnalysisManager created and ready");
    console.log("MeasurementManager created and ready");
    console.log("VisualizationManager created and ready");

    // Initialize the map with injected dependencies
    await initializeMap(
      stateManager,
      mapInitializer,
      notificationManager,
      panelManager,
      toolbarManager,
      layerManager,
      uploadHandler,
      basemapManager,
      drawingManager,
      analysisManager,
      measurementManager,
      visualizationManager
    );

    // Initialize tab system
    tabSystem.initializeMapTabs();

    // Initialize search functionality
    await searchManager.initialize();

    // Bind window functions for HTML event handlers (CRITICAL for inline onclick, onchange, etc.)
    bindWindowFunctions({
      stateManager,
      notificationManager,
      mapInitializer,
      panelManager,
      toolbarManager,
      tabSystem,
      searchManager,
      layerManager,
      uploadHandler,
      basemapManager,
      drawingManager,
      analysisManager,
      measurementManager,
      visualizationManager,
      // Future managers will be added here as they're created
    });

    console.log("Application initialized successfully");
    console.log("State snapshot:", stateManager.getStateSnapshot());
  } catch (error) {
    console.error("Failed to initialize application:", error);
    notificationManager.showNotification(
      "Failed to initialize map. Please refresh the page.",
      "error"
    );
  }
}

// Start the application
initializeApplication();
