// Main entry point for the GIS application
// This file orchestrates the loading and initialization of all modules

import { CONFIG } from "./core/config.js";
import { initializeMap } from "../script.js";

// Make CONFIG available globally for backward compatibility
window.CONFIG = CONFIG;

// Initialize application
async function initializeApplication() {
  try {
    console.log("Starting GIS application initialization...");

    // Call the initializeMap function directly from the imported module
    await initializeMap();
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    // Note: showNotification is not available here yet, will be imported in later tasks
    console.error("Failed to initialize map. Please refresh the page.");
  }
}

// Start the application
initializeApplication();
