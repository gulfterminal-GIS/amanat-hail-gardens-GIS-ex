/**
 * Window Bindings - Centralized window function exposure for HTML event handlers
 * 
 * This file serves as a single source of truth for all functions that need to be
 * exposed on the window object for inline HTML event handlers (onclick, onchange, etc.)
 * 
 * As modules are extracted during the modularization process:
 * 1. Initially, functions bind to script.js implementations
 * 2. As modules are created, update bindings to point to new module instances
 * 3. Document which module each function belongs to (current or future)
 * 
 * Benefits:
 * - Single file to audit all global exposures
 * - Clear API surface for HTML event handlers
 * - Easier migration path when removing inline handlers
 * - Better for security auditing
 * 
 * Reference: .kiro/specs/gis-app-modularization/window-functions.md
 */

import * as scriptFunctions from '../script.js';

/**
 * Bind all window functions for HTML event handlers
 * @param {Object} managers - Object containing all manager instances
 * @param {StateManager} managers.stateManager - State management instance
 * @param {NotificationManager} managers.notificationManager - Notification management instance
 * @param {MapInitializer} managers.mapInitializer - Map initialization instance
 * @param {PanelManager} managers.panelManager - Panel management instance
 */
export function bindWindowFunctions(managers) {
  const {
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
    popupManager,
    attributeTable,
    // Future managers will be added here as they're created:
    // tourManager,
    // classificationManager,
    // countryInfo,
    // widgetManager,
    // mapEventHandler,
    // coordinateDisplay,
  } = managers;

  // ============================================================================
  // WIDGET MANAGEMENT
  // Future module: js/widgets/widget-manager.js
  // ============================================================================
  
  window.toggleWidget = (name) => {
    return scriptFunctions.toggleWidget(name);
  };

  window.deleteBookmark = (index) => {
    return scriptFunctions.deleteBookmark(index);
  };

  // ============================================================================
  // ATTRIBUTE TABLE
  // Future module: js/features/attribute-table.js
  // ============================================================================
  
  window.toggleAttributeTable = () => {
    return attributeTable.toggleAttributeTable();
  };

  window.refreshTable = () => {
    return attributeTable.refreshTable();
  };

  window.sortTable = (column) => {
    return attributeTable.sortTable(column);
  };
  window.selectTableRow = (rowId) => {
    return attributeTable.selectTableRow(rowId);
  };

  window.showExportOptions = () => {
    return attributeTable.showExportOptions();
  };

  window.previousPage = () => {
    return attributeTable.previousPage();
  };

  window.nextPage = () => {
    return attributeTable.nextPage();
  };

  // ============================================================================
  // TOUR SYSTEM
  // Future module: js/features/tour-manager.js
  // ============================================================================
  
  window.manuallyStartTour = () => {
    return scriptFunctions.manuallyStartTour();
  };

  window.startAppTour = () => {
    return scriptFunctions.startAppTour();
  };

  window.toggleFeatureTour = () => {
    return scriptFunctions.toggleFeatureTour();
  };

  window.nextFeature = () => {
    return scriptFunctions.nextFeature();
  };

  window.previousFeature = () => {
    return scriptFunctions.previousFeature();
  };

  window.closeTourControls = () => {
    return scriptFunctions.closeTourControls();
  };

  window.closeTourPopup = () => {
    return scriptFunctions.closeTourPopup();
  };

  // ============================================================================
  // ZOOM CONTROLS
  // Future module: js/ui/toolbar-manager.js or js/events/map-event-handler.js
  // ============================================================================
  
  window.zoomIn = () => {
    return scriptFunctions.zoomIn();
  };

  window.zoomOut = () => {
    return scriptFunctions.zoomOut();
  };

  // ============================================================================
  // ANALYSIS TOOLS
  // Module: js/tools/analysis-manager.js
  // ============================================================================
  
  window.startBufferAnalysis = () => {
    return analysisManager.startBufferAnalysis();
  };

  window.startIntersectAnalysis = () => {
    return analysisManager.startIntersectAnalysis();
  };

  window.startDistanceAnalysis = () => {
    return analysisManager.startDistanceAnalysis();
  };

  window.startAreaAnalysis = () => {
    return analysisManager.startAreaAnalysis();
  };

  window.executeBuffer = () => {
    return analysisManager.executeBuffer();
  };

  window.executeIntersection = () => {
    return analysisManager.executeIntersection();
  };

  window.setBufferSource = (source) => {
    return analysisManager.setBufferSource(source);
  };

  window.startBufferDrawing = (tool) => {
    return analysisManager.startBufferDrawing(tool);
  };

  window.closeBufferModal = () => {
    return analysisManager.closeBufferModal();
  };

  window.closeIntersectModal = () => {
    return analysisManager.closeIntersectModal();
  };

  window.setDistanceSource = (source) => {
    return analysisManager.setDistanceSource(source);
  };

  window.setIntersectSource = (featureNum, source) => {
    return analysisManager.setIntersectSource(featureNum, source);
  };

  window.startIntersectDrawing = (featureNum) => {
    return analysisManager.startIntersectDrawing(featureNum);
  };

  window.cancelIntersectDrawing = () => {
    return analysisManager.cancelIntersectDrawing();
  };

  window.cancelBufferDrawing = () => {
    return analysisManager.cancelBufferDrawing();
  };

  window.clearAnalysisResults = () => {
    return analysisManager.clearAnalysisResults();
  };

  window.closeDistancePanel = () => {
    return analysisManager.closeDistancePanel();
  };

  window.clearDistanceMeasurement = () => {
    return analysisManager.clearDistanceMeasurement();
  };

  // ============================================================================
  // VISUALIZATION
  // Future module: js/tools/visualization-manager.js
  // ============================================================================
  
  window.toggleHeatmap = () => {
    return visualizationManager.toggleHeatmap();
  };

  window.selectColorScheme = (scheme) => {
    return visualizationManager.selectColorScheme(scheme);
  };

  window.showHeatmapSettings = () => {
    return visualizationManager.showHeatmapSettings();
  };

  window.closeHeatmapSettings = () => {
    return visualizationManager.closeHeatmapSettings();
  };

  window.applyHeatmapSettings = () => {
    return visualizationManager.applyHeatmapSettings();
  };

  window.toggleTimeControls = () => {
    return visualizationManager.toggleTimeControls();
  };

  window.playTimeAnimation = () => {
    return visualizationManager.playTimeAnimation();
  };

  window.stopTimeAnimation = () => {
    return visualizationManager.stopTimeAnimation();
  };

  // ============================================================================
  // CLASSIFICATION
  // Future module: js/features/classification-manager.js
  // ============================================================================
  
  window.applyClassification = () => {
    return scriptFunctions.applyClassification();
  };

  window.resetClassification = () => {
    return scriptFunctions.resetClassification();
  };

  // ============================================================================
  // MEASUREMENT
  // Module: js/tools/measurement-manager.js
  // ============================================================================
  
  window.toggleMeasurement = () => {
    return measurementManager.toggleMeasurement();
  };

  window.closeMeasurementResults = () => {
    return measurementManager.closeMeasurementResults();
  };

  // ============================================================================
  // POPUP
  // Future module: js/features/popup-manager.js
  // ============================================================================
  
  window.closeCustomPopup = () => {
    return popupManager.closeCustomPopup();
  };

  window.zoomToFeature = () => {
    return popupManager.zoomToFeature();
  };

  window.copyFeatureInfo = () => {
    return popupManager.copyFeatureInfo();
  };

  // ============================================================================
  // LAYER MANAGEMENT
  // Module: js/layers/layer-manager.js ✅
  // ============================================================================
  
  window.toggleLayer = (index) => {
    return layerManager.toggleLayer(index);
  };

  window.zoomToLayer = (index) => {
    return layerManager.zoomToLayer(index);
  };

  window.removeLayer = (index) => {
    return layerManager.removeLayer(index);
  };

  // ============================================================================
  // TAB SYSTEM
  // Module: js/ui/tab-system.js ✅
  // ============================================================================
  
  window.redirectToTabPlatform = (tabType) => {
    return tabSystem.redirectToTabPlatform(tabType);
  };

  // ============================================================================
  // DRAWING TOOLS
  // Module: js/tools/drawing-manager.js ✅
  // ============================================================================
  
  window.clearAll = () => {
    return drawingManager.clearAll();
  };

  window.startDrawingWithTool = (tool) => {
    return drawingManager.startDrawingWithTool(tool);
  };

  // ============================================================================
  // ADDITIONAL FUNCTIONS (from window-functions.md)
  // These may be dynamically generated or called from templates
  // ============================================================================
  
  // Swipe tool (if exists)
  if (typeof scriptFunctions.toggleSwipe === 'function') {
    window.toggleSwipe = () => {
      return scriptFunctions.toggleSwipe();
    };
  }

  // Search functions (if exists)
  if (typeof scriptFunctions.clearSearch === 'function') {
    window.clearSearch = () => {
      return scriptFunctions.clearSearch();
    };
  }

  // Drawing tool functions - now handled by DrawingManager above

  // Classification field selection (if exists)
  if (typeof scriptFunctions.updateClassificationField === 'function') {
    window.updateClassificationField = () => {
      return scriptFunctions.updateClassificationField();
    };
  }

  // Heatmap layer selection (if exists)
  if (typeof scriptFunctions.updateHeatmapLayerSelect === 'function') {
    window.updateHeatmapLayerSelect = () => {
      return scriptFunctions.updateHeatmapLayerSelect();
    };
  }

  // Table search (if exists)
  if (typeof scriptFunctions.searchTable === 'function') {
    window.searchTable = () => {
      return scriptFunctions.searchTable();
    };
  }

  // Export functions (if exists)
  if (typeof scriptFunctions.exportToCSV === 'function') {
    window.exportToCSV = () => {
      return scriptFunctions.exportToCSV();
    };
  }

  if (typeof scriptFunctions.exportToGeoJSON === 'function') {
    window.exportToGeoJSON = () => {
      return scriptFunctions.exportToGeoJSON();
    };
  }

  if (typeof scriptFunctions.exportToExcel === 'function') {
    window.exportToExcel = () => {
      return scriptFunctions.exportToExcel();
    };
  }

  // Close export modal (if exists)
  if (typeof scriptFunctions.closeExportModal === 'function') {
    window.closeExportModal = () => {
      return scriptFunctions.closeExportModal();
    };
  }

  // Area analysis modal (if exists)
  if (typeof scriptFunctions.closeAreaModal === 'function') {
    window.closeAreaModal = () => {
      return scriptFunctions.closeAreaModal();
    };
  }

  console.log('✅ Window bindings initialized - All HTML event handlers connected');
}

/**
 * Unbind all window functions (useful for cleanup or testing)
 */
// export function unbindWindowFunctions() {
//   const functionsToUnbind = [
//     // Widget Management
//     'toggleWidget',
//     // Attribute Table
//     'toggleAttributeTable', 'refreshTable', 'showExportOptions', 'previousPage', 'nextPage',
//     // Tour System
//     'manuallyStartTour', 'startAppTour', 'toggleFeatureTour', 'nextFeature', 'previousFeature', 'closeTourControls',
//     // Zoom Controls
//     'zoomIn', 'zoomOut',
//     // Analysis Tools
//     'startBufferAnalysis', 'setIntersectSource', 'startIntersectAnalysis', 'startDistanceAnalysis', 'startAreaAnalysis',
//     'executeBuffer', 'executeIntersect', 'setBufferSource', 'startBufferDrawing',
//     'closeBufferModal', 'closeIntersectModal',
//     // Visualization
//     'toggleHeatmap', 'showHeatmapSettings', 'closeHeatmapSettings', 'applyHeatmapSettings',
//     'toggleTimeControls', 'playTimeAnimation', 'stopTimeAnimation',
//     // Classification
//     'applyClassification', 'resetClassification',
//     // Measurement
//     'closeMeasurementResults', 'closeDistancePanel', 'clearDistanceMeasurement',
//     // Popup
//     'closeCustomPopup', 'zoomToFeature', 'copyFeatureInfo',
//     // Layer Management
//     'toggleLayer', 'zoomToLayer', 'removeLayer',
//     // Tab System
//     'redirectToTabPlatform',
//     // Drawing Tools
//     'clearAll',
//     // Additional
//     'toggleSwipe', 'clearSearch', 'startDrawingWithTool', 'updateClassificationField',
//     'updateHeatmapLayerSelect', 'searchTable', 'exportToCSV', 'exportToGeoJSON', 'exportToExcel',
//     'closeExportModal', 'closeAreaModal'
//   ];

//   functionsToUnbind.forEach(funcName => {
//     if (window[funcName]) {
//       delete window[funcName];
//     }
//   });

//   console.log('🧹 Window bindings cleaned up');
// }
