# Design Document

## Overview

This design outlines the modularization approach for the browser-based ArcGIS web application. The design focuses on incrementally breaking down the monolithic JavaScript file (8225+ lines) into logical ES6 modules while preserving all existing functionality. The approach prioritizes minimal disruption to the complex ArcGIS integrations and maintains the current CSS and HTML structure with only necessary component separation.

## Architecture

### Module Structure

The application will be restructured into the following module hierarchy:

```
js/
├── main.js                 # Entry point and module orchestration
├── core/
│   ├── map-manager.js      # Map initialization and core ArcGIS setup
│   ├── config.js           # Configuration constants and settings
│   └── utils.js            # Utility functions and helpers
├── ui/
│   ├── toolbar.js          # Main toolbar and mobile toolbar functionality
│   ├── search.js           # Search widget and address lookup
│   ├── panels.js           # Side panel management and templates
│   └── widgets.js          # Custom widgets (legend, bookmarks, print)
├── layers/
│   ├── layer-manager.js    # Layer loading, management, and visibility
│   ├── upload-handler.js   # File upload and GeoJSON processing
│   └── basemap-switcher.js # Basemap gallery and switching
├── tools/
│   ├── drawing-tools.js    # Sketch functionality and drawing controls
│   ├── analysis-tools.js   # Spatial analysis functions
│   ├── measurement.js      # Distance and area measurement
│   └── visualization.js    # Heatmap and time animation
├── features/
│   ├── popup-manager.js    # Custom popup and feature info display
│   ├── attribute-table.js  # Data table functionality
│   ├── tour-system.js      # Feature tour and navigation
│   └── classification.js   # Data classification and styling
└── events/
    ├── event-handlers.js   # Global event handling and coordination
    └── notifications.js    # Notification system and user feedback
```

### Module Dependencies

The modules will follow this dependency hierarchy to minimize coupling:

1. **Core Layer** (No dependencies on other modules)
   - `config.js` - Pure configuration
   - `utils.js` - Pure utility functions
   - `map-manager.js` - Depends only on ArcGIS API

2. **Foundation Layer** (Depends only on Core)
   - `event-handlers.js` - Event coordination
   - `notifications.js` - User feedback system

3. **Feature Layer** (Depends on Core + Foundation)
   - `layer-manager.js` - Layer operations
   - `popup-manager.js` - Feature information display
   - `panels.js` - UI panel management

4. **Tool Layer** (Depends on Core + Foundation + Feature)
   - `drawing-tools.js` - Drawing functionality
   - `analysis-tools.js` - Spatial analysis
   - `measurement.js` - Measurement tools
   - `visualization.js` - Data visualization

5. **Integration Layer** (Depends on all layers)
   - `main.js` - Application orchestration

## Components and Interfaces

### Core Components

#### Map Manager (`core/map-manager.js`)
```javascript
export class MapManager {
  constructor(config)
  async initializeMap()
  getView()
  getMap()
  addLayer(layer)
  removeLayer(layer)
}
```

#### Configuration (`core/config.js`)
```javascript
export const CONFIG = {
  ARCGIS_API_KEY: "...",
  DEFAULT_CENTER: [-95.7129, 37.0902],
  DEFAULT_ZOOM: 4,
  DEFAULT_BASEMAP: "hybrid"
}
```

#### Utilities (`core/utils.js`)
```javascript
export function loadModule(moduleName)
export function formatAttributeValue(value, key)
export function formatFieldName(key)
export function showNotification(message, type)
```

### UI Components

#### Toolbar Manager (`ui/toolbar.js`)
```javascript
export class ToolbarManager {
  constructor(mapManager, eventHandler)
  initializeDesktopToolbar()
  initializeMobileToolbar()
  toggleTool(toolName)
  setActiveButton(buttonId)
}
```

#### Panel Manager (`ui/panels.js`)
```javascript
export class PanelManager {
  constructor(eventHandler)
  openSidePanel(title, templateId)
  closeSidePanel()
  loadPanelTemplate(templateId)
  updatePanelContent(content)
}
```

#### Search Manager (`ui/search.js`)
```javascript
export class SearchManager {
  constructor(mapView, eventHandler)
  initializeSearch()
  handleSearchInput(query)
  showSuggestions(suggestions)
  clearSearch()
}
```

### Layer Components

#### Layer Manager (`layers/layer-manager.js`)
```javascript
export class LayerManager {
  constructor(map, eventHandler)
  addLayer(layer)
  removeLayer(layerId)
  toggleLayerVisibility(layerId)
  updateLayerList()
  getLayerById(id)
}
```

#### Upload Handler (`layers/upload-handler.js`)
```javascript
export class UploadHandler {
  constructor(layerManager, eventHandler)
  initializeDropZone()
  handleFileUpload(files)
  processGeoJSON(data, filename)
  processCSV(data, filename)
}
```

### Tool Components

#### Drawing Tools (`tools/drawing-tools.js`)
```javascript
export class DrawingTools {
  constructor(mapView, eventHandler)
  initializeSketch()
  setActiveTool(toolType)
  updateDrawingSettings(settings)
  clearDrawings()
}
```

#### Analysis Tools (`tools/analysis-tools.js`)
```javascript
export class AnalysisTools {
  constructor(mapView, layerManager, eventHandler)
  startBufferAnalysis()
  startIntersectAnalysis()
  calculateDistance(feature1, feature2)
  calculateArea(polygon)
}
```

## Data Models

### Application State
```javascript
const AppState = {
  map: null,
  view: null,
  layers: new Map(),
  activeTools: new Set(),
  currentPanel: null,
  tourActive: false,
  notifications: []
}
```

### Layer Information
```javascript
const LayerInfo = {
  id: string,
  title: string,
  layer: esri.Layer,
  visible: boolean,
  type: string, // 'geojson', 'feature', 'graphics'
  source: string // 'upload', 'default', 'service'
}
```

### Event Structure
```javascript
const AppEvent = {
  type: string,
  source: string,
  data: any,
  timestamp: Date
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

### Phase 1: Core Infrastructure
1. Extract configuration constants to `config.js`
2. Extract utility functions to `utils.js`
3. Create basic module loading system in `main.js`
4. Test core functionality

### Phase 2: Map Foundation
1. Extract map initialization to `map-manager.js`
2. Preserve all global variables temporarily
3. Update main.js to use MapManager
4. Verify map loads correctly

### Phase 3: UI Components
1. Extract toolbar functionality to `toolbar.js`
2. Extract panel management to `panels.js`
3. Extract search functionality to `search.js`
4. Test all UI interactions

### Phase 4: Layer Management
1. Extract layer operations to `layer-manager.js`
2. Extract file upload to `upload-handler.js`
3. Extract basemap switching to `basemap-switcher.js`
4. Test layer loading and management

### Phase 5: Tools and Features
1. Extract drawing tools to `drawing-tools.js`
2. Extract analysis tools to `analysis-tools.js`
3. Extract remaining features (popup, table, tour, etc.)
4. Test all tool functionality

### Phase 6: Integration and Cleanup
1. Remove global variable dependencies
2. Implement proper module interfaces
3. Clean up unused code
4. Final testing and optimization

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