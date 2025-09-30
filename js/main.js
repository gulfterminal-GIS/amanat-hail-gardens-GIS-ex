// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

import { CONFIG } from "./core/config.js";

// Global variables (temporarily preserved for compatibility)
window.displayMap = null;
window.view = null;
window.uploadedLayers = [];
window.measurementWidget = null;
window.searchWidget = null;
window.currentPopupFeature = null;

// Global variables for sketch functionality
window.sketchViewModel = null;
window.drawLayer = null;
window.activeDrawingTool = null;

// Store initial extent for home button
window.homeExtent = null;

// Country feature variables
window.countriesLayer = null;
window.countryInfoTimeout = null;

// Country flash animation
window.flashGraphicsLayer = null;

// Notification system
window.activeNotifications = [];

// Classification variables
window.currentClassificationLayer = null;
window.originalRenderers = new Map();

// Enhanced Spatial Analysis using existing drawing system
window.analysisDrawing = false;
window.analysisDrawType = null;
window.drawnFeatures = {
  buffer: [],
  intersect1: null,
  intersect2: null,
};

// Feature Tour System
window.featureTourActive = false;
window.featureTourInterval = null;
window.currentFeatureIndex = 0;
window.tourFeatures = [];
window.tourLayer = null;

window.highlightHandle = null;

window.autoControl = null;
window.chevronIcon = null;
window.chevronBtn = null;
window.featureDetails = null;

// Make CONFIG available globally for backward compatibility
window.CONFIG = CONFIG;

// Utility function to load ArcGIS modules (preserved for compatibility)
window.loadModule = function (moduleName) {
  return new Promise((resolve, reject) => {
    require([moduleName], (module) => {
      if (module) {
        resolve(module);
      } else {
        reject(new Error(`Module not found: ${moduleName}`));
      }
    }, (error) => {
      reject(error);
    });
  });
};

// Initialize application
async function initializeApplication() {
  try {
    console.log("Starting GIS application initialization...");

    // For now, we'll load the script.js file and call initializeMap
    // This will be replaced with proper module imports in subsequent tasks

    // Load the script.js file which contains initializeMap
    await import("../script.js");

    // Call the initializeMap function that's now available globally
    await window.initializeMap();
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    showNotification(
      "Failed to initialize map. Please refresh the page.",
      "error"
    );
  }
}

// Start the application
initializeApplication();
