/**
 * StateManager - Centralized state management for the GIS application
 *
 * This class replaces all global variables from script.js with a centralized state management system.
 * It provides getters and setters for all application state, ensuring controlled access and modification.
 *
 * Original global variables from script.js:
 * - displayMap, view, homeExtent
 * - uploadedLayers, drawLayer, countriesLayer, flashGraphicsLayer, tourLayer
 * - searchWidget, measurementWidget, sketchViewModel
 * - currentPopupFeature, activeNotifications
 * - featureTourActive, featureTourInterval, currentFeatureIndex, tourFeatures
 * - highlightHandle
 * - currentClassificationLayer, originalRenderers
 * - analysisDrawing, analysisDrawType, drawnFeatures
 * - countryInfoTimeout, activeDrawingTool
 */

export class StateManager {
  constructor() {
    // Core map objects
    this._map = null;
    this._view = null;
    this._homeExtent = null;

    // Layers
    this._uploadedLayers = [];
    this._drawLayer = null;
    this._countriesLayer = null;
    this._flashGraphicsLayer = null;
    this._tourLayer = null;

    // Widgets and tools
    this._searchWidget = null;
    this._measurementWidget = null;
    this._sketchViewModel = null;

    // Drawing state
    this._activeDrawingTool = null;

    // Popup state
    this._currentPopupFeature = null;

    // Notification state
    this._activeNotifications = [];

    // Tour state
    this._featureTourActive = false;
    this._featureTourInterval = null;
    this._currentFeatureIndex = 0;
    this._tourFeatures = [];
    this._highlightHandle = null;

    // Classification state
    this._currentClassificationLayer = null;
    this._originalRenderers = new Map();

    // Analysis state
    this._analysisDrawing = false;
    this._analysisDrawType = null;
    this._drawnFeatures = {
      buffer: [],
      intersect1: null,
      intersect2: null,
    };

    // Other state
    this._countryInfoTimeout = null;
  }

  // ==================== Map and View ====================

  getMap() {
    return this._map;
  }

  setMap(map) {
    this._map = map;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.displayMap = map;
    }
  }

  getView() {
    return this._view;
  }

  setView(view) {
    this._view = view;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.view = view;
    }
  }

  getHomeExtent() {
    return this._homeExtent;
  }

  setHomeExtent(extent) {
    this._homeExtent = extent;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.homeExtent = extent;
    }
  }

  // ==================== Layers ====================

  getUploadedLayers() {
    return this._uploadedLayers;
  }

  addUploadedLayer(layer) {
    this._uploadedLayers.push(layer);
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.uploadedLayers = this._uploadedLayers;
    }
  }

  removeUploadedLayer(index) {
    if (index >= 0 && index < this._uploadedLayers.length) {
      this._uploadedLayers.splice(index, 1);
      // Also update global for backward compatibility during transition
      if (typeof window !== "undefined") {
        window.uploadedLayers = this._uploadedLayers;
      }
    }
  }

  getDrawLayer() {
    return this._drawLayer;
  }

  setDrawLayer(layer) {
    this._drawLayer = layer;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.drawLayer = layer;
    }
  }

  getCountriesLayer() {
    return this._countriesLayer;
  }

  setCountriesLayer(layer) {
    this._countriesLayer = layer;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.countriesLayer = layer;
    }
  }

  getFlashGraphicsLayer() {
    return this._flashGraphicsLayer;
  }

  setFlashGraphicsLayer(layer) {
    this._flashGraphicsLayer = layer;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.flashGraphicsLayer = layer;
    }
  }

  getTourLayer() {
    return this._tourLayer;
  }

  setTourLayer(layer) {
    this._tourLayer = layer;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.tourLayer = layer;
    }
  }

  // ==================== Widgets and Tools ====================

  getSearchWidget() {
    return this._searchWidget;
  }

  setSearchWidget(widget) {
    this._searchWidget = widget;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.searchWidget = widget;
    }
  }

  getMeasurementWidget() {
    return this._measurementWidget;
  }

  setMeasurementWidget(widget) {
    this._measurementWidget = widget;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.measurementWidget = widget;
    }
  }

  getSketchViewModel() {
    return this._sketchViewModel;
  }

  setSketchViewModel(viewModel) {
    this._sketchViewModel = viewModel;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.sketchViewModel = viewModel;
    }
  }

  // ==================== Drawing State ====================

  getActiveDrawingTool() {
    return this._activeDrawingTool;
  }

  setActiveDrawingTool(tool) {
    this._activeDrawingTool = tool;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.activeDrawingTool = tool;
    }
  }

  // ==================== Popup State ====================

  getCurrentPopupFeature() {
    return this._currentPopupFeature;
  }

  setCurrentPopupFeature(feature) {
    this._currentPopupFeature = feature;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.currentPopupFeature = feature;
    }
  }

  // ==================== Notification State ====================

  getActiveNotifications() {
    return this._activeNotifications;
  }

  addNotification(notification) {
    this._activeNotifications.push(notification);
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.activeNotifications = this._activeNotifications;
    }
  }

  removeNotification(notificationId) {
    this._activeNotifications = this._activeNotifications.filter(
      (n) => n.id !== notificationId
    );
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.activeNotifications = this._activeNotifications;
    }
  }

  clearAllNotifications() {
    this._activeNotifications = [];
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.activeNotifications = this._activeNotifications;
    }
  }

  // ==================== Tour State ====================

  isFeatureTourActive() {
    return this._featureTourActive;
  }

  setFeatureTourActive(active) {
    this._featureTourActive = active;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.featureTourActive = active;
    }
  }

  getFeatureTourInterval() {
    return this._featureTourInterval;
  }

  setFeatureTourInterval(interval) {
    this._featureTourInterval = interval;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.featureTourInterval = interval;
    }
  }

  getCurrentFeatureIndex() {
    return this._currentFeatureIndex;
  }

  setCurrentFeatureIndex(index) {
    this._currentFeatureIndex = index;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.currentFeatureIndex = index;
    }
  }

  getTourFeatures() {
    return this._tourFeatures;
  }

  setTourFeatures(features) {
    this._tourFeatures = features;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.tourFeatures = features;
    }
  }

  getHighlightHandle() {
    return this._highlightHandle;
  }

  setHighlightHandle(handle) {
    this._highlightHandle = handle;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.highlightHandle = handle;
    }
  }





  // ==================== Classification State ====================

  getCurrentClassificationLayer() {
    return this._currentClassificationLayer;
  }

  setCurrentClassificationLayer(layer) {
    this._currentClassificationLayer = layer;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.currentClassificationLayer = layer;
    }
  }

  getOriginalRenderers() {
    return this._originalRenderers;
  }

  setOriginalRenderer(layerId, renderer) {
    this._originalRenderers.set(layerId, renderer);
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.originalRenderers = this._originalRenderers;
    }
  }

  getOriginalRenderer(layerId) {
    return this._originalRenderers.get(layerId);
  }

  clearOriginalRenderers() {
    this._originalRenderers.clear();
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.originalRenderers = this._originalRenderers;
    }
  }

  // ==================== Analysis State ====================

  isAnalysisDrawing() {
    return this._analysisDrawing;
  }

  setAnalysisDrawing(drawing) {
    this._analysisDrawing = drawing;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.analysisDrawing = drawing;
    }
  }

  getAnalysisDrawType() {
    return this._analysisDrawType;
  }

  setAnalysisDrawType(type) {
    this._analysisDrawType = type;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.analysisDrawType = type;
    }
  }

  getDrawnFeatures() {
    return this._drawnFeatures;
  }

  setDrawnFeatures(features) {
    this._drawnFeatures = features;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.drawnFeatures = features;
    }
  }

  addBufferFeature(feature) {
    this._drawnFeatures.buffer.push(feature);
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.drawnFeatures = this._drawnFeatures;
    }
  }

  setIntersectFeature1(feature) {
    this._drawnFeatures.intersect1 = feature;
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.drawnFeatures = this._drawnFeatures;
    }
  }

  setIntersectFeature2(feature) {
    this._drawnFeatures.intersect2 = feature;
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.drawnFeatures = this._drawnFeatures;
    }
  }

  clearDrawnFeatures() {
    this._drawnFeatures = {
      buffer: [],
      intersect1: null,
      intersect2: null,
    };
    // Also update global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.drawnFeatures = this._drawnFeatures;
    }
  }

  // ==================== Other State ====================

  getCountryInfoTimeout() {
    return this._countryInfoTimeout;
  }

  setCountryInfoTimeout(timeout) {
    this._countryInfoTimeout = timeout;
    // Also set global for backward compatibility during transition
    if (typeof window !== "undefined") {
      window.countryInfoTimeout = timeout;
    }
  }

  clearCountryInfoTimeout() {
    if (this._countryInfoTimeout) {
      clearTimeout(this._countryInfoTimeout);
      this._countryInfoTimeout = null;
      // Also clear global for backward compatibility during transition
      if (typeof window !== "undefined") {
        window.countryInfoTimeout = null;
      }
    }
  }

  // ==================== Utility Methods ====================

  /**
   * Reset all state to initial values
   * Useful for testing or reinitializing the application
   */
  reset() {
    this._map = null;
    this._view = null;
    this._homeExtent = null;
    this._uploadedLayers = [];
    this._drawLayer = null;
    this._countriesLayer = null;
    this._flashGraphicsLayer = null;
    this._tourLayer = null;
    this._searchWidget = null;
    this._measurementWidget = null;
    this._sketchViewModel = null;
    this._activeDrawingTool = null;
    this._currentPopupFeature = null;
    this._activeNotifications = [];
    this._featureTourActive = false;
    this._featureTourInterval = null;
    this._currentFeatureIndex = 0;
    this._tourFeatures = [];
    this._highlightHandle = null;
    this._currentClassificationLayer = null;
    this._originalRenderers.clear();
    this._analysisDrawing = false;
    this._analysisDrawType = null;
    this._drawnFeatures = {
      buffer: [],
      intersect1: null,
      intersect2: null,
    };
    this._countryInfoTimeout = null;
  }

  /**
   * Get a snapshot of all current state (for debugging)
   */
  getStateSnapshot() {
    return {
      hasMap: !!this._map,
      hasView: !!this._view,
      hasHomeExtent: !!this._homeExtent,
      uploadedLayersCount: this._uploadedLayers.length,
      hasDrawLayer: !!this._drawLayer,
      hasCountriesLayer: !!this._countriesLayer,
      hasFlashGraphicsLayer: !!this._flashGraphicsLayer,
      hasTourLayer: !!this._tourLayer,
      hasSearchWidget: !!this._searchWidget,
      hasMeasurementWidget: !!this._measurementWidget,
      hasSketchViewModel: !!this._sketchViewModel,
      activeDrawingTool: this._activeDrawingTool,
      hasCurrentPopupFeature: !!this._currentPopupFeature,
      activeNotificationsCount: this._activeNotifications.length,
      featureTourActive: this._featureTourActive,
      tourFeaturesCount: this._tourFeatures.length,
      currentFeatureIndex: this._currentFeatureIndex,
      hasCurrentClassificationLayer: !!this._currentClassificationLayer,
      originalRenderersCount: this._originalRenderers.size,
      analysisDrawing: this._analysisDrawing,
      analysisDrawType: this._analysisDrawType,
      drawnFeaturesBufferCount: this._drawnFeatures.buffer.length,
      hasIntersectFeature1: !!this._drawnFeatures.intersect1,
      hasIntersectFeature2: !!this._drawnFeatures.intersect2,
    };
  }
}
