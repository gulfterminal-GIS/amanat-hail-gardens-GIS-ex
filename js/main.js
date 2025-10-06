// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

import { CONFIG } from "./core/config.js";
import { StateManager } from "./core/state-manager.js";
import { loadModule, loadModules } from "./core/module-loader.js";
import { NotificationManager } from "./ui/notification-manager.js";
import { MapInitializer } from "./core/map-initializer.js";
import { initializeMap } from "../script.js";

// Make CONFIG available globally for backward compatibility
window.CONFIG = CONFIG;

// Create global StateManager instance
const stateManager = new StateManager();

// Make StateManager available globally for backward compatibility during transition
window.stateManager = stateManager;

// Create global NotificationManager instance (FOUNDATION MODULE - used by all)
const notificationManager = new NotificationManager();

// Make NotificationManager available globally for backward compatibility during transition
window.notificationManager = notificationManager;

// Create global MapInitializer instance
const mapInitializer = new MapInitializer(stateManager, notificationManager, CONFIG);

// Make MapInitializer available globally for backward compatibility during transition
window.mapInitializer = mapInitializer;

// Make module loader functions available globally for backward compatibility
window.loadModule = loadModule;
window.loadModules = loadModules;

// Initialize application
async function initializeApplication() {
  try {
    console.log("Starting GIS application initialization...");
    console.log("StateManager created and ready");
    console.log("NotificationManager created and ready");
    console.log("MapInitializer created and ready");

    // Call the initializeMap function from script.js wrapper
    // which delegates to MapInitializer
    // Note: initializeMap will still use global variables during transition
    // but StateManager, NotificationManager, and MapInitializer are now available for all modules
    await initializeMap();

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
