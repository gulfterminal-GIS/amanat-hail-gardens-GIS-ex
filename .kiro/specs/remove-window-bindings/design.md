# Design Document - Window Bindings Optimization

## Overview

This design focuses on optimizing the current window bindings in `js/window-bindings.js` by eliminating unnecessary global exposures. The goal is to identify which window bindings can be replaced with:

1. **StateManager access** - Functions that only need state can access it through StateManager
2. **Direct module imports** - Modules that need to call each other can import directly
3. **Module instance references** - Managers that already have references to other managers

**Out of Scope**: This phase does NOT include removing inline HTML event handlers. That will be a separate spec focused on HTML refactoring.

## Current Window Bindings Analysis

### Window Bindings in `js/window-bindings.js`

The current implementation exposes ~50 functions on the window object. These can be categorized as:

#### Category 1: Required for HTML Inline Handlers (KEEP)
These functions are called directly from HTML `onclick`, `onchange`, etc. attributes and MUST remain on window:

- `toggleWidget(name)` - Called from toolbar buttons
- `toggleAttributeTable()` - Called from toolbar and mobile menu
- `manuallyStartTour()` - Called from quick actions
- `startAppTour()` - Called from quick actions
- `zoomIn()` / `zoomOut()` - Called from quick actions
- `toggleFeatureTour()` - Called from tour controls
- `nextFeature()` / `previousFeature()` - Called from tour controls
- `closeTourControls()` / `closeTourPopup()` - Called from tour UI
- `startBufferAnalysis()` / `startIntersectAnalysis()` / etc. - Called from analysis panel
- `toggleHeatmap()` - Called from visualization panel
- `toggleTimeControls()` - Called from visualization panel
- `applyClassification()` / `resetClassification()` - Called from classification panel
- `toggleMeasurement()` - Called from measurement controls
- `closeCustomPopup()` / `zoomToFeature()` / `copyFeatureInfo()` - Called from popup UI
- `toggleLayer(index)` / `zoomToLayer(index)` / `removeLayer(index)` - Called from layer list
- `redirectToTabPlatform(tabType)` - Called from tab buttons
- `clearAll()` / `startDrawingWithTool(tool)` - Called from drawing panel
- `refreshTable()` / `sortTable()` / `selectTableRow()` / `showExportOptions()` - Called from table UI
- `previousPage()` / `nextPage()` - Called from pagination
- `deleteBookmark(index)` - Called from bookmarks widget
- And many more modal/panel control functions

**Total: ~45 functions that MUST stay on window for HTML compatibility**

#### Category 2: Internal Module Communication (CAN BE REMOVED)
These are functions that modules call on each other but don't need window exposure:

**NONE IDENTIFIED** - All current window bindings are actually used by HTML inline handlers.

## Key Insight

After analyzing the codebase, **all current window bindings in `js/window-bindings.js` are legitimately needed** because they're all called from inline HTML event handlers. 

However, there are opportunities for optimization:

### Optimization Opportunities

1. **Remove Redundant Window Globals from StateManager**
   - StateManager currently sets window globals for backward compatibility
   - These can be removed since modules now use StateManager directly
   - Example: `window.displayMap`, `window.view`, `window.uploadedLayers`, etc.

2. **Consolidate Module References in main.js**
   - Some modules query DOM to find buttons with `onclick` attributes
   - These could be optimized to use data attributes or direct references

3. **Document Window API Surface**
   - Add comprehensive JSDoc comments to window-bindings.js
   - Document which HTML elements call each function
   - Add security notes about the global API surface

## Proposed Changes

### Phase 1: Remove Backward Compatibility Window Globals from StateManager

**Problem**: StateManager sets window globals for "backward compatibility during transition":
```javascript
setMap(map) {
  this._map = map;
  // Also set global for backward compatibility during transition
  if (typeof window !== "undefined") {
    window.displayMap = map;
  }
}
```

**Solution**: Remove all these window assignments since:
- All modules now use StateManager
- No code directly accesses `window.displayMap`, `window.view`, etc.
- This reduces global pollution

**Impact**: 
- Removes ~20 window globals
- No breaking changes (modules use StateManager)
- Cleaner global namespace

### Phase 2: Replace Window Bindings in Modules with Direct References

**Problem**: Several modules use window bindings to call functions on other modules:

1. **ToolbarManager** (`js/ui/toolbar-manager.js`):
   - Uses `window.initializeClassificationPanel()` - should use `classificationManager.initializePanel()`
   - Uses `window.clearAll()` - should use `drawingManager.clearAll()`
   - Uses `window.toggleMeasurement()` - should use `measurementManager.toggleMeasurement()`
   - Uses `window.resetDrawingTools()` - should use `drawingManager.resetDrawingTools()`

2. **AnalysisManager** (`js/tools/analysis-manager.js`):
   - Uses `window.currentBufferHandler` - should be instance property `this.currentBufferHandler`
   - Uses `window.intersectDrawHandler` - should be instance property `this.intersectDrawHandler`
   - Uses `window.distanceClickHandler` - should be instance property `this.distanceClickHandler`
   - Uses `window.distanceDrawHandler` - should be instance property `this.distanceDrawHandler`
   - Uses `window.analysisHandles` - should be instance property `this.analysisHandles`

3. **LayerManager** (`js/layers/layer-manager.js`):
   - Uses `window.heatmapEnabled` - should use `visualizationManager.isHeatmapEnabled()`

4. **MapInitializer** (`js/core/map-initializer.js`):
   - Uses `window.heatmapEnabled` - should use `visualizationManager.isHeatmapEnabled()`
   - Uses `window.heatmapLayer` - should use `visualizationManager.getHeatmapLayer()`
   - Uses `window.currentHeatmapSettings` - should use `visualizationManager.getCurrentHeatmapSettings()`

5. **TabSystem** (`js/ui/tab-system.js`):
   - Uses `window.redirectToTabPlatform()` in HTML string - should use data attribute + event listener
   - Uses `window.open()` - this is native browser API, OK to keep

6. **Main.js** (`js/main.js`):
   - Sets `window.CONFIG` - should be removed, modules can import CONFIG directly

**Solution**: 
- Pass manager references through constructors
- Store event handlers as instance properties
- Use direct method calls instead of window bindings
- Remove `window.CONFIG` (modules import it directly)

**Impact**:
- Removes ~10 unnecessary window bindings
- Cleaner module dependencies
- Better encapsulation
- Easier to test and maintain

### Phase 3: Add Getter Methods to VisualizationManager

**Problem**: Other modules check `window.heatmapEnabled` and access `window.heatmapLayer`

**Solution**: VisualizationManager already has these as instance properties, just needs getter methods:
```javascript
// Already exists:
isHeatmapEnabled() {
  return this.heatmapEnabled;
}

getHeatmapLayer() {
  return this.heatmapLayer;
}

// Need to add:
getCurrentHeatmapSettings() {
  return this.currentHeatmapSettings;
}
```

Then update LayerManager and MapInitializer to use these getters instead of window globals.

## Implementation Strategy

### Step 1: Clean Up StateManager
- Remove all `window.xxx = ` assignments from StateManager
- Keep only the internal state management
- Test that all modules still work correctly

### Step 2: Fix ToolbarManager Dependencies
- Pass `classificationManager`, `drawingManager`, `measurementManager` to constructor
- Replace `window.initializeClassificationPanel()` with `this.classificationManager.initializePanel()`
- Replace `window.clearAll()` with `this.drawingManager.clearAll()`
- Replace `window.toggleMeasurement()` with `this.measurementManager.toggleMeasurement()`
- Replace `window.resetDrawingTools()` with `this.drawingManager.resetDrawingTools()`

### Step 3: Fix AnalysisManager Event Handlers
- Change `window.currentBufferHandler` to `this.currentBufferHandler`
- Change `window.intersectDrawHandler` to `this.intersectDrawHandler`
- Change `window.distanceClickHandler` to `this.distanceClickHandler`
- Change `window.distanceDrawHandler` to `this.distanceDrawHandler`
- Change `window.analysisHandles` to `this.analysisHandles`

### Step 4: Fix Heatmap State Access
- Add `getCurrentHeatmapSettings()` getter to VisualizationManager
- Pass `visualizationManager` to LayerManager constructor
- Replace `window.heatmapEnabled` with `this.visualizationManager.isHeatmapEnabled()`
- Pass `visualizationManager` to MapInitializer constructor
- Replace window globals with visualizationManager getters

### Step 5: Remove window.CONFIG
- Remove `window.CONFIG = CONFIG` from main.js
- Verify no code accesses `window.CONFIG` (modules import it directly)

## Testing Strategy

### Verification Steps
1. Remove window assignments from StateManager
2. Run application and test all features
3. Verify no console errors about undefined globals
4. Test all toolbar buttons, panels, and widgets
5. Verify all inline event handlers still work

### Regression Testing
- Test all modules that use StateManager
- Verify layer management works
- Test drawing tools
- Test analysis functions
- Test tour system
- Test attribute table
- Test all widgets

## Security Considerations

### Current State
- ~50 functions exposed on window object
- All are legitimately needed for HTML inline handlers
- No sensitive operations exposed
- All functions validate inputs and check permissions

### Improvements
- Document each function's purpose and HTML usage
- Add input validation where missing
- Consider Content Security Policy (CSP) for future
- Monitor for unauthorized access patterns

## Future Phases

### Phase 2: HTML Refactoring (Separate Spec)
- Replace inline event handlers with addEventListener
- Remove window bindings that are no longer needed
- Use data attributes for element identification
- Implement event delegation where appropriate
- Target: Reduce window bindings by 80%+

## Benefits of This Approach

1. **Immediate Value**: Cleans up unnecessary window globals from StateManager
2. **No Breaking Changes**: All HTML inline handlers continue to work
3. **Better Documentation**: Clear API surface documentation
4. **Foundation for Future**: Sets up for HTML refactoring phase
5. **Security Improvement**: Reduced global namespace pollution
6. **Maintainability**: Clear understanding of what's exposed and why

## Conclusion

This phase focuses on **cleaning up unnecessary window globals** rather than a major refactoring:
- Remove ~20 backward compatibility window globals from StateManager
- Remove ~10 window bindings used for inter-module communication
- Replace with direct manager references and instance properties
- Total: ~30 unnecessary window globals removed

**What Remains**: ~50 legitimate window bindings in `window-bindings.js` that are needed for HTML inline event handlers.

**Next Phase**: HTML refactoring to remove inline event handlers, which will then allow removing most of the remaining window bindings. That phase should also include creating audit tools to monitor the global API surface.
