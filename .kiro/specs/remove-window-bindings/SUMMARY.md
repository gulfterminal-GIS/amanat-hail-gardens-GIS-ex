# Window Bindings Optimization - Summary

## Overview

This spec focuses on removing unnecessary window globals and fixing inter-module communication by replacing window bindings with direct manager references.

## What We're Doing

### 1. Clean Up StateManager (~20 globals)
Remove backward compatibility window assignments that are no longer needed:
- `window.displayMap`, `window.view`, `window.homeExtent`
- `window.uploadedLayers`, `window.drawLayer`, etc.
- All modules now use StateManager getters directly

### 2. Fix PanelManager (1 bug fix)
**BUG FIX**: Classification panel opens but never initializes
- Add `classificationManager` to PanelManager constructor
- Call `classificationManager.initializeClassificationPanel()` when opening panel
- Follows existing pattern (basemapManager, swipeManager)

### 3. Fix ToolbarManager (~4 window calls, 1 bug fix)
Replace window bindings with direct manager references:
- `window.clearAll()` → `this.drawingManager.clearAll()`
- `window.toggleMeasurement()` → `this.measurementManager.toggleMeasurement()`
- `window.resetDrawingTools()` → `this.drawingManager.resetDrawingTools()` **BUG FIX**
- Remove `window.initializeClassificationPanel()` calls (PanelManager handles now)

### 4. Fix AnalysisManager (~5 event handlers)
Store event handlers as instance properties instead of window globals:
- `window.currentBufferHandler` → `this.currentBufferHandler`
- `window.intersectDrawHandler` → `this.intersectDrawHandler`
- `window.distanceClickHandler` → `this.distanceClickHandler`
- `window.distanceDrawHandler` → `this.distanceDrawHandler`
- `window.analysisHandles` → `this.analysisHandles`

### 5. Fix Heatmap State Access (~3 window calls, 2 bug fixes)
**BUG FIXES**: Heatmap features don't work because window globals are never set
- Add `getCurrentHeatmapSettings()` getter to VisualizationManager
- Fix initialization order: Create VisualizationManager BEFORE MapInitializer
- LayerManager: `window.heatmapEnabled` → `visualizationManager.isHeatmapEnabled()`
- MapInitializer: Replace all window heatmap globals with visualizationManager getters

### 6. Remove window.CONFIG
- Remove `window.CONFIG = CONFIG` from main.js
- Modules already import CONFIG directly

## Bugs Fixed

This refactoring fixes **4 existing bugs**:

1. **Classification Panel Never Initializes**
   - Panel opens but layer/field selects are never populated
   - `window.initializeClassificationPanel` was never set
   - Fix: PanelManager now calls classificationManager directly

2. **Drawing Tools Never Reset**
   - `window.resetDrawingTools` was never set
   - Reset functionality never executed
   - Fix: ToolbarManager now calls drawingManager directly

3. **Heatmap Layer List Updates Don't Work**
   - `window.heatmapEnabled` was never set
   - Layer list never updates when heatmap is enabled
   - Fix: LayerManager now uses visualizationManager getter

4. **Heatmap Zoom Adjustment Doesn't Work**
   - `window.heatmapEnabled`, `window.heatmapLayer`, `window.currentHeatmapSettings` were never set
   - Heatmap radius doesn't adjust with zoom level
   - Fix: MapInitializer now uses visualizationManager getters

## Impact

### Positive
- ✅ Removes ~30 unnecessary window globals/bindings
- ✅ Fixes 4 existing bugs
- ✅ Cleaner module dependencies
- ✅ Better encapsulation
- ✅ Easier to test and maintain
- ✅ No breaking changes to working functionality

### Changes Required
- Update 7 module constructors to accept new parameters
- Update main.js initialization order
- Replace ~15 window binding calls with direct method calls

## What We're NOT Doing

- ❌ NOT removing inline HTML event handlers
- ❌ NOT removing window bindings from window-bindings.js
- ❌ NOT creating audit tools (next phase)
- ❌ NOT refactoring HTML (next phase)

## Next Phase

The next spec should focus on:
1. Create audit tools for monitoring window bindings
2. HTML refactoring to remove inline event handlers
3. Remove the ~50 remaining window bindings from window-bindings.js
4. Target: 80%+ reduction in window bindings

## Files Modified

### Core
- `js/core/state-manager.js` - Remove window assignments
- `js/core/map-initializer.js` - Add visualizationManager, use getters

### UI
- `js/ui/panel-manager.js` - Add classificationManager, initialize panel
- `js/ui/toolbar-manager.js` - Add measurementManager, use direct calls

### Tools
- `js/tools/analysis-manager.js` - Store event handlers as instance properties
- `js/tools/visualization-manager.js` - Add getCurrentHeatmapSettings() getter

### Layers
- `js/layers/layer-manager.js` - Store visualizationManager, use getter

### Main
- `js/main.js` - Update initialization order, pass new parameters, remove window.CONFIG

## Testing Checklist

After implementation, verify:

1. ✅ Classification panel opens and initializes correctly
2. ✅ Layer and field selects are populated
3. ✅ Classification works correctly
4. ✅ Clear all button works
5. ✅ Measurement toggle works
6. ✅ Drawing tools reset properly
7. ✅ Buffer analysis drawing works
8. ✅ Intersect analysis drawing works
9. ✅ Distance analysis works
10. ✅ Heatmap enable/disable works
11. ✅ Heatmap settings changes work
12. ✅ Heatmap zoom adjustment works (NEW - was broken)
13. ✅ Layer list updates when heatmap is enabled (NEW - was broken)
14. ✅ All toolbar buttons work
15. ✅ No console errors about undefined globals

## Risk Assessment

### Low Risk ✅
- StateManager window globals removal (not used anywhere)
- AnalysisManager event handlers (internal only)
- window.CONFIG removal (not used)

### Medium Risk ⚠️
- ToolbarManager changes (straightforward, but multiple changes)
- Initialization order changes (need careful testing)
- Heatmap state access (fixes bugs, but touches multiple modules)

### High Risk ❌
- None identified

## Conclusion

This is a focused refactoring that:
- Cleans up ~30 unnecessary window globals
- Fixes 4 existing bugs
- Improves code organization
- Sets foundation for future HTML refactoring
- Maintains all working functionality
- No breaking changes

The changes are well-scoped, low-risk, and provide immediate value by fixing bugs and improving code quality.
