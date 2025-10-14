# Implementation Plan

## Current Implementation Status

**COMPLETED:**

- ✅ Project structure setup (js/ directory with subdirectories)
- ✅ script.js converted to ES6 module with exports
- ✅ Core infrastructure modules created:
  - ✅ js/core/config.js - Configuration constants
  - ✅ js/core/state-manager.js - Centralized state management
  - ✅ js/core/map-initializer.js - Map setup and initialization
  - ✅ js/core/module-loader.js - ArcGIS module loading utilities
  - ✅ js/ui/notification-manager.js - Toast notification system
- ✅ main.js updated to orchestrate module loading
- ✅ Application runs successfully with modular foundation

**CRITICAL BLOCKERS:**

- ❌ **URGENT**: Global variable migration incomplete - script.js functions still use direct global access
- ❌ **CRITICAL**: `uploadedLayers` array accessed directly in 15+ functions, breaking StateManager encapsulation
- ❌ **BLOCKER**: Tasks 4.3 and 4.4 must be completed before any module extraction can proceed

**NEXT STEPS:**

1. Fix global variable usage (Tasks 4.3-4.4) - **HIGHEST PRIORITY**
2. Begin UI module extraction (Tasks 5.1-5.4)
3. Continue with layer management modules (Tasks 6.1-6.3)

## Important Notes

**Export Management Strategy:**

- As each module is extracted, comment out the corresponding export in script.js
- Comment out the original function/code in script.js (don't delete)
- The export statement at the end of script.js documents what will be moved where
- Once all modules are extracted, script.js can be deleted entirely

**Dependency Order:**

- Always extract foundation modules first (StateManager, NotificationManager)
- Each module should import from previously extracted modules
- Never create circular dependencies
- Test after each extraction to ensure nothing breaks

**Window Object Exposure (CRITICAL):**

- Functions called from HTML (onclick, onchange, etc.) MUST be exposed on window object
- After extracting a module, ensure its public functions are available on window
- Example: `window.toggleWidget = (name) => widgetManager.toggle(name);`
- This maintains compatibility with inline HTML event handlers
- Document all window-exposed functions in each module

**Testing Strategy:**

- After each task, verify the specific functionality still works
- Keep the application running throughout the refactoring
- Use browser console to check for errors
- Test both desktop and mobile views
- **CRITICAL**: Test all onclick handlers and inline events from HTML
- Test both desktop and mobile views

**CRITICAL: Global Variable Migration Status**

- StateManager created with all global variables migrated ✅
- **CRITICAL ISSUE**: Most functions in script.js still use direct global variable access instead of StateManager
- **MOST CRITICAL**: `uploadedLayers` array is accessed directly in 15+ functions, breaking encapsulation
- **EXAMPLES**: `toggleLayer`, `removeLayer`, `zoomToLayer`, `loadTableData`, `applyHeatmap` all use `uploadedLayers[index]` directly
- **PARTIALLY FIXED**: Some functions like `initializeUI`, `goToFeature` use `stateManager.getView()`
- **REMAINING WORK**: All functions must use StateManager getters/setters before module extraction
- **AFFECTED GLOBALS**: `uploadedLayers` (CRITICAL), `view`, `displayMap`, `drawLayer`, `sketchViewModel`, `measurementWidget`, `searchWidget`, `currentClassificationLayer`
- **PATTERN TO FOLLOW**: Replace `uploadedLayers[index]` with `stateManager.getUploadedLayers()[index]`, etc.
- **PRIORITY**: Tasks 4.3 and 4.4 MUST be completed before any module extraction

**Global Variable Migration Checklist:**

- [ ] `uploadedLayers` - **CRITICAL** - Used directly in 15+ functions: toggleLayer, removeLayer, zoomToLayer, loadTableData, applyHeatmap, setupTimeFields, toggleSwipe, etc.
- [ ] `view` - Partially fixed in some functions, but still used directly in many others
- [ ] `displayMap` - Still used directly in layer management functions (toggleLayer, removeLayer, etc.)
- [ ] `drawLayer` - Still used directly in drawing functions
- [ ] `sketchViewModel` - Still used directly in drawing functions
- [ ] `measurementWidget` - Still used directly in measurement functions
- [ ] `searchWidget` - Still used directly in search functions
- [ ] `currentClassificationLayer` - Still used directly in classification functions
- [ ] All other globals listed in StateManager need similar treatment

---

- [x] 1. Set up project structure and core configuration

  - Create js/ directory structure with core/, ui/, layers/, tools/, features/, and events/ subdirectories
  - Create js/core/config.js with all configuration constants extracted from script.js
  - Create js/main.js as the new entry point that will orchestrate module loading
  - Update index.html to load main.js as ES6 module instead of script.js
  - _Requirements: 1.2, 1.4, 3.1, 3.5_

- [x] 2. Convert script.js to ES6 module and update main.js

  - Add export statements at the end of script.js for all functions that will be used by other modules
  - Export key functions: initializeMap, initializeUI, initializeEventHandlers, loadModule, showNotification, openSidePanel, closeSidePanel
  - Export layer functions: loadGeoJSON, loadCSV, handleFiles, toggleLayer, removeLayer, updateLayerList
  - Export drawing functions: startDrawingWithTool, clearAll, initializeSketchViewModel
  - Export other utility functions as needed by future modules
  - **Keep all global variables within script.js** - do not modify the internal structure
  - _Requirements: 1.2, 1.3, 4.1, 4.2_
  
  - [x] 2.2 Update main.js to import and use script.js as ES6 module

    - Remove the current global variable assignments from main.js
    - Import the initializeMap function from script.js
    - Call initializeMap directly instead of through window object
    - Remove the dynamic import of script.js
    - Ensure main.js is clean and only handles application initialization
    - _Requirements: 1.1, 4.3, 4.4_
  
  - [x] 2.3 Verify all functionality works with script.js as ES6 module

    - Test that the map initializes correctly
    - Verify all toolbar buttons and panels work
    - Test file upload, layer management, and drawing tools
    - Ensure tour system and all widgets function properly
    - Confirm no breaking changes in any existing functionality
    - _Requirements: 1.1, 4.4, 4.5_

- [x] 3. Create state management and core infrastructure

  - [x] 3.1 Create js/core/state-manager.js for centralized state

    - Create StateManager class to centralize all global variables from script.js
    - Add getters/setters for map, view, layers, drawing state, tour state, etc.
    - Replace direct global variable access with StateManager methods
    - Comment out global variable declarations in script.js
    - Update main.js to create and initialize StateManager
    - _Requirements: 1.2, 1.3, 1.5_

  - [x] 3.2 Create js/core/module-loader.js for ArcGIS module loading

    - Extract loadModule function from script.js and comment out original
    - Create wrapper functions for single and multiple module loading
    - Add error handling for module loading failures
    - Update all module loading calls to use new wrapper
    - _Requirements: 1.2, 1.5_

- [x] 4. Extract core services (foundation modules)

  - [x] 4.1 Create js/ui/notification-manager.js (EXTRACT FIRST)

    - Extract showNotification function and activeNotifications array from script.js
    - Create NotificationManager class with notification lifecycle methods
    - Comment out original notification code in script.js
    - Update all notification calls throughout the codebase
    - This module is used by ALL other modules - extract first!
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [x] 4.2 Create js/core/map-initializer.js for map setup

    - Extract initializeMap, loadDefaultGeoJSON, initializeCountriesLayer from script.js
    - Create MapInitializer class with map setup and loading screen logic
    - Comment out original map initialization code in script.js
    - Update main.js to use MapInitializer
    - _Requirements: 1.2, 1.5, 4.1, 4.2_
  
  - [x] 4.3 **CRITICAL: Fix uploadedLayers global variable usage**

    - Replace all direct `uploadedLayers` array access with StateManager methods
    - Update `toggleLayer(index)` to use `stateManager.getUploadedLayers()[index]`
    - Update `removeLayer(index)` to use StateManager's `removeUploadedLayer(index)` method
    - Update `zoomToLayer(index)` to use `stateManager.getUploadedLayers()[index]`
    - Update `loadTableData(layerIndex)` to use `stateManager.getUploadedLayers()[layerIndex]`
    - Update `applyHeatmap(layerIndex)` to use `stateManager.getUploadedLayers()[layerIndex]`
    - Update `setupTimeFields(layerIndex)` to use `stateManager.getUploadedLayers()[layerIndex]`
    - Update all other functions that access `uploadedLayers` directly
    - **PRIORITY**: This must be done before extracting layer management modules
    - _Requirements: 1.2, 1.3, 1.5_

  - [x] 4.4 **URGENT: Fix other global variable usage in script.js**

    - Replace `view` with `stateManager.getView()` in all remaining functions (partially done)
    - Replace `displayMap` with `stateManager.getMap()` in all remaining functions
    - Replace `drawLayer` with `stateManager.getDrawLayer()` in all remaining functions
    - Replace `sketchViewModel` with `stateManager.getSketchViewModel()` in all remaining functions
    - Replace `measurementWidget` with `stateManager.getMeasurementWidget()` in all remaining functions
    - Replace `searchWidget` with `stateManager.getSearchWidget()` in all remaining functions
    - Replace `currentClassificationLayer` with `stateManager.getCurrentClassificationLayer()` in all functions
    - Replace all other global variables with their StateManager equivalents
    - **NOTE**: This is critical for maintaining consistency as modules are extracted
    - _Requirements: 1.2, 1.3, 1.5_

  - [x] 4.5 **Optimize StateManager: Remove scope-limited globals**

    - Identify globals that can be scoped to specific functions/modules instead of StateManager
    - Remove UI element references that can be queried when needed: `chevronIcon`, `chevronBtn`, `featureDetails`
    - Remove temporary/local state that doesn't need global persistence: `autoControl` (already removed)
    - Keep only truly global application state in StateManager
    - Update script.js to use local variables or DOM queries for scope-limited items
    - **GOAL**: Reduce StateManager complexity and improve performance
    - _Requirements: 1.2, 1.3, 3.1_

  - [x] 4.6 **CRITICAL: Create centralized window bindings for HTML event handlers**
    - Create js/window-bindings.js as a single source of truth for all window-exposed functions
    - Review window-functions.md for complete list of functions to expose (50+ functions)
    - Implement bindWindowFunctions(managers) that accepts all manager instances
    - Organize bindings by functional area: widgets, attribute table, tour, zoom, analysis, visualization, classification, measurement, popup, layers, tabs, drawing
    - For functions not yet extracted to modules, bind directly to script.js functions
    - As modules are extracted in future tasks, update bindings to point to new module instances
    - Import and call bindWindowFunctions() in main.js after all managers are initialized
    - Document each binding with comments showing which module it belongs to (current or future)
    - Test all inline event handlers after exposure (see checklist in window-functions.md)
    - **Pattern**: `window.functionName = (...args) => managerInstance.method(...args);`
    - **Benefits**: Single file to audit, easier migration path, clear API surface, better security
    - _Requirements: 1.2, 1.5, 3.2_
    - _Reference: .kiro/specs/gis-app-modularization/window-functions.md_

- [x] 5. Extract UI foundation modules
  - [x] 5.1 Create js/ui/panel-manager.js for side panel system

    - Extract openSidePanel, closeSidePanel, clearToolbarActiveStates from script.js
    - Extract initializeUploadPanel, initializeBasemapPanel functions
    - Create PanelManager class with panel lifecycle methods
    - **CRITICAL**: Update all extracted functions to use StateManager instead of globals (view → stateManager.getView(), etc.)
    - Comment out original panel code in script.js
    - Update main.js to import and initialize PanelManager
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [x] 5.2 Create js/ui/toolbar-manager.js for toolbar functionality
    - Extract desktop and mobile toolbar initialization from initializeUI
    - Create ToolbarManager class with toolbar setup and event handling
    - **CRITICAL**: Replace all global variable usage with StateManager calls (view, displayMap, etc.)
    - Comment out original toolbar code in script.js
    - Update main.js to import and initialize ToolbarManager
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [x] 5.3 Create js/ui/tab-system.js for platform integration tabs
    - Extract initializeMapTabs, redirectToTabPlatform, tabMessages, tabButtonTexts
    - Create TabSystem class for tab management
    - Comment out original tab code in script.js
    - Update main.js to import and initialize TabSystem
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [x] 5.4 Create js/ui/search-manager.js for search functionality
    - Extract search widget initialization and coordinate display logic
    - Create SearchManager class with search and coordinate tracking
    - Comment out original search code in script.js
    - Update main.js to import and initialize SearchManager
    - _Requirements: 1.2, 1.5, 3.2_

- [x] 6. Extract layer management modules

  - [x] 6.1 Create js/layers/layer-manager.js for layer operations
    - Extract toggleLayer, removeLayer, zoomToLayer, updateLayerList from script.js
    - Create LayerManager class with layer CRUD and visibility methods
    - **CRITICAL**: Replace uploadedLayers, displayMap, view globals with StateManager getters/setters
    - Comment out original layer management code in script.js
    - Update references to use LayerManager through StateManager
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [x] 6.2 Create js/layers/upload-handler.js for file processing
    - Extract handleFiles, loadGeoJSON, loadCSV, parseCSVLine from script.js
    - Extract initializeFileUpload, initializeDropZone functions
    - Create UploadHandler class with file processing methods
    - Comment out original file upload code in script.js
    - Update main.js to import and initialize UploadHandler
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [x] 6.3 Create js/layers/basemap-manager.js for basemap functionality

    - Extract basemap switching logic from initializeBasemapPanel
    - Create BasemapManager class with basemap selection methods
    - Comment out original basemap code in script.js
    - Update main.js to import and initialize BasemapManager
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 7. Extract drawing and analysis tool modules
  - [-] 7.1 Create js/tools/drawing-manager.js for sketch functionality

    - Extract initializeSketchViewModel, initializeDrawingPanel, initializeDrawingToolButtons
    - Extract startDrawingWithTool, applyCustomSymbology, updateActiveGraphicsSymbology
    - Extract clearAll, stopDrawing, resetDrawingTools functions
    - Create DrawingManager class with complete drawing functionality
    - **CRITICAL**: Replace sketchViewModel, drawLayer, activeDrawingTool globals with StateManager calls
    - Comment out original drawing code in script.js
    - Update main.js to import and initialize DrawingManager
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 7.2 Create js/tools/analysis-manager.js for spatial analysis
    - Extract buffer, intersect, distance, and area analysis functions
    - Extract modal handling for analysis (enableDrawingMode, disableDrawingMode)
    - Create AnalysisManager class with all analysis methods
    - Comment out original analysis code in script.js
    - Update main.js to import and initialize AnalysisManager
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 7.3 Create js/tools/measurement-manager.js for measurement functionality
    - Extract toggleMeasurement, updateMeasurementResults, closeMeasurementResults
    - Extract closeDistancePanel, clearDistanceMeasurement functions
    - Create MeasurementManager class with measurement methods
    - Comment out original measurement code in script.js
    - Update main.js to import and initialize MeasurementManager
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 7.4 Create js/tools/visualization-manager.js for heatmap and time animation
    - Extract toggleHeatmap, updateHeatmapLayerSelect, showHeatmapSettings
    - Extract initializeHeatmapSliders, updateHeatmapFieldSelect functions
    - Extract toggleTimeControls, playTimeAnimation, stopTimeAnimation
    - Create VisualizationManager class with visualization methods
    - Comment out original visualization code in script.js
    - Update main.js to import and initialize VisualizationManager
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 8. Extract feature management modules
  - [ ] 8.1 Create js/features/popup-manager.js for popup functionality
    - Extract showCustomPopup, showCustomPopupTour, closeCustomPopup from script.js
    - Extract updateGeometryDetails, zoomToFeature, copyFeatureInfo functions
    - Create PopupManager class with popup display and content methods
    - Comment out original popup code in script.js
    - Update main.js to import and initialize PopupManager
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 8.2 Create js/features/attribute-table.js for data table
    - Extract toggleAttributeTable, initializeTableLayerSelect, loadTableData
    - Extract renderTable, searchTable, updatePagination, export functions
    - Extract showTableLoading, showTableError, clearTable, showTableStatistics
    - Create AttributeTable class with complete table functionality
    - Comment out original table code in script.js
    - Update main.js to import and initialize AttributeTable
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 8.3 Create js/features/classification-manager.js for data classification
    - Extract initializeClassificationPanel, analyzeFieldForClassification
    - Extract applyClassification, resetClassification, showClassificationStatistics
    - Extract generateClassificationColors, autoApplyDefaultClassification
    - Create ClassificationManager class with classification methods
    - Comment out original classification code in script.js
    - Update main.js to import and initialize ClassificationManager
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 8.4 Create js/features/tour-manager.js for feature tour system
    - Extract setupFeatureTour, createTourControls, startFeatureTour, stopFeatureTour
    - Extract goToFeature, nextFeature, previousFeature, updateTourInfo
    - Extract toggleFeatureTour, closeTourControls, manuallyStartTour
    - Create TourManager class with complete tour functionality
    - Comment out original tour code in script.js
    - Update main.js to import and initialize TourManager
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 8.5 Create js/features/country-info.js for country click feature
    - Extract initializeCountriesLayer and country info display logic
    - Extract flashCountryBoundary and country info timeout handling
    - Create CountryInfo class with country feature methods
    - Comment out original country info code in script.js
    - Update main.js to import and initialize CountryInfo
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 9. Extract widget modules
  - [ ] 9.1 Create js/widgets/widget-manager.js for widget lifecycle
    - Extract toggleWidget function and widget positioning logic
    - Create WidgetManager class with widget show/hide/position methods
    - Comment out original widget management code in script.js
    - Update main.js to import and initialize WidgetManager
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 9.2 Create js/widgets/legend-widget.js for legend
    - Extract legend initialization and update logic
    - Extract createClassificationLegend function
    - Create LegendWidget class with legend methods
    - Comment out original legend code in script.js
    - Update main.js to import and initialize LegendWidget
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 9.3 Create js/widgets/bookmarks-widget.js for bookmarks
    - Extract bookmark initialization, add, go to, and delete logic
    - Create BookmarksWidget class with bookmark methods
    - Comment out original bookmarks code in script.js
    - Update main.js to import and initialize BookmarksWidget
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 9.4 Create js/widgets/print-widget.js for print functionality
    - Extract print widget initialization and print logic
    - Create PrintWidget class with print methods
    - Comment out original print code in script.js
    - Update main.js to import and initialize PrintWidget
    - _Requirements: 1.2, 1.5, 3.2, 3.3_

- [ ] 10. Extract event handling modules
  - [ ] 10.1 Create js/events/map-event-handler.js for map events
    - Extract initializeEventHandlers and map click/pointer-move logic
    - Extract feature click handling and country info display
    - Create MapEventHandler class with event management methods
    - Comment out original event handling code in script.js
    - Update main.js to import and initialize MapEventHandler
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 10.2 Create js/events/coordinate-display.js for coordinate tracking
    - Extract initializeCoordinateDisplay and coordinate formatting logic
    - Extract copyCoordinates functionality
    - Create CoordinateDisplay class with coordinate methods
    - Comment out original coordinate display code in script.js
    - Update main.js to import and initialize CoordinateDisplay
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 11. Extract utility modules
  - [ ] 11.1 Create js/utils/format-utils.js for formatting helpers
    - Extract formatAttributeValue, formatFieldName, formatCoordinates
    - Extract formatDate, formatNumber, and other formatting functions
    - Comment out original formatting code in script.js
    - Update all modules to import from format-utils
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [ ] 11.2 Create js/utils/geometry-utils.js for geometry calculations
    - Extract geometry calculation functions (area, length, buffer, intersect)
    - Extract getGeometryCenter and other geometry utilities
    - Comment out original geometry code in script.js
    - Update all modules to import from geometry-utils
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [ ] 11.3 Create js/utils/export-utils.js for export functionality
    - Extract exportToCSV, exportToGeoJSON, exportToExcel functions
    - Extract downloadFile and export modal handling
    - Comment out original export code in script.js
    - Update AttributeTable to import from export-utils
    - _Requirements: 1.2, 1.3, 1.5_

- [ ] 12. Update main.js for complete module integration
  - [ ] 12.1 Import all created modules in main.js
    - Add import statements for all module classes in dependency order
    - Initialize StateManager first
    - Initialize NotificationManager second (used by all)
    - Initialize all other managers in proper dependency order
    - Remove any remaining imports from script.js
    - _Requirements: 1.1, 1.5, 4.4_
  
  - [ ] 12.2 Verify complete application functionality with modular system
    - Test all toolbar buttons and their associated panels
    - Verify all drawing tools, analysis functions, and widgets work correctly
    - Confirm file upload, layer management, and basemap switching functionality
    - Ensure tour system, popups, and attribute table operate as expected
    - Test all event handlers and coordinate display
    - Verify all modules work together seamlessly
    - _Requirements: 1.1, 3.2, 3.4, 4.4_

- [ ] 13. Final cleanup and optimization
  - [ ] 13.1 Remove commented code from script.js
    - Remove all commented-out code from script.js once all modules are verified working
    - Keep only the export statement if any modules still need it
    - Verify complete application functionality after cleanup
    - _Requirements: 1.1, 1.5, 4.5_
  
  - [ ] 13.2 Optimize module structure and dependencies
    - Review all module imports and remove any unused imports
    - Ensure no circular dependencies exist
    - Add proper error handling for module loading failures
    - Optimize module initialization order in main.js
    - _Requirements: 1.1, 1.5, 4.5_
  
  - [ ] 13.3 Optional script.js deletion
    - If script.js is now empty or only has exports, consider deleting it
    - Update main.js to remove script.js import if deleted
    - Update index.html if needed
    - Final comprehensive testing of entire application
    - _Requirements: 1.1, 1.5, 4.5_
  
  - [ ] 13.4 Documentation and final verification
    - Document the new module structure and dependencies
    - Create a module dependency diagram
    - Verify all features work: map, layers, drawing, analysis, tour, widgets
    - Test on different browsers and screen sizes
    - Performance testing and optimization
    - _Requirements: 1.1, 1.5, 4.5_
