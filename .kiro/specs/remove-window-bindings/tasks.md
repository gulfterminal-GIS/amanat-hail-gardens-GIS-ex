# Implementation Plan - Window Bindings Optimization

## Overview

This implementation plan focuses on optimizing the current window bindings by:
1. Removing unnecessary window globals from StateManager
2. Documenting the legitimate window bindings API
3. Creating audit tools for ongoing monitoring

**Note**: This does NOT include removing inline HTML event handlers - that will be a separate spec.

## Tasks

- [ ] 1. Remove backward compatibility window globals from StateManager
  
  - [ ] 1.1 Remove window assignments from map/view setters
    - Remove `window.displayMap = map` from `setMap()`
    - Remove `window.view = view` from `setView()`
    - Remove `window.homeExtent = extent` from `setHomeExtent()`
    - Keep only the internal `this._xxx` assignments
    - _Requirements: 2.1, 2.3, 3.1_
  
  - [ ] 1.2 Remove window assignments from layer setters
    - Remove `window.uploadedLayers = ` from `addUploadedLayer()` and `removeUploadedLayer()`
    - Remove `window.drawLayer = ` from `setDrawLayer()`
    - Remove `window.countriesLayer = ` from `setCountriesLayer()`
    - Remove `window.flashGraphicsLayer = ` from `setFlashGraphicsLayer()`
    - Remove `window.tourLayer = ` from `setTourLayer()`
    - _Requirements: 2.1, 2.3, 3.1_
  
  - [ ] 1.3 Remove window assignments from widget/tool setters
    - Remove `window.searchWidget = ` from `setSearchWidget()`
    - Remove `window.measurementWidget = ` from `setMeasurementWidget()`
    - Remove `window.sketchViewModel = ` from `setSketchViewModel()`
    - Remove `window.activeDrawingTool = ` from `setActiveDrawingTool()`
    - _Requirements: 2.1, 2.3, 3.1_
  
  - [ ] 1.4 Remove window assignments from state setters
    - Remove `window.currentPopupFeature = ` from `setCurrentPopupFeature()`
    - Remove `window.activeNotifications = ` from notification methods
    - Remove `window.featureTourActive = ` from `setFeatureTourActive()`
    - Remove `window.featureTourInterval = ` from `setFeatureTourInterval()`
    - Remove `window.currentFeatureIndex = ` from `setCurrentFeatureIndex()`
    - Remove `window.tourFeatures = ` from `setTourFeatures()`
    - Remove `window.highlightHandle = ` from `setHighlightHandle()`
    - _Requirements: 2.1, 2.3, 3.1_
  
  - [ ] 1.5 Remove window assignments from classification/analysis setters
    - Remove `window.currentClassificationLayer = ` from `setCurrentClassificationLayer()`
    - Remove `window.originalRenderers = ` from renderer methods
    - Remove `window.analysisDrawing = ` from `setAnalysisDrawing()`
    - Remove `window.analysisDrawType = ` from `setAnalysisDrawType()`
    - Remove `window.drawnFeatures = ` from drawn features methods
    - Remove `window.countryInfoTimeout = ` from timeout methods
    - _Requirements: 2.1, 2.3, 3.1_
  
  - [ ] 1.6 Remove backward compatibility comments
    - Remove all "Also set global for backward compatibility during transition" comments
    - Update class documentation to reflect that StateManager no longer sets window globals
    - _Requirements: 2.2, 3.1_
  
  - [ ] 1.7 Test application after removing window globals
    - Run application and verify all features work
    - Test layer management (add, remove, toggle, zoom)
    - Test drawing tools and sketch functionality
    - Test analysis tools (buffer, intersect, distance, area)
    - Test tour system and feature navigation
    - Test attribute table and data export
    - Test all widgets (legend, bookmarks, print, etc.)
    - Verify no console errors about undefined globals
    - _Requirements: 2.4, 6.3, 7.2_

- [ ] 2. Fix ToolbarManager to use direct manager references
  
  - [ ] 2.1 Update ToolbarManager constructor
    - Add `classificationManager`, `measurementManager` parameters to constructor
    - Store as instance properties `this.classificationManager`, `this.measurementManager`
    - Update main.js to pass these managers when creating ToolbarManager
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 2.2 Replace window.initializeClassificationPanel calls
    - Find all `window.initializeClassificationPanel()` calls in ToolbarManager
    - Replace with `this.classificationManager.initializePanel()`
    - Remove the `if (window.initializeClassificationPanel)` checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 2.3 Replace window.clearAll calls
    - Find all `window.clearAll()` calls in ToolbarManager
    - Replace with `this.drawingManager.clearAll()`
    - Remove the `if (window.clearAll)` checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 2.4 Replace window.toggleMeasurement calls
    - Find all `window.toggleMeasurement()` calls in ToolbarManager
    - Replace with `this.measurementManager.toggleMeasurement()`
    - Remove the `if (window.toggleMeasurement)` checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 2.5 Replace window.resetDrawingTools calls
    - Find all `window.resetDrawingTools()` calls in ToolbarManager
    - Replace with `this.drawingManager.resetDrawingTools()`
    - Remove the `if (window.resetDrawingTools)` checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 2.6 Test toolbar functionality
    - Test all toolbar buttons work correctly
    - Test classification panel opens and initializes
    - Test clear all button works
    - Test measurement toggle works
    - Verify no console errors
    - _Requirements: 5.3, 6.1, 6.2_

- [ ] 3. Fix AnalysisManager event handler storage
  
  - [ ] 3.1 Add event handler properties to AnalysisManager constructor
    - Add `this.currentBufferHandler = null`
    - Add `this.intersectDrawHandler = null`
    - Add `this.distanceClickHandler = null`
    - Add `this.distanceDrawHandler = null`
    - Add `this.analysisHandles = []`
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 3.2 Replace window.currentBufferHandler references
    - Find all `window.currentBufferHandler` references
    - Replace with `this.currentBufferHandler`
    - Update all assignments and checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 3.3 Replace window.intersectDrawHandler references
    - Find all `window.intersectDrawHandler` references
    - Replace with `this.intersectDrawHandler`
    - Update all assignments and checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 3.4 Replace window.distanceClickHandler references
    - Find all `window.distanceClickHandler` references
    - Replace with `this.distanceClickHandler`
    - Update all assignments and checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 3.5 Replace window.distanceDrawHandler references
    - Find all `window.distanceDrawHandler` references
    - Replace with `this.distanceDrawHandler`
    - Update all assignments and checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 3.6 Replace window.analysisHandles references
    - Find all `window.analysisHandles` references
    - Replace with `this.analysisHandles`
    - Update all assignments and checks
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 3.7 Test analysis tools
    - Test buffer analysis with drawing
    - Test intersect analysis with drawing
    - Test distance analysis
    - Verify event handlers are properly cleaned up
    - Verify no console errors
    - _Requirements: 5.3, 6.1, 6.2_

- [ ] 4. Fix heatmap state access across modules
  
  - [ ] 4.1 Add getCurrentHeatmapSettings getter to VisualizationManager
    - Add method `getCurrentHeatmapSettings()` that returns `this.currentHeatmapSettings`
    - Verify `isHeatmapEnabled()` and `getHeatmapLayer()` already exist
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 4.2 Update LayerManager to use VisualizationManager
    - Add `visualizationManager` parameter to LayerManager constructor
    - Store as `this.visualizationManager`
    - Update main.js to pass visualizationManager when creating LayerManager
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 4.3 Replace window.heatmapEnabled in LayerManager
    - Find `window.heatmapEnabled` check in LayerManager
    - Replace with `this.visualizationManager.isHeatmapEnabled()`
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 4.4 Update MapInitializer to use VisualizationManager
    - Add `visualizationManager` parameter to MapInitializer constructor
    - Store as `this.visualizationManager`
    - Update main.js to pass visualizationManager when creating MapInitializer
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 4.5 Replace window heatmap globals in MapInitializer
    - Find `window.heatmapEnabled` and replace with `this.visualizationManager.isHeatmapEnabled()`
    - Find `window.heatmapLayer` and replace with `this.visualizationManager.getHeatmapLayer()`
    - Find `window.currentHeatmapSettings` and replace with `this.visualizationManager.getCurrentHeatmapSettings()`
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 4.6 Test heatmap functionality
    - Test enabling/disabling heatmap
    - Test heatmap settings changes
    - Test heatmap with zoom level changes
    - Verify layer list updates correctly
    - Verify no console errors
    - _Requirements: 5.3, 6.1, 6.2_

- [ ] 5. Remove window.CONFIG from main.js
  
  - [ ] 5.1 Remove window.CONFIG assignment
    - Remove `window.CONFIG = CONFIG;` from main.js
    - Keep the import statement `import { CONFIG } from "./core/config.js";`
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [ ] 5.2 Verify no code accesses window.CONFIG
    - Search codebase for `window.CONFIG` references
    - Verify all modules import CONFIG directly if needed
    - _Requirements: 3.1, 5.2, 5.3_
  
  - [ ] 5.3 Test application initialization
    - Verify application starts correctly
    - Verify all modules have access to CONFIG
    - Verify no console errors about undefined CONFIG
    - _Requirements: 5.3, 6.1, 6.2_

- [ ] 6. Final verification and documentation
  
  - [ ] 6.1 Comprehensive testing
    - Test all toolbar buttons and quick actions
    - Test all modal dialogs and their controls
    - Test all panel interactions (upload, basemap, drawing, analysis, visualization, classification)
    - Test all widget controls (legend, bookmarks, print)
    - Test all table interactions (sort, search, pagination, export)
    - Test all tour controls (start, next, previous, close)
    - Test all analysis tool interactions (buffer, intersect, distance, area)
    - Test heatmap visualization and settings
    - Test drawing tools and clearing
    - Test measurement tools
    - Verify no regression in any feature
    - _Requirements: 5.3, 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 6.2 Verify no window global pollution
    - Open browser console
    - Check that window.displayMap, window.view, window.uploadedLayers, etc. are undefined
    - Check that window.CONFIG is undefined
    - Check that window.heatmapEnabled, window.heatmapLayer are undefined
    - Verify only legitimate window bindings from window-bindings.js exist
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1_
  
  - [ ] 6.3 Update spec documentation
    - Update requirements.md to reflect completed work
    - Update design.md with any implementation notes
    - Document any deviations from original plan
    - Document the ~30 window globals that were removed
    - _Requirements: 3.4, 8.3, 8.4_
  
  - [ ] 6.4 Prepare for next phase
    - Document that ~50 window bindings remain (all needed for HTML inline handlers)
    - Note that next phase should focus on HTML refactoring to remove inline handlers
    - Document that audit tools should be created in next phase
    - Estimate effort for HTML refactoring phase
    - _Requirements: 3.4, 8.1, 8.2, 8.3, 8.4_

## Success Criteria

- ✅ All backward compatibility window globals removed from StateManager (~20 globals)
- ✅ ToolbarManager uses direct manager references instead of window bindings (~4 calls)
- ✅ AnalysisManager stores event handlers as instance properties (~5 handlers)
- ✅ LayerManager and MapInitializer use VisualizationManager getters (~3 calls)
- ✅ window.CONFIG removed from main.js
- ✅ Total: ~30 unnecessary window globals/bindings removed
- ✅ All application features work correctly with no regressions
- ✅ No console errors about undefined globals
- ✅ ~50 legitimate window bindings remain (all needed for HTML inline handlers)
- ✅ Foundation established for future HTML refactoring phase

## Notes

- This phase does NOT remove window bindings from window-bindings.js
- This phase does NOT remove inline HTML event handlers
- All inline HTML event handlers remain unchanged
- Focus is on cleaning up unnecessary globals and improving module dependencies
- The major refactoring (removing inline handlers) will be a separate spec
- Audit tools should be created in the next phase (HTML refactoring)
- All changes should be non-breaking and transparent to users
