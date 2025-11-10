// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

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
import { SwipeManager } from "./tools/swipe-manager.js";
import { PopupManager } from "./features/popup-manager.js";
import { AttributeTable } from "./features/attribute-table.js";
import { ClassificationManager } from "./features/classification-manager.js";
import { TourManager } from "./features/tour-manager.js";
import { CountryInfo } from "./features/country-info.js";
import { MapEventHandler } from "./events/map-event-handler.js";
import { CoordinateDisplay } from "./events/coordinate-display.js";
import { WindowEventHandler } from "./events/window-event-handler.js";
import { WidgetManager } from "./widgets/widget-manager.js";
import { bindWindowFunctions } from "./window-bindings.js";
import "./ui/liquid-glass-effect.js"; // Custom element auto-registers

// Create global StateManager instance
const stateManager = new StateManager();

// Create NotificationManager instance (FOUNDATION MODULE - used by all)
const notificationManager = new NotificationManager();

// Create LayerManager instance (needed by MapInitializer and VisualizationManager)
const layerManager = new LayerManager(stateManager, notificationManager);

// Create BasemapManager instance (needed by PanelManager)
const basemapManager = new BasemapManager(stateManager, notificationManager);

// Create DrawingManager instance
const drawingManager = new DrawingManager(stateManager, notificationManager);

// Create PopupManager instance (needed by TourManager and ClassificationManager)
const popupManager = new PopupManager(stateManager, notificationManager);

// Create ClassificationManager instance (needed by PanelManager and MapInitializer)
// Note: PanelManager reference will be set after PanelManager is created
const classificationManager = new ClassificationManager(stateManager, notificationManager, null, popupManager);

// Create PanelManager instance
const panelManager = new PanelManager(stateManager, notificationManager, basemapManager, classificationManager);

// Set PanelManager reference in ClassificationManager
classificationManager.panelManager = panelManager;

// Create TourManager instance (needed by MapInitializer)
const tourManager = new TourManager(stateManager, notificationManager, popupManager);

// Create CountryInfo instance
const countryInfo = new CountryInfo(stateManager, notificationManager);

// Create VisualizationManager instance (needed by MapInitializer and LayerManager)
const visualizationManager = new VisualizationManager(stateManager, notificationManager, layerManager);

// Create WidgetManager instance (needed by MapInitializer)
const widgetManager = new WidgetManager(stateManager, notificationManager, panelManager, drawingManager, popupManager);

// Create MapInitializer instance
const mapInitializer = new MapInitializer(stateManager, notificationManager, tourManager, layerManager, classificationManager, visualizationManager, widgetManager);

// Create MeasurementManager instance (depends on PanelManager and DrawingManager)
const measurementManager = new MeasurementManager(stateManager, notificationManager, panelManager, drawingManager);

// Create ToolbarManager instance
const toolbarManager = new ToolbarManager(stateManager, panelManager, notificationManager, drawingManager, measurementManager);

// Create TabSystem instance
const tabSystem = new TabSystem(notificationManager);

// Create SearchManager instance
const searchManager = new SearchManager(stateManager, notificationManager);

// Create AnalysisManager instance (depends on DrawingManager)
const analysisManager = new AnalysisManager(stateManager, notificationManager, layerManager, drawingManager);

// Create SwipeManager instance
const swipeManager = new SwipeManager(stateManager, notificationManager, panelManager);

// Set SwipeManager reference in PanelManager for panel initialization
panelManager.setSwipeManager(swipeManager);

// Set SwipeManager reference in DrawingManager for clearAll functionality
drawingManager.setSwipeManager(swipeManager);

// Set AnalysisManager reference in SwipeManager for accessing analysis layer
swipeManager.setAnalysisManager(analysisManager);

// Create AttributeTable instance
const attributeTable = new AttributeTable(stateManager, notificationManager, popupManager);

// Create UploadHandler instance
const uploadHandler = new UploadHandler(stateManager, layerManager, notificationManager);

// Create MapEventHandler instance (depends on PopupManager and CountryInfo)
const mapEventHandler = new MapEventHandler(stateManager, popupManager, countryInfo);

// Create CoordinateDisplay instance
const coordinateDisplay = new CoordinateDisplay(stateManager, notificationManager);

// Create WindowEventHandler instance
const windowEventHandler = new WindowEventHandler(popupManager, panelManager);


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
    console.log("SwipeManager created and ready");
    console.log("PopupManager created and ready");
    console.log("AttributeTable created and ready");
    console.log("ClassificationManager created and ready");
    console.log("TourManager created and ready");
    console.log("CountryInfo created and ready");
    console.log("MapEventHandler created and ready");
    console.log("CoordinateDisplay created and ready");
    console.log("WindowEventHandler created and ready");
    console.log("WidgetManager created and ready");

    // Initialize the map (mimics script.js initializeMap flow)
    await mapInitializer.initializeMap();

    // Initialize toolbar after map is ready (from script.js)
    if (toolbarManager) {
      console.log("Initializing ToolbarManager...");
      toolbarManager.initialize();
    }

    // Register LayerManager callbacks for attribute table, heatmap, analysis, and swipe (from script.js)
    if (layerManager) {
      layerManager.setupCallbacks(attributeTable, visualizationManager, analysisManager, swipeManager);
    }

    // Initialize tab system
    tabSystem.initializeMapTabs();

    // Initialize search functionality (Disabled: Header removed)
    // await searchManager.initialize();

    // Initialize map event handlers
    mapEventHandler.initializeEventHandlers();

    // Initialize coordinate display
    coordinateDisplay.initialize();

    // Initialize file upload (from script.js initializeUI)
    uploadHandler.initializeFileUpload();

    // Initialize widget manager fullscreen listener (from script.js initializeUI)
    widgetManager.initializeFullscreenListener();

    // Initialize window event handlers
    windowEventHandler.initialize();

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
      swipeManager,
      popupManager,
      attributeTable,
      classificationManager,
      tourManager,
      countryInfo,
      mapEventHandler,
      coordinateDisplay,
      windowEventHandler,
      widgetManager,
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
