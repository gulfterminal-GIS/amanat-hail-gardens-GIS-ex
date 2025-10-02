// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

import { CONFIG } from "./core/config.js";
import { StateManager } from "./core/state-manager.js";
import { loadModule, loadModules } from "./core/module-loader.js";
import { initializeMap } from "../script.js";

// Make CONFIG available globally for backward compatibility
window.CONFIG = CONFIG;

// Create global StateManager instance
const stateManager = new StateManager();

// Make StateManager available globally for backward compatibility during transition
window.stateManager = stateManager;

// Make module loader functions available globally for backward compatibility
window.loadModule = loadModule;
window.loadModules = loadModules;

// Initialize application
async function initializeApplication() {
  try {
    console.log("Starting GIS application initialization...");
    console.log("StateManager created and ready");

    // Call the initializeMap function directly from the imported module
    // Note: initializeMap will still use global variables during transition
    // but StateManager is now available for new modules
    await initializeMap();

    console.log("Application initialized successfully");
    console.log("State snapshot:", stateManager.getStateSnapshot());
  } catch (error) {
    console.error("Failed to initialize application:", error);
    // Note: showNotification is not available here yet, will be imported in later tasks
    console.error("Failed to initialize map. Please refresh the page.");
  }
}

// Start the application
initializeApplication();
