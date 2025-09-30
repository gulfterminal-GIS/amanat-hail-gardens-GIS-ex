# Design Document

## Overview

This design outlines the modularization approach for the browser-based ArcGIS web application. The design focuses on first converting script.js to an ES6 module, then incrementally extracting specialized functionality into separate modules that import from the main script module. This approach preserves all existing functionality and complex ArcGIS integrations while enabling proper modular architecture. The approach prioritizes minimal disruption and maintains the current CSS and HTML structure.

## Architecture

### Module Structure

The application will be restructured using a **script.js-as-core-module approach** that converts script.js to ES6 module first, then extracts specialized modules:

```
js/
├── main.js                 # Entry point and module orchestration
├── script.js               # Core ES6 module with all main functionality (converted first)
├── core/
│   └── config.js           # Configuration constants and settings
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
├── events/
│   ├── event-handlers.js   # Global event handling and coordination
│   └── notifications.js    # Notification system and user feedback
└── utils/
    └── utils.js            # Utility functions (extracted LAST after all modules)
```

**Key Design Principles:**
- **script.js becomes the core ES6 module** with export statements for functions needed by other modules
- **All global variables remain in script.js** - no globalization to window object
- **Other modules import specific functions** from script.js rather than accessing globals
- **No duplication of functions** - single source of truth in script.js

### Module Dependencies and Refactoring Strategy

The modules will follow this **script.js-as-core-module approach** to minimize breaking changes:

1. **Phase 1: Core Module Conversion**
   - Convert `script.js` to ES6 module with export statements
   - Create `config.js` with configuration constants
   - Update `main.js` to import and initialize script.js module
   - Verify all functionality works with script.js as ES6 module

2. **Phase 2: UI Components** (Import from script.js)
   - `toolbar.js` - Imports toolbar functions from script.js
   - `panels.js` - Imports panel functions from script.js
   - `search.js` - Imports search functions from script.js

3. **Phase 3: Layer Management** (Import from script.js)
   - `layer-manager.js` - Imports layer functions from script.js
   - `upload-handler.js` - Imports file upload functions from script.js
   - `basemap-switcher.js` - Imports basemap functions from script.js

4. **Phase 4: Tools and Features** (Import from script.js)
   - `drawing-tools.js` - Imports drawing functions from script.js
   - `analysis-tools.js` - Imports analysis functions from script.js
   - `measurement.js` - Imports measurement functions from script.js
   - `visualization.js` - Imports visualization functions from script.js
   - `popup-manager.js` - Imports popup functions from script.js
   - `attribute-table.js` - Imports table functions from script.js
   - `tour-system.js` - Imports tour functions from script.js
   - `classification.js` - Imports classification functions from script.js

5. **Phase 5: Event System** (Import from script.js)
   - `event-handlers.js` - Imports event functions from script.js
   - `notifications.js` - Imports notification functions from script.js

6. **Phase 6: Final Cleanup** (Optional - only if needed)
   - Extract utility functions to `utils.js` if desired
   - Keep script.js as the main module or refactor further as needed

**Transition Strategy:**
- script.js becomes an ES6 module but retains all its internal structure
- Other modules import specific functions from script.js
- No global variables are created - everything stays within module scope
- Each extraction step maintains the working application

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

#### Script.js as Core Module

script.js will be converted to an ES6 module with export statements:

```javascript
// script.js as ES6 module
export { loadModule, initializeMap, initializeUI, initializeEventHandlers };
export { openSidePanel, closeSidePanel, showNotification };
export { loadGeoJSON, loadCSV, handleFiles };
export { startDrawingWithTool, clearAll, toggleLayer };
// ... other functions as needed

// All global variables remain within script.js module scope
var displayMap;
let view;
let uploadedLayers = [];
// ... other variables
```

#### Module Import Pattern

Other modules will import specific functions from script.js:

```javascript
// Example: ui/toolbar.js
import { openSidePanel, showNotification } from '../script.js';

export class ToolbarManager {
  constructor() {
    // Use imported functions directly
  }
  
  handleUploadClick() {
    openSidePanel("Upload Files", "uploadPanelTemplate");
  }
}
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