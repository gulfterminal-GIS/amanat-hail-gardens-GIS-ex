# Design Document

## Overview

This design outlines the modularization approach for the browser-based ArcGIS web application. The design focuses on first converting script.js to an ES6 module, then incrementally extracting specialized functionality into separate modules that import from the main script module. This approach preserves all existing functionality and complex ArcGIS integrations while enabling proper modular architecture. The approach prioritizes minimal disruption and maintains the current CSS and HTML structure.

## Architecture

### Module Structure

The application will be restructured using a **script.js-as-core-module approach** that converts script.js to ES6 module first, then extracts specialized modules:

```
js/
├── main.js                      # Entry point and module orchestration
├── script.js                    # Core ES6 module (converted first, gradually emptied)
├── core/
│   ├── config.js                # ✅ Configuration constants and settings
│   ├── state-manager.js         # Global state management (all global variables)
│   ├── map-initializer.js       # Map setup, ArcGIS config, loading screen
│   └── module-loader.js         # ArcGIS module loading utility wrapper
├── ui/
│   ├── notification-manager.js  # Toast notifications (EXTRACT FIRST - used by all)
│   ├── panel-manager.js         # Side panel system (openSidePanel, closeSidePanel)
│   ├── toolbar-manager.js       # Desktop & mobile toolbar functionality
│   ├── tab-system.js            # Platform integration tabs (Gardens, Projects, etc.)
│   └── search-manager.js        # Search widget and address lookup
├── layers/
│   ├── layer-manager.js         # Layer CRUD, visibility, zoom, layer list UI
│   ├── upload-handler.js        # File upload (CSV/GeoJSON) processing
│   └── basemap-manager.js       # Basemap gallery and switching
├── tools/
│   ├── drawing-manager.js       # Sketch tools, symbology, drawing controls
│   ├── analysis-manager.js      # Buffer, intersect, distance, area analysis
│   ├── measurement-manager.js   # Distance and area measurement tools
│   └── visualization-manager.js # Heatmap and time animation
├── features/
│   ├── popup-manager.js         # Custom popups and feature info display
│   ├── attribute-table.js       # Data grid with search, pagination, export
│   ├── tour-manager.js          # Feature tour system with auto-play
│   ├── classification-manager.js # Data classification and styling
│   └── country-info.js          # Country click feature and flash animation
├── widgets/
│   ├── widget-manager.js        # Widget lifecycle and positioning
│   ├── legend-widget.js         # Legend widget
│   ├── bookmarks-widget.js      # Bookmarks widget
│   └── print-widget.js          # Print widget
├── events/
│   ├── map-event-handler.js     # Map click, pointer-move, feature selection
│   └── coordinate-display.js    # Coordinate tracking and display
└── utils/
    ├── format-utils.js          # Formatting helpers (dates, numbers, attributes)
    ├── geometry-utils.js        # Geometry calculations and conversions
    └── export-utils.js          # CSV/GeoJSON/Excel export utilities
```

**Key Design Principles:**
- **script.js is converted to ES6 module** to enable the transition
- **Functionality is extracted incrementally** and original code is commented out in script.js
- **Dependencies are carefully managed** - extract foundation modules first (state, notifications)
- **Global state is centralized** in state-manager.js instead of scattered variables
- **Each module is self-contained** with clear responsibilities and minimal coupling
- **Commented code remains** in script.js until entire refactoring is complete

### Module Dependencies and Refactoring Strategy

The modules will follow this **script.js-as-core-module approach** to minimize breaking changes:

1. **Phase 1: Foundation Setup** (Core infrastructure)
   - ✅ Convert `script.js` to ES6 module with export statements
   - ✅ Create `config.js` with configuration constants
   - ✅ Update `main.js` to import and initialize script.js module
   - Create `state-manager.js` to centralize all global variables
   - Create `module-loader.js` to wrap ArcGIS module loading
   - Verify all functionality works with script.js as ES6 module

2. **Phase 2: Core Services** (Foundation modules used by everything)
   - `notification-manager.js` - Extract notification system (used by all modules)
   - `map-initializer.js` - Extract map initialization and loading screen
   - Update state-manager to provide access to map, view, and core state

3. **Phase 3: UI Foundation** (Panel system and basic UI)
   - `panel-manager.js` - Extract side panel system (openSidePanel, closeSidePanel)
   - `toolbar-manager.js` - Extract desktop and mobile toolbar
   - `tab-system.js` - Extract platform integration tabs
   - `search-manager.js` - Extract search functionality

4. **Phase 4: Layer Management** (Data loading and management)
   - `layer-manager.js` - Extract layer CRUD, visibility, layer list UI
   - `upload-handler.js` - Extract file upload (CSV/GeoJSON) processing
   - `basemap-manager.js` - Extract basemap switching

5. **Phase 5: Drawing and Analysis Tools**
   - `drawing-manager.js` - Extract sketch tools and symbology
   - `analysis-manager.js` - Extract buffer, intersect, distance, area
   - `measurement-manager.js` - Extract measurement tools
   - `visualization-manager.js` - Extract heatmap and time animation

6. **Phase 6: Feature Management**
   - `popup-manager.js` - Extract custom popups and feature info
   - `attribute-table.js` - Extract data grid with all features
   - `classification-manager.js` - Extract data classification
   - `tour-manager.js` - Extract feature tour system
   - `country-info.js` - Extract country click feature

7. **Phase 7: Widgets and Events**
   - `widget-manager.js` - Extract widget lifecycle management
   - `legend-widget.js`, `bookmarks-widget.js`, `print-widget.js` - Extract widgets
   - `map-event-handler.js` - Extract map event handling
   - `coordinate-display.js` - Extract coordinate tracking

8. **Phase 8: Utilities and Cleanup**
   - `format-utils.js` - Extract formatting helpers
   - `geometry-utils.js` - Extract geometry calculations
   - `export-utils.js` - Extract export functionality
   - Remove all commented code from script.js
   - Optionally delete script.js entirely
   - Final testing and optimization

**Transition Strategy:**
- script.js becomes an ES6 module but retains all its internal structure
- When functionality is extracted to new modules, the original code in script.js is commented out (not deleted)
- Other modules import specific functions from script.js initially, then transition to use the new modules
- No global variables are created - everything stays within module scope
- Each extraction step maintains the working application
- Original script.js code remains commented until the entire refactoring is complete

## Components and Interfaces

### Core Components

#### Configuration (`core/config.js`)
```javascript
export const CONFIG = {
  ARCGIS_API_KEY: "...",
  DEFAULT_CENTER: [-95.7129, 37.0902],
  DEFAULT_ZOOM: 4,
  DEFAULT_BASEMAP: "hybrid",
  // ... all configuration constants
}
```

#### State Manager (`core/state-manager.js`)
```javascript
// Centralized state management for all global variables
export class StateManager {
  constructor()
  
  // Map and view
  getMap()
  setMap(map)
  getView()
  setView(view)
  
  // Layers
  getUploadedLayers()
  addUploadedLayer(layer)
  removeUploadedLayer(index)
  
  // Drawing state
  getDrawLayer()
  setDrawLayer(layer)
  getSketchViewModel()
  setSketchViewModel(vm)
  
  // Tour state
  getTourState()
  setTourState(state)
  
  // Other state getters/setters
  // Replaces all global variables from script.js
}
```

#### Map Initializer (`core/map-initializer.js`)
```javascript
export class MapInitializer {
  constructor(stateManager, config)
  async initializeMap()
  async loadDefaultGeoJSON()
  async initializeCountriesLayer()
  showLoadingScreen()
  hideLoadingScreen()
}
```

#### Module Loader (`core/module-loader.js`)
```javascript
// Wrapper for ArcGIS module loading
export async function loadModule(moduleName)
export async function loadModules(moduleNames)
```

### UI Components

#### Notification Manager (`ui/notification-manager.js`)
```javascript
// EXTRACT FIRST - Used by all other modules
export class NotificationManager {
  constructor()
  showNotification(message, type = 'info')
  clearNotification(notificationId)
  clearAllNotifications()
}
```

#### Panel Manager (`ui/panel-manager.js`)
```javascript
export class PanelManager {
  constructor(stateManager, notificationManager)
  openSidePanel(title, templateId)
  closeSidePanel()
  clearToolbarActiveStates()
  loadPanelTemplate(templateId)
  initializeUploadPanel()
  initializeBasemapPanel()
}
```

#### Toolbar Manager (`ui/toolbar-manager.js`)
```javascript
export class ToolbarManager {
  constructor(stateManager, panelManager, notificationManager)
  initializeDesktopToolbar()
  initializeMobileToolbar()
  setActiveButton(buttonId)
  handleToolbarAction(action)
}
```

#### Tab System (`ui/tab-system.js`)
```javascript
export class TabSystem {
  constructor(notificationManager)
  initializeMapTabs()
  redirectToTabPlatform(tabType)
  showTabContent(tabType)
}
```

#### Search Manager (`ui/search-manager.js`)
```javascript
export class SearchManager {
  constructor(stateManager, notificationManager)
  initializeSearch()
  initializeCoordinateDisplay()
  handleSearchInput(query)
  showSuggestions(suggestions)
  clearSearch()
}
```

### Layer Components

#### Layer Manager (`layers/layer-manager.js`)
```javascript
export class LayerManager {
  constructor(stateManager, notificationManager)
  addLayer(layer)
  removeLayer(index)
  toggleLayer(index)
  zoomToLayer(index)
  updateLayerList()
  getLayerById(id)
  getUploadedLayers()
}
```

#### Upload Handler (`layers/upload-handler.js`)
```javascript
export class UploadHandler {
  constructor(stateManager, layerManager, notificationManager)
  initializeFileUpload()
  initializeDropZone()
  handleFiles(files)
  loadGeoJSON(content, filename)
  loadCSV(content, filename)
  parseCSVLine(line)
}
```

#### Basemap Manager (`layers/basemap-manager.js`)
```javascript
export class BasemapManager {
  constructor(stateManager, notificationManager)
  initializeBasemapGallery()
  switchBasemap(basemapId)
  getCurrentBasemap()
}
```

### Tool Components

#### Drawing Manager (`tools/drawing-manager.js`)
```javascript
export class DrawingManager {
  constructor(stateManager, notificationManager)
  initializeSketchViewModel()
  initializeDrawingPanel()
  initializeDrawingToolButtons()
  startDrawingWithTool(tool)
  applyCustomSymbology(graphic)
  updateActiveGraphicsSymbology()
  clearAll()
  stopDrawing()
}
```

#### Analysis Manager (`tools/analysis-manager.js`)
```javascript
export class AnalysisManager {
  constructor(stateManager, notificationManager)
  startBufferAnalysis()
  startIntersectAnalysis()
  startDistanceAnalysis()
  startAreaAnalysis()
  performBuffer(geometry, distance, unit)
  performIntersect(geometry1, geometry2)
  calculateDistance(feature1, feature2)
  calculateArea(polygon)
}
```

#### Measurement Manager (`tools/measurement-manager.js`)
```javascript
export class MeasurementManager {
  constructor(stateManager, notificationManager)
  toggleMeasurement()
  updateMeasurementResults(measurement)
  closeMeasurementResults()
  closeDistancePanel()
  clearDistanceMeasurement()
}
```

#### Visualization Manager (`tools/visualization-manager.js`)
```javascript
export class VisualizationManager {
  constructor(stateManager, notificationManager)
  toggleHeatmap()
  updateHeatmapLayerSelect()
  showHeatmapSettings()
  closeHeatmapSettings()
  initializeHeatmapSliders()
  applyHeatmap(layer, settings)
  toggleTimeControls()
  playTimeAnimation()
  stopTimeAnimation()
}
```

### Feature Components

#### Popup Manager (`features/popup-manager.js`)
```javascript
export class PopupManager {
  constructor(stateManager, notificationManager)
  showCustomPopup(graphic, mapPoint)
  showCustomPopupTour(graphic)
  closeCustomPopup()
  updateGeometryDetails(geometry)
  zoomToFeature()
  copyFeatureInfo()
}
```

#### Attribute Table (`features/attribute-table.js`)
```javascript
export class AttributeTable {
  constructor(stateManager, notificationManager)
  toggleAttributeTable()
  initializeTableLayerSelect()
  loadTableData(layerIndex)
  renderTable()
  searchTable(query)
  updatePagination()
  nextPage()
  previousPage()
  showExportOptions()
  exportData(format)
  showTableStatistics()
}
```

#### Tour Manager (`features/tour-manager.js`)
```javascript
export class TourManager {
  constructor(stateManager, notificationManager, popupManager)
  setupFeatureTour(layer)
  createTourControls()
  startFeatureTour()
  stopFeatureTour()
  toggleFeatureTour()
  goToFeature(index)
  nextFeature()
  previousFeature()
  updateTourInfo(feature)
  closeTourControls()
  manuallyStartTour()
}
```

#### Classification Manager (`features/classification-manager.js`)
```javascript
export class ClassificationManager {
  constructor(stateManager, notificationManager)
  initializeClassificationPanel()
  analyzeFieldForClassification(layer, field)
  applyClassification()
  resetClassification()
  showClassificationStatistics(stats)
  generateClassificationColors(count)
  autoApplyDefaultClassification(layer, fieldName)
}
```

#### Country Info (`features/country-info.js`)
```javascript
export class CountryInfo {
  constructor(stateManager, notificationManager)
  initializeCountriesLayer()
  showCountryInfo(countryName, details)
  hideCountryInfo()
  flashCountryBoundary(geometry)
}
```

### Widget Components

#### Widget Manager (`widgets/widget-manager.js`)
```javascript
export class WidgetManager {
  constructor(stateManager, notificationManager)
  toggleWidget(widgetName)
  showWidget(widgetName)
  hideWidget(widgetName)
  positionWidget(widgetName, position)
}
```

#### Legend Widget (`widgets/legend-widget.js`)
```javascript
export class LegendWidget {
  constructor(stateManager)
  initialize()
  updateLegend()
  createClassificationLegend(stats, colors, fieldName)
}
```

#### Bookmarks Widget (`widgets/bookmarks-widget.js`)
```javascript
export class BookmarksWidget {
  constructor(stateManager, notificationManager)
  initialize()
  addBookmark()
  goToBookmark(bookmarkId)
  deleteBookmark(bookmarkId)
}
```

#### Print Widget (`widgets/print-widget.js`)
```javascript
export class PrintWidget {
  constructor(stateManager)
  initialize()
  printMap(options)
}
```

### Event Components

#### Map Event Handler (`events/map-event-handler.js`)
```javascript
export class MapEventHandler {
  constructor(stateManager, popupManager, notificationManager)
  initializeEventHandlers()
  handleMapClick(event)
  handlePointerMove(event)
  handleFeatureClick(graphic, mapPoint)
}
```

#### Coordinate Display (`events/coordinate-display.js`)
```javascript
export class CoordinateDisplay {
  constructor(stateManager)
  initializeCoordinateDisplay()
  updateCoordinates(lat, lon)
  copyCoordinates()
  formatCoordinates(lat, lon, format)
}
```

### Utility Components

#### Format Utils (`utils/format-utils.js`)
```javascript
export function formatAttributeValue(value, key)
export function formatFieldName(fieldName)
export function formatCoordinates(lat, lon, format)
export function formatDate(date)
export function formatNumber(number, decimals)
```

#### Geometry Utils (`utils/geometry-utils.js`)
```javascript
export async function calculateArea(geometry)
export async function calculateLength(geometry)
export async function bufferGeometry(geometry, distance, unit)
export async function intersectGeometries(geometry1, geometry2)
export function getGeometryCenter(geometry)
```

#### Export Utils (`utils/export-utils.js`)
```javascript
export function exportToCSV(features, filename)
export function exportToGeoJSON(features, filename)
export function exportToExcel(features, filename)
export function downloadFile(content, filename, mimeType)
```

## Data Models

### Application State (Managed by StateManager)
```javascript
// All global variables centralized in StateManager
{
  // Core map objects
  map: esri.Map,
  view: esri.MapView,
  homeExtent: esri.Extent,
  
  // Layers
  uploadedLayers: Array<esri.Layer>,
  drawLayer: esri.GraphicsLayer,
  countriesLayer: esri.FeatureLayer,
  flashGraphicsLayer: esri.GraphicsLayer,
  tourLayer: esri.Layer,
  
  // Widgets and tools
  searchWidget: esri.Search,
  sketchViewModel: esri.SketchViewModel,
  measurementWidget: esri.Measurement,
  
  // Drawing state
  activeDrawingTool: string,
  
  // Tour state
  featureTourActive: boolean,
  featureTourInterval: number,
  currentFeatureIndex: number,
  tourFeatures: Array<esri.Graphic>,
  highlightHandle: esri.Handle,
  
  // Analysis state
  analysisDrawing: boolean,
  analysisDrawType: string,
  drawnFeatures: Object,
  
  // Classification state
  currentClassificationLayer: esri.Layer,
  originalRenderers: Map,
  
  // UI state
  currentPopupFeature: esri.Graphic,
  activeNotifications: Array,
  countryInfoTimeout: number
}
```

## Error Handling

### Error Categories
1. **ArcGIS API Errors** - Module loading, map initialization failures
2. **File Processing Errors** - Invalid file formats, parsing failures  
3. **Network Errors** - Service unavailability, timeout issues
4. **User Input Errors** - Invalid coordinates, malformed queries
5. **Browser Compatibility** - Feature support, API availability

### Error Handling Strategy
```javascript
// Centralized error handling in utils.js
export function handleError(error, context) {
  console.error(`Error in ${context}:`, error);
  
  const userMessage = getUserFriendlyMessage(error);
  showNotification(userMessage, 'error');
  
  // Log to analytics if available
  if (window.analytics) {
    window.analytics.track('error', { context, error: error.message });
  }
}

function getUserFriendlyMessage(error) {
  if (error.name === 'NetworkError') {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (error.message.includes('ArcGIS')) {
    return 'Map service temporarily unavailable. Please try again.';
  }
  return 'An unexpected error occurred. Please refresh the page.';
}
```

## Testing Strategy

### Module Testing Approach
1. **Unit Testing** - Test individual module functions in isolation
2. **Integration Testing** - Test module interactions and data flow
3. **Browser Testing** - Verify compatibility across target browsers
4. **Regression Testing** - Ensure existing functionality remains intact

### Testing Phases
1. **Phase 1** - Test core modules (config, utils, map-manager)
2. **Phase 2** - Test UI modules (toolbar, panels, search)
3. **Phase 3** - Test layer modules (layer-manager, upload-handler)
4. **Phase 4** - Test tool modules (drawing, analysis, measurement)
5. **Phase 5** - Test integration and full application flow

### Test Environment Setup
```html
<!-- Test runner setup -->
<script type="module">
  import { runTests } from './tests/test-runner.js';
  import { MapManagerTests } from './tests/core/map-manager.test.js';
  import { UtilsTests } from './tests/core/utils.test.js';
  
  runTests([
    MapManagerTests,
    UtilsTests
    // Additional test suites
  ]);
</script>
```

## Migration Strategy

### Phase 1: Convert script.js to ES6 Module
1. Add export statements to script.js for all functions that will be used by other modules
2. Create `config.js` with configuration constants
3. Update `main.js` to import script.js as a module and call its initialization functions
4. Test that all functionality works with script.js as an ES6 module

### Phase 2: Extract UI Components
1. Create `toolbar.js` that imports toolbar-related functions from script.js
2. Create `panels.js` that imports panel-related functions from script.js
3. Create `search.js` that imports search-related functions from script.js
4. Test all UI interactions work with the new module structure

### Phase 3: Extract Layer Management
1. Create `layer-manager.js` that imports layer-related functions from script.js
2. Create `upload-handler.js` that imports file upload functions from script.js
3. Create `basemap-switcher.js` that imports basemap functions from script.js
4. Test layer loading and management functionality

### Phase 4: Extract Tools and Features
1. Create drawing, analysis, measurement, and visualization modules
2. Create popup, table, tour, and classification modules
3. Each module imports required functions from script.js
4. Test all tool functionality

### Phase 5: Extract Event System
1. Create `event-handlers.js` that imports event-related functions from script.js
2. Create `notifications.js` that imports notification functions from script.js
3. Test event handling and notifications

### Phase 6: Optional Cleanup
1. Optionally extract utility functions to `utils.js` if desired
2. Keep script.js as the core module or refactor further based on needs
3. Final testing and optimization

## Browser Compatibility

### Target Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### ES6 Module Support
All target browsers support ES6 modules natively, eliminating the need for transpilation or bundling.

### Fallback Strategy
```javascript
// Feature detection for ES6 modules
if (!('noModule' in HTMLScriptElement.prototype)) {
  // Load legacy version for older browsers
  document.write('<script src="js/legacy/app-legacy.js"><\/script>');
} else {
  // Load modern ES6 modules
  import('./js/main.js');
}
```

## Performance Considerations

### Module Loading
- Use dynamic imports for non-critical modules
- Implement lazy loading for tool modules
- Preload critical path modules

### Memory Management
- Properly dispose of ArcGIS objects
- Remove event listeners when modules are unloaded
- Clear graphics and layers when not needed

### Code Splitting Strategy
```javascript
// Lazy load analysis tools only when needed
async function loadAnalysisTools() {
  const { AnalysisTools } = await import('./tools/analysis-tools.js');
  return new AnalysisTools(view, layerManager, eventHandler);
}
```