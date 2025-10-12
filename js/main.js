// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

import { CONFIG } from "./core/config.js";
import { StateManager } from "./core/state-manager.js";
import { NotificationManager } from "./ui/notification-manager.js";
import { MapInitializer } from "./core/map-initializer.js";
import { PanelManager } from "./ui/panel-manager.js";
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

// Create PanelManager instance
const panelManager = new PanelManager(stateManager, notificationManager);

// Initialize application
async function initializeApplication() {
  try {
    console.log("Starting GIS application initialization...");
    console.log("StateManager created and ready");
    console.log("NotificationManager created and ready");
    console.log("MapInitializer created and ready");
    console.log("PanelManager created and ready");

    // Initialize the map with injected dependencies
    await initializeMap(stateManager, mapInitializer, notificationManager, panelManager);

    // Bind window functions for HTML event handlers (CRITICAL for inline onclick, onchange, etc.)
    bindWindowFunctions({
      stateManager,
      notificationManager,
      mapInitializer,
      panelManager,
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
