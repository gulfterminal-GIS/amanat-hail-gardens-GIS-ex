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
    // Future managers will be added here as they're created:
    // uploadHandler,
    // basemapManager,
    // drawingManager,
    // analysisManager,
    // measurementManager,
    // visualizationManager,
    // popupManager,
    // attributeTable,
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

  // ============================================================================
  // ATTRIBUTE TABLE
  // Future module: js/features/attribute-table.js
  // ============================================================================
  
  window.toggleAttributeTable = () => {
    return scriptFunctions.toggleAttributeTable();
  };

  window.refreshTable = () => {
    return scriptFunctions.refreshTable();
  };

  window.showExportOptions = () => {
    return scriptFunctions.showExportOptions();
  };

  window.previousPage = () => {
    return scriptFunctions.previousPage();
  };

  window.nextPage = () => {
    return scriptFunctions.nextPage();
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
  // Future module: js/tools/analysis-manager.js
  // ============================================================================
  
  window.startBufferAnalysis = () => {
    return scriptFunctions.startBufferAnalysis();
  };

  window.startIntersectAnalysis = () => {
    return scriptFunctions.startIntersectAnalysis();
  };

  window.startDistanceAnalysis = () => {
    return scriptFunctions.startDistanceAnalysis();
  };

  window.startAreaAnalysis = () => {
    return scriptFunctions.startAreaAnalysis();
  };

  window.executeBuffer = () => {
    return scriptFunctions.executeBuffer();
  };

  window.executeIntersection = () => {
    return scriptFunctions.executeIntersection();
  };

  window.setBufferSource = (source) => {
    return scriptFunctions.setBufferSource(source);
  };

  window.startBufferDrawing = (tool) => {
    return scriptFunctions.startBufferDrawing(tool);
  };

  window.closeBufferModal = () => {
    return scriptFunctions.closeBufferModal();
  };

  window.closeIntersectModal = () => {
    return scriptFunctions.closeIntersectModal();
  };

  // ============================================================================
  // VISUALIZATION
  // Future module: js/tools/visualization-manager.js
  // ============================================================================
  
  window.toggleHeatmap = () => {
    return scriptFunctions.toggleHeatmap();
  };

  window.showHeatmapSettings = () => {
    return scriptFunctions.showHeatmapSettings();
  };

  window.closeHeatmapSettings = () => {
    return scriptFunctions.closeHeatmapSettings();
  };

  window.applyHeatmapSettings = () => {
    return scriptFunctions.applyHeatmapSettings();
  };

  window.toggleTimeControls = () => {
    return scriptFunctions.toggleTimeControls();
  };

  window.playTimeAnimation = () => {
    return scriptFunctions.playTimeAnimation();
  };

  window.stopTimeAnimation = () => {
    return scriptFunctions.stopTimeAnimation();
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
  // Future module: js/tools/measurement-manager.js
  // ============================================================================
  
  window.closeMeasurementResults = () => {
    return scriptFunctions.closeMeasurementResults();
  };

  window.closeDistancePanel = () => {
    return scriptFunctions.closeDistancePanel();
  };

  window.clearDistanceMeasurement = () => {
    return scriptFunctions.clearDistanceMeasurement();
  };

  // ============================================================================
  // POPUP
  // Future module: js/features/popup-manager.js
  // ============================================================================
  
  window.closeCustomPopup = () => {
    return scriptFunctions.closeCustomPopup();
  };

  window.zoomToFeature = () => {
    return scriptFunctions.zoomToFeature();
  };

  window.copyFeatureInfo = () => {
    return scriptFunctions.copyFeatureInfo();
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
  // Future module: js/tools/drawing-manager.js
  // ============================================================================
  
  window.clearAll = () => {
    return scriptFunctions.clearAll();
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

  // Drawing tool functions (if exists)
  if (typeof scriptFunctions.startDrawingWithTool === 'function') {
    window.startDrawingWithTool = (tool) => {
      return scriptFunctions.startDrawingWithTool(tool);
    };
  }

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
export function unbindWindowFunctions() {
  const functionsToUnbind = [
    // Widget Management
    'toggleWidget',
    // Attribute Table
    'toggleAttributeTable', 'refreshTable', 'showExportOptions', 'previousPage', 'nextPage',
    // Tour System
    'manuallyStartTour', 'startAppTour', 'toggleFeatureTour', 'nextFeature', 'previousFeature', 'closeTourControls',
    // Zoom Controls
    'zoomIn', 'zoomOut',
    // Analysis Tools
    'startBufferAnalysis', 'startIntersectAnalysis', 'startDistanceAnalysis', 'startAreaAnalysis',
    'executeBuffer', 'executeIntersect', 'setBufferSource', 'startBufferDrawing',
    'closeBufferModal', 'closeIntersectModal',
    // Visualization
    'toggleHeatmap', 'showHeatmapSettings', 'closeHeatmapSettings', 'applyHeatmapSettings',
    'toggleTimeControls', 'playTimeAnimation', 'stopTimeAnimation',
    // Classification
    'applyClassification', 'resetClassification',
    // Measurement
    'closeMeasurementResults', 'closeDistancePanel', 'clearDistanceMeasurement',
    // Popup
    'closeCustomPopup', 'zoomToFeature', 'copyFeatureInfo',
    // Layer Management
    'toggleLayer', 'zoomToLayer', 'removeLayer',
    // Tab System
    'redirectToTabPlatform',
    // Drawing Tools
    'clearAll',
    // Additional
    'toggleSwipe', 'clearSearch', 'startDrawingWithTool', 'updateClassificationField',
    'updateHeatmapLayerSelect', 'searchTable', 'exportToCSV', 'exportToGeoJSON', 'exportToExcel',
    'closeExportModal', 'closeAreaModal'
  ];

  functionsToUnbind.forEach(funcName => {
    if (window[funcName]) {
      delete window[funcName];
    }
  });

  console.log('🧹 Window bindings cleaned up');
}
