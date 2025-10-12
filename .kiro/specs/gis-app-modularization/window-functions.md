# Window-Exposed Functions

This document lists all functions that must be exposed on the `window` object because they are called from HTML inline event handlers (onclick, onchange, etc.).

## Why Window Exposure is Needed

HTML inline event handlers like `onclick="functionName()"` look for functions in the global scope (window object). When we modularize the code, functions are no longer global by default, so we must explicitly expose them.

## Functions to Expose

### Widget Management
- `toggleWidget(name)` - Toggle widget visibility (legend, bookmarks, print, home, fullscreen)
- Called from: Multiple toolbar buttons and quick actions

### Attribute Table
- `toggleAttributeTable()` - Toggle attribute table visibility
- `refreshTable()` - Refresh table data
- `showExportOptions()` - Show export modal
- `previousPage()` - Navigate to previous page
- `nextPage()` - Navigate to next page
- Called from: Toolbar buttons and table controls

### Tour System
- `manuallyStartTour()` - Manually start feature tour
- `startAppTour()` - Start application tour
- `toggleFeatureTour()` - Toggle tour play/pause
- `nextFeature()` - Navigate to next feature
- `previousFeature()` - Navigate to previous feature
- `closeTourControls()` - Close tour controls
- Called from: Quick actions and tour controls

### Zoom Controls
- `zoomIn()` - Zoom in on map
- `zoomOut()` - Zoom out on map
- Called from: Quick action buttons

### Analysis Tools
- `startBufferAnalysis()` - Start buffer analysis
- `startIntersectAnalysis()` - Start intersection analysis
- `startDistanceAnalysis()` - Start distance analysis
- `startAreaAnalysis()` - Start area analysis
- `executeBuffer()` - Execute buffer operation
- `executeIntersection()` - Execute intersection operation
- `setBufferSource(source)` - Set buffer source (layer/draw)
- `startBufferDrawing(tool)` - Start drawing for buffer
- `closeBufferModal()` - Close buffer modal
- `closeIntersectModal()` - Close intersection modal
- Called from: Analysis panel and modals

### Visualization
- `toggleHeatmap()` - Toggle heatmap visualization
- `showHeatmapSettings()` - Show heatmap settings modal
- `closeHeatmapSettings()` - Close heatmap settings modal
- `applyHeatmapSettings()` - Apply heatmap settings
- `toggleTimeControls()` - Toggle time animation controls
- `playTimeAnimation()` - Play time animation
- `stopTimeAnimation()` - Stop time animation
- Called from: Visualization panel

### Classification
- `applyClassification()` - Apply data classification
- `resetClassification()` - Reset classification
- Called from: Classification panel

### Measurement
- `closeMeasurementResults()` - Close measurement results widget
- `closeDistancePanel()` - Close distance panel
- `clearDistanceMeasurement()` - Clear distance measurement
- Called from: Measurement widgets

### Popup
- `closeCustomPopup()` - Close custom popup
- `zoomToFeature()` - Zoom to selected feature
- `copyFeatureInfo()` - Copy feature information
- Called from: Custom popup

### Layer Management
- `toggleLayer(index)` - Toggle layer visibility
- `zoomToLayer(index)` - Zoom to layer extent
- `removeLayer(index)` - Remove layer from map
- Called from: Layer list (dynamically generated)

### Tab System
- `redirectToTabPlatform(tabType)` - Redirect to platform
- Called from: Tab system (dynamically generated)

### Drawing Tools
- `clearAll()` - Clear all drawings
- Called from: Clear button

## Implementation Pattern

When extracting a module, expose its public functions like this:

```javascript
// At the end of the module file or in main.js after module initialization

// Example: Widget Manager
window.toggleWidget = (name) => widgetManager.toggle(name);

// Example: Tour Manager
window.manuallyStartTour = () => tourManager.manuallyStart();
window.toggleFeatureTour = () => tourManager.toggle();
window.nextFeature = () => tourManager.next();
window.previousFeature = () => tourManager.previous();
window.closeTourControls = () => tourManager.closeControls();

// Example: Attribute Table
window.toggleAttributeTable = () => attributeTable.toggle();
window.refreshTable = () => attributeTable.refresh();
window.previousPage = () => attributeTable.previousPage();
window.nextPage = () => attributeTable.nextPage();
```

## Testing Checklist

After exposing functions, test:
- [ ] All toolbar buttons work
- [ ] All quick action buttons work
- [ ] All modal buttons work
- [ ] All panel buttons work
- [ ] All dynamically generated buttons work (layer list, etc.)
- [ ] Mobile toolbar works
- [ ] Tour controls work
- [ ] Table pagination works
- [ ] All analysis tools work

## Notes

- Functions should be exposed AFTER the module is initialized
- Use arrow functions to maintain proper `this` context
- Document which module each function belongs to
- Consider creating a central `window-bindings.js` file to manage all exposures
- Test thoroughly - missing window bindings will cause silent failures in production
