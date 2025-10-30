/**
 * script-migrated.js
 * 
 * This file contains code that has been SUCCESSFULLY MIGRATED to the new modular architecture.
 * All functionality in this file now exists in dedicated modules and is no longer needed in script.js.
 * 
 * This file is kept for reference only and is NOT loaded by the application.
 * 
 * Migration Status: COMPLETE
 * Date: Current
 * 
 * Modules that replaced this code:
 * - js/core/config.js
 * - js/core/state-manager.js
 * - js/core/map-initializer.js
 * - js/core/module-loader.js
 * - js/ui/notification-manager.js
 * - js/ui/panel-manager.js
 * - js/ui/toolbar-manager.js
 * - js/ui/tab-system.js
 * - js/ui/search-manager.js
 * - js/layers/layer-manager.js
 * - js/layers/upload-handler.js
 * - js/layers/basemap-manager.js
 */

// ============================================================================
// SECTION 1: ORIGINAL initializeMap FUNCTION
// ✅ MIGRATED TO: js/core/map-initializer.js
// ============================================================================

// async function initializeMap() {
//   try {
//     const [esriConfig, Map, MapView, GraphicsLayer, reactiveUtils] =
//       await Promise.all([
//         loadModule("esri/config"),
//         loadModule("esri/Map"),
//         loadModule("esri/views/MapView"),
//         loadModule("esri/layers/GraphicsLayer"),
//         loadModule("esri/core/reactiveUtils"),
//       ]);

//     esriConfig.apiKey =
//       "AAPK67a9b2041fcc449d90ab91d6bae4a156HTaBtzlYSKLe8L-zBuIgrSGvxOopzVQEtdwVrlp6RKN9Rrq_y2qkTax7Do1cHqm9";
//
//     displayMap = new Map({
//       basemap: "hybrid",
//     });
//
//     view = new MapView({
//       center: [-95.7129, 37.0902],
//       container: "displayMap",
//       map: displayMap,
//       zoom: 4,
//       highlightOptions: {
//         color: "#39ff14",
//         haloOpacity: 0.9,
//         fillOpacity: 0.2,
//       },
//     });
//
//     drawLayer = new GraphicsLayer({
//       title: "Drawings",
//       listMode: "show",
//     });
//     displayMap.add(drawLayer);
//
//     await view.when();
//
//     view.ui.remove(["compass", "zoom"]);
//
//     // Store home extent
//     homeExtent = view.extent.clone();
//
//     // Load default GeoJSON layer
//     await loadDefaultGeoJSON();
//
//     // Initialize countries layer for click feature
//     await initializeCountriesLayer();
//
//     // Store home extent
//     homeExtent = view.extent.clone();
//
//     // Initialize zoom watcher for heatmap using reactiveUtils
//     reactiveUtils.watch(
//       () => view.zoom,
//       (zoom) => {
//         if (window.heatmapEnabled && window.heatmapLayer) {
//           // Adjust radius based on zoom level for better visualization
//           const baseRadius = window.currentHeatmapSettings.radius;
//           const zoomFactor = Math.max(1, Math.min(3, zoom / 10));
//
//           if (
//             window.heatmapLayer.renderer &&
//             window.heatmapLayer.renderer.type === "heatmap"
//           ) {
//             window.heatmapLayer.renderer.radius = baseRadius * zoomFactor;
//           }
//         }
//       }
//     );
//
//     initializeUI();
//     initializeEventHandlers();
//
//     // Loading screen logic
//     const loadingScreen = document.getElementById("loadingScreen");
//     let loadingContent = document.querySelector(".loading-content");
//
//     function wait(ms) {
//       return new Promise((resolve) => setTimeout(resolve, ms));
//     }
//
//     console.log("Starting loading sequence...");
//     wait(0)
//       .then(() => {
//         loadingContent.innerHTML = `
//           <img class="loaded-gif" src="images/map-loading.gif" alt="">
//           <div class="loading-text">جاري مسح الخريطة...</div>
//         `;
//         return wait(3000);
//       })
//       .finally(() => {
//         loadingScreen.classList.add("fade-out");
//       });
//
//     // Check if it's the first visit
//     const hasSeenTour = localStorage.getItem("gisStudioTourCompleted");
//     if (!hasSeenTour) {
//       // Start tour after a short delay
//       setTimeout(() => {
//         startAppTour();
//         // Mark tour as seen
//         localStorage.setItem("gisStudioTourCompleted", "true");
//       }, 1500);
//     }
//
//     console.log("Map initialized successfully", displayMap, view);
//     return [view, displayMap];
//   } catch (error) {
//     console.error("Error initializing map:", error);
//     throw error;
//   }
// }

// ============================================================================
// SECTION 2: TAB SYSTEM
// ✅ MIGRATED TO: js/ui/tab-system.js
// ============================================================================

// Tab System configuration
// const tabConfig = {
//   messages: {
//     gardens: "التوجه الى منصة الحدائق الذكية",
//     projects: "يلزم الربط بمنصة قرار لعرض المشروعات",
//     assets: "يلزم الربط بالتشغيل و الصيانة لعرض الأصول",
//     smartEye: "يلزم الربط بمنصة العين الذكية"
//   },
//   buttons: {
//     gardens: {
//       text: "ربط بمنصة الحدائق الذكية",
//       url: "https://intelli.it.com/"
//     },
//     projects: {
//       text: "ربط بمنصة قرار",
//       url: "https://qarar2025.azurewebsites.net/"
//     },
//     assets: {
//       text: "ربط بالتشغيل و الصيانة",
//       url: "https://gt-ams.azurewebsites.net/"
//     },
//     smartEye: {
//       text: "ربط بمنصة العين الذكية",
//       url: "http://hayel.dtsit.net/dashboard"
//     }
//   }
// };

// Initialize tabs
// function initializeMapTabs() {
//   const tabButtons = document.querySelectorAll(".tab-button");
//   const backdrop = document.getElementById("tabBackdrop");
//   const contentCard = backdrop.querySelector(".tab-content-card");

//   tabButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       const tabType = this.getAttribute("data-tab");

//       // For other tabs, show the message
//       const message = tabConfig.messages[tabType];
//       const buttonInfo = tabConfig.buttons[tabType];

//       if (message && buttonInfo) {
//         // Update content
//         contentCard.innerHTML = `
//           <div class="tab-icon-container">
//             <img src="images/plug.gif" alt="Loading" class="tab-gif-icon" />
//           </div>
          
//           <p class="tab-message-text">${message}</p>
          
//           <button class="tab-action-button" onclick="redirectToTabPlatform('${tabType}')">
//             <span>${buttonInfo.text}</span>
//             <i class="fas fa-external-link-alt"></i>
//           </button>
//         `;

//         // Show backdrop
//         backdrop.classList.remove("hidden");
//       }
//     });
//   });

//   // Close backdrop when clicking outside
//   backdrop.addEventListener("click", function (e) {
//     if (e.target === this) {
//       this.classList.add("hidden");
//       // Return to gardens tab
//       tabButtons.forEach((btn) => btn.classList.remove("active"));
//       document.querySelector('[data-tab="gardens"]').classList.add("active");
//     }
//   });
// }

// Add this function to handle platform redirect
// function redirectToTabPlatform(tabType) {
//   const buttonInfo = tabConfig.buttons[tabType];
//   if (buttonInfo && buttonInfo.url) {
//     showNotification(`جاري التوجيه إلى ${buttonInfo.text}...`, 'success');

//     // Simulate loading state
//     const button = event.target.closest(".tab-action-button");
//     button.disabled = true;
//     button.innerHTML = `
//       <span>جاري التحميل...</span>
//       <i class="fas fa-spinner fa-spin"></i>
//     `;

//     setTimeout(() => {
//       window.open(buttonInfo.url, "_blank");
//       console.log(`Redirecting to: ${buttonInfo.url}`);

//       // Close the backdrop
//       document.getElementById("tabBackdrop").classList.add("hidden");

//       // Reset to gardens tab
//       document
//         .querySelectorAll(".tab-button")
//         .forEach((btn) => btn.classList.remove("active"));
//       document.querySelector('[data-tab="gardens"]').classList.add("active");
//     }, 1500);
//   }
// }

// ============================================================================
// SECTION 3: NOTIFICATION SYSTEM
// ✅ MIGRATED TO: js/ui/notification-manager.js
// ============================================================================

// function showNotification(message, type = 'info') {
//   // Create notification element
//   const notification = document.createElement('div');
//   notification.className = `notification ${type}`;

//   // Set icon based on type
//   let icon = 'fa-info-circle';
//   if (type === 'success') icon = 'fa-check-circle';
//   else if (type === 'error') icon = 'fa-exclamation-circle';
//   else if (type === 'warning') icon = 'fa-exclamation-triangle';

//   notification.innerHTML = `
//     <i class="fas ${icon}"></i>
//     <span>${message}</span>
//   `;

//   // Calculate position based on active notifications
//   const topPosition = 80 + (activeNotifications.length * 60);

//   // Add styles
//   notification.style.cssText = `
//     position: fixed;
//     top: ${topPosition}px;
//     left: 50%;
//     transform: translateX(-50%);
//     background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
//     color: white;
//     padding: 12px 24px;
//     border-radius: 8px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     z-index: 1000;
//     animation: slideIn 0.3s ease-out;
//     max-width: 90%;
//   `;

//   document.body.appendChild(notification);
//   activeNotifications.push(notification);

//   // Remove after duration
//   const duration = type === 'warning' ? 5000 : 3000;
//   setTimeout(() => {
//     notification.style.animation = 'slideOut 0.3s ease-out';
//     setTimeout(() => {
//       document.body.removeChild(notification);
//       // Remove from active notifications and update positions
//       const index = activeNotifications.indexOf(notification);
//       if (index > -1) {
//         activeNotifications.splice(index, 1);
//         // Update positions of remaining notifications
//         activeNotifications.forEach((notif, i) => {
//           notif.style.top = (80 + (i * 60)) + 'px';
//         });
//       }
//     }, 300);
//   }, duration);
// }

// ============================================================================
// SECTION 4: LOAD DEFAULT GEOJSON LAYER
// ✅ MIGRATED TO: js/core/map-initializer.js
// ============================================================================
// async function loadDefaultGeoJSON() {
//   try {
//     const [GeoJSONLayer] = await Promise.all([
//       loadModule("esri/layers/GeoJSONLayer"),
//     ]);
//
//     // Create the GeoJSON layer
//     const geojsonLayer = new GeoJSONLayer({
//       url: "Gardens.geojson", // Update this path to match your file location
//       title: "حدائق حائل", // Or whatever title you prefer
//       outFields: ["*"],
//       renderer: {
//         type: "simple",
//         symbol: {
//           type: "simple-fill",
//           color: [34, 139, 34, 0.4], // Forest green with transparency
//           outline: {
//             color: [0, 100, 0, 1], // Dark green outline
//             width: 2,
//           },
//         },
//       },
//     });
//
//     // Add to map
//     displayMap.add(geojsonLayer);
//
//     // Add to uploaded layers array so it appears in layer list
//     uploadedLayers.push(geojsonLayer);
//
//     // Store for tour
//     tourLayer = geojsonLayer;
//
//     // Wait for layer to load
//     await geojsonLayer.load();
//
//     // Zoom to the layer extent
//     if (geojsonLayer.fullExtent) {
//       await view.goTo(geojsonLayer.fullExtent.expand(1.1));
//     }
//
//     // Update layer list UI
//     updateLayerList();
//
//     // Setup feature tour after layer loads
//     await setupFeatureTour(geojsonLayer);
//     chevronBtn = document.querySelector(".feature-tour-controls .chevron");
//     chevronIcon = document.querySelector(".feature-tour-controls .chevron i");
//     autoControl = document.querySelector(".feature-tour-controls .auto-control");
//     featureDetails = document.querySelector(".feature-tour-controls .feature-details");
//
//     // Toggle featureDetails when chevron is clicked
//     if (chevronBtn) {
//       chevronBtn.addEventListener("click", () => {
//         if (!chevronIcon) {
//           chevronIcon = chevronBtn.querySelector("i");
//         }
//
//         const currentlyVisible = window.getComputedStyle(featureDetails).display !== "none";
//         const newVisible = !currentlyVisible;
//
//         featureDetails.style.display = newVisible ? "flex" : "none";
//
//         if (chevronIcon) {
//           chevronIcon.classList.toggle("bi-chevron-up", newVisible);
//           chevronIcon.classList.toggle("bi-chevron-down", !newVisible);
//         }
//       });
//     }
//
//     console.log("Default GeoJSON layer loaded successfully");
//
//     // 🔹 Apply classification automatically on GARDENSTATUS
//     currentClassificationLayer = geojsonLayer;
//     await autoApplyDefaultClassification(geojsonLayer, "GARDENSTATUS");
//   } catch (error) {
//     console.error("Error loading default GeoJSON:", error);
//     // Don't show error to user since this is a default layer
//   }
// }

// ============================================================================
// SECTION 5: INITIALIZE COUNTRIES LAYER
// ✅ MIGRATED TO: js/core/map-initializer.js
// ============================================================================
// Initialize countries layer for click info display
// async function initializeCountriesLayer() {
//   try {
//     const [FeatureLayer, GraphicsLayer] = await Promise.all([
//       loadModule("esri/layers/FeatureLayer"),
//       loadModule("esri/layers/GraphicsLayer"),
//     ]);
//
//     // Create graphics layer for flash animation
//     flashGraphicsLayer = new GraphicsLayer({
//       title: "Flash Animation",
//       listMode: "hide",
//     });
//     displayMap.add(flashGraphicsLayer);
//
//     // Create countries layer but don't display it (only for queries)
//     countriesLayer = new FeatureLayer({
//       url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
//       visible: false, // Hidden layer, only for queries
//     });
//
//     displayMap.add(countriesLayer);
//   } catch (error) {
//     console.error("Error loading countries layer:", error);
//   }
// }

// ============================================================================
// SECTION 6: TOOLBAR INITIALIZATION
// ✅ MIGRATED TO: js/ui/toolbar-manager.js
// ============================================================================

// Mobile toolbar initialization code that was in initializeUI()
// Initialize mobile toolbar
// const mobileToggle = document.getElementById("mobileToolbarToggle");
// const mobileMenu = document.getElementById("mobileToolbarMenu");
// const mobileClose = document.getElementById("mobileMenuClose");

// mobileToggle.addEventListener("click", () => {
//   mobileMenu.classList.add("active");
// });

// mobileClose.addEventListener("click", () => {
//   mobileMenu.classList.remove("active");
// });

// // Close mobile menu on outside click
// mobileMenu.addEventListener("click", (e) => {
//   if (e.target === mobileMenu) {
//     mobileMenu.classList.remove("active");
//   }
// });

// Mobile menu item clicks
// document.querySelectorAll(".mobile-menu-item").forEach((item) => {
//   item.addEventListener("click", function () {
//     const { stateManager } = getState();
//     const action = this.dataset.action;
//     mobileMenu.classList.remove("active");

//     // Trigger the appropriate action
//     switch (action) {
//       case "upload":
//         getState().panelManager.openSidePanel("Upload Files", "uploadPanelTemplate");
//         break;
//       case "layers":
//         getState().panelManager.openSidePanel("Layers", "layersPanelTemplate");
//         break;
//       case "basemap":
//         getState().panelManager.openSidePanel("Basemap", "basemapPanelTemplate");
//         break;
//       case "measure":
//         toggleMeasurement();
//         break;
//       case "draw":
//         getState().panelManager.openSidePanel("Drawing Tools", "drawingPanelTemplate");
//         initializeDrawingPanel();
//         break;
//       case "locate":
//         locateUser();
//         break;
//       case "analysis":
//         getState().panelManager.openSidePanel("Spatial Analysis", "analysisPanelTemplate");
//         break;
//       case "visualize":
//         getState().panelManager.openSidePanel("Visualization", "visualizationPanelTemplate");
//         break;
//       case "classification":
//         getState().panelManager.openSidePanel("Classification", "classificationPanelTemplate");
//         initializeClassificationPanel();
//         break;
//     }
//   });
// });

// Desktop toolbar buttons
// document.getElementById("uploadBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
//   getState().panelManager.openSidePanel("Upload Files", "uploadPanelTemplate");
// });

// document.getElementById("layersBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
//   getState().panelManager.openSidePanel("Layers", "layersPanelTemplate");
// });

// document.getElementById("basemapBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
//   getState().panelManager.openSidePanel("Basemap", "basemapPanelTemplate");
// });

// document.getElementById("analysisBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
//   getState().panelManager.openSidePanel("Spatial Analysis", "analysisPanelTemplate");
// });

// document.getElementById("visualizeBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
//   getState().panelManager.openSidePanel("Visualization", "visualizationPanelTemplate");
// });

// document.getElementById("classificationBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
//   getState().panelManager.openSidePanel("Classification", "classificationPanelTemplate");
//   initializeClassificationPanel();
// });

// document.getElementById("tableBtn").addEventListener("click", function () {
//   this.classList.toggle("active");
// });

// ============================================================================
// SECTION 7: BASEMAP MANAGER
// ✅ MIGRATED TO: js/layers/basemap-manager.js
// ============================================================================

// Initialize basemap switcher
// const basemapItems = document.querySelectorAll(".basemap-item");
// basemapItems.forEach((item) => {
//   item.addEventListener("click", () => {
//     const { stateManager } = getState();
//     const map = stateManager.getMap();
//     const basemap = item.dataset.basemap;

//     if (map) {
//       map.basemap = basemap;
//       // Update active state
//       basemapItems.forEach((b) => b.classList.remove("active"));
//       item.classList.add("active");
//     }
//   });
// });

// Initialize tools
// function initializeTools() {
//   // // Measure tool
//   // document.getElementById('measureBtn').addEventListener('click', toggleMeasurement);

//   // Draw tool
//   document.getElementById("drawBtn").addEventListener("click", toggleDraw);

//   // Clear tool
//   document.getElementById("clearBtn").addEventListener("click", clearAll);

//   // Locate tool
//   document.getElementById("locateBtn").addEven", locateUsick"cltListener(

// // Replace your existing toggleDraw function:
// async function toggleDraw() {
//   const btn = document.getElementById('drawBtn');

//   if (btn.classList.contains('active')) {
//     // Deactivate draw
//     btn.classList.remove('active');
//     closeSidePanel();
//     if (sketchViewModel) {
//       sketchViewModel.cancel();
//     }
//     resetDrawingTools();
//   } else {
//     // Deactivate other tools
//     document.getElementById('measureBtn').classList.remove('active');
//     if (measurementWidget) {
//       measurementWidget.clear();
//       view.ui.remove(measurementWidget);
//     }

//     btn.classList.add('active');
//     openSidePanel('Drawing Tools', 'drawingPanelTemplate');
//     await initializeSketchViewModel();
//     initializeDrawingPanel();
//   }
// }

// async function toggleDraw() {
//   const btn = document.getElementById("drawBtn");

//   // Check if button exists before using it
//   if (!btn) {
//     console.error("Draw button not found");
//     return;
//   }

//   if (btn.classList.contains("active")) {
//     // Deactivate draw
//     btn.classList.remove("active");
//     closeSidePanel();
//     const { stateManager } = getState();
//     const sketchViewModel = stateManager.getSketchViewModel();
//     if (sketchViewModel) {
//       sketchViewModel.cancel();
//     }
//     resetDrawingTools();
//   } else {
//     // Deactivate other tools
//     const { stateManager } = getState();
//     const measureBtn = document.getElementById("measureBtn");
//     if (measureBtn) {
//       measureBtn.classList.remove("active");
//     }
//     const measurementWidget = stateManager.getMeasurementWidget();
//     const view = stateManager.getView();
//     if (measurementWidget && view) {
//       measurementWidget.clear();
//       view.ui.remove(measurementWidget);
//     }

//     btn.classList.add("active");
//     openSidePanel("Drawing Tools", "drawingPanelTemplate");
//     await initializeSketchViewModel();
//     initializeDrawingPanel();
//   }
// }

// ============================================================================
// END OF MIGRATED CODE
// ============================================================================

/**
 * MIGRATION NOTES:
 * 
 * All code in this file has been successfully migrated to dedicated modules.
 * The new architecture provides:
 * 
 * 1. Better separation of concerns
 * 2. Easier testing and maintenance
 * 3. Clear dependencies between modules
 * 4. Centralized state management
 * 5. Reusable components
 * 
 * This file is kept for historical reference and can be deleted once
 * the migration is complete and verified.
 */
