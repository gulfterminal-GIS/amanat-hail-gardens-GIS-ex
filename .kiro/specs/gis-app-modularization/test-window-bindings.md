# Testing Window Bindings

## Quick Verification Script

Open the browser console after the application loads and run these commands to verify window bindings:

```javascript
// Check if all critical functions are exposed
const criticalFunctions = [
  'toggleWidget',
  'toggleAttributeTable',
  'manuallyStartTour',
  'startAppTour',
  'zoomIn',
  'zoomOut',
  'startBufferAnalysis',
  'toggleHeatmap',
  'applyClassification',
  'closeCustomPopup',
  'toggleLayer',
  'clearAll'
];

console.log('=== Window Bindings Verification ===');
criticalFunctions.forEach(funcName => {
  const exists = typeof window[funcName] === 'function';
  console.log(`${exists ? '✅' : '❌'} window.${funcName}`);
});
```

## Manual Testing Checklist

### Desktop Toolbar
- [ ] Click "Upload" button - should open upload panel
- [ ] Click "Layers" button - should open layers panel
- [ ] Click "Basemap" button - should open basemap panel
- [ ] Click "Draw" button - should open drawing panel
- [ ] Click "Analysis" button - should open analysis panel
- [ ] Click "Visualization" button - should open visualization panel
- [ ] Click "Measure" button - should activate measurement tool
- [ ] Click "Table" button - should toggle attribute table
- [ ] Click "Legend" button - should toggle legend widget
- [ ] Click "Bookmarks" button - should toggle bookmarks widget
- [ ] Click "Print" button - should toggle print widget

### Mobile Toolbar
- [ ] Open mobile menu
- [ ] Test all mobile menu items
- [ ] Verify panels open correctly on mobile

### Quick Actions
- [ ] Click "Feature Tour" button - should start tour
- [ ] Click "Zoom In" button - should zoom in
- [ ] Click "Zoom Out" button - should zoom out
- [ ] Click "Take a Tour" button - should start app tour
- [ ] Click "Home" button - should reset view
- [ ] Click "Fullscreen" button - should toggle fullscreen

### Analysis Panel
- [ ] Click "Buffer Analysis" card - should open buffer modal
- [ ] Click "Intersection Analysis" card - should open intersect modal
- [ ] Click "Distance Analysis" card - should activate distance tool
- [ ] Click "Area Analysis" card - should activate area tool

### Visualization Panel
- [ ] Toggle "Heatmap" switch - should enable/disable heatmap
- [ ] Click "Settings" button - should open heatmap settings modal
- [ ] Toggle "Time Animation" switch - should show/hide time controls
- [ ] Click "Play" button - should start time animation
- [ ] Click "Stop" button - should stop time animation

### Classification Panel
- [ ] Select a layer and field
- [ ] Click "Apply Classification" - should apply classification
- [ ] Click "Reset" - should reset classification

### Attribute Table
- [ ] Click table button - should open attribute table
- [ ] Click "Refresh" button - should refresh table
- [ ] Click "Export" button - should show export options
- [ ] Click "Previous Page" - should go to previous page
- [ ] Click "Next Page" - should go to next page
- [ ] Click "Close" button - should close table

### Layer List (Dynamically Generated)
- [ ] Click eye icon on a layer - should toggle visibility
- [ ] Click zoom icon on a layer - should zoom to layer
- [ ] Click trash icon on a layer - should remove layer

### Tour Controls
- [ ] Start a feature tour
- [ ] Click "Play/Pause" button - should toggle tour
- [ ] Click "Next" button - should go to next feature
- [ ] Click "Previous" button - should go to previous feature
- [ ] Click "Close" button - should close tour controls

### Modals
- [ ] Open buffer modal, click "X" or overlay - should close
- [ ] Open intersect modal, click "X" or overlay - should close
- [ ] Open heatmap settings, click "X" or overlay - should close
- [ ] Open export modal, click "X" or overlay - should close

### Popup
- [ ] Click a feature to open popup
- [ ] Click "Zoom to Feature" - should zoom to feature
- [ ] Click "Copy Info" - should copy feature info
- [ ] Click "X" to close - should close popup

### Measurement
- [ ] Activate measurement tool
- [ ] Click "X" on measurement results - should close widget
- [ ] Activate distance measurement
- [ ] Click "X" on distance panel - should close panel
- [ ] Click "Clear Measurement" - should clear measurement

### Drawing Tools
- [ ] Draw some features
- [ ] Click "Clear All" button - should clear all drawings (with confirmation)

## Browser Console Checks

After loading the application, check the console for:

1. **Success message**:
   ```
   ✅ Window bindings initialized - All HTML event handlers connected
   ```

2. **No errors** related to:
   - Missing functions
   - Undefined references
   - Module loading failures

3. **State snapshot** should show initialized state:
   ```javascript
   State snapshot: {
     hasMap: true,
     hasView: true,
     uploadedLayersCount: 1,
     // ... other state
   }
   ```

## Common Issues and Solutions

### Issue: "function is not defined"
**Solution**: Check that the function is:
1. Exported from script.js
2. Imported in window-bindings.js
3. Bound in bindWindowFunctions()

### Issue: "Cannot read property of undefined"
**Solution**: Ensure managers are passed to bindWindowFunctions() in main.js

### Issue: Function exists but doesn't work
**Solution**: Check that:
1. The function implementation in script.js is correct
2. StateManager is properly initialized
3. Dependencies are available

## Automated Testing (Future)

Consider adding automated tests:

```javascript
// Example test structure
describe('Window Bindings', () => {
  it('should expose all critical functions', () => {
    expect(typeof window.toggleWidget).toBe('function');
    expect(typeof window.toggleAttributeTable).toBe('function');
    // ... more assertions
  });

  it('should call underlying implementations', () => {
    const spy = jest.spyOn(scriptFunctions, 'toggleWidget');
    window.toggleWidget('legend');
    expect(spy).toHaveBeenCalledWith('legend');
  });
});
```

## Performance Check

Monitor performance after implementation:

```javascript
// In browser console
console.time('Window Bindings Init');
// Reload page
// Check console for timing
```

Expected: < 50ms for binding initialization

## Security Audit

Verify that only necessary functions are exposed:

```javascript
// List all window properties that are functions
Object.keys(window).filter(key => typeof window[key] === 'function' && !key.startsWith('_'));
```

Review the list to ensure no sensitive functions are accidentally exposed.
