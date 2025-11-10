# Module Dependency Graph

## Overview

This document provides a comprehensive visualization of all module dependencies in the GIS application, identifies circular dependencies, and documents anti-patterns.

## Dependency Tiers

Modules are organized into tiers based on their dependencies. Lower tiers have fewer dependencies and must be initialized first.

### Tier 0: Foundation (No Dependencies)

```
StateManager
  ↓ (provides state to all modules)
  
NotificationManager
  ↓ (provides notifications to all modules)
  
Config
  ↓ (provides configuration to all modules)
```

**Characteristics:**
- No dependencies on other application modules
- Singleton pattern
- Must be created first
- Used by almost all other modules

---

### Tier 1: Core Services

```
ModuleLoader
  ├── (utility for loading ArcGIS modules)
  └── No dependencies

LayerManager
  ├── StateManager
  └── NotificationManager

BasemapManager
  ├── StateManager
  └── NotificationManager

DrawingManager
  ├── StateManager
  ├── NotificationManager
  └── SwipeManager (late binding via setter)

PopupManager
  ├── StateManager
  └── NotificationManager

LiquidGlassEffect
  └── (custom element, no dependencies)
```

**Characteristics:**
- Depend only on Foundation modules
- Provide core services used by higher tiers
- Minimal cross-dependencies
- Can be initialized in any order within tier

---

### Tier 2: Feature Services

```
TourManager
  ├── StateManager
  ├── NotificationManager
  └── PopupManager

CountryInfo
  ├── StateManager
  └── NotificationManager

VisualizationManager
  ├── StateManager
  ├── NotificationManager
  └── LayerManager

AnalysisManager
  ├── StateManager
  ├── NotificationManager
  ├── LayerManager
  └── DrawingManager

AttributeTable
  ├── StateManager
  ├── NotificationManager
  └── PopupManager

UploadHandler
  ├── StateManager
  ├── LayerManager
  └── NotificationManager
```

**Characteristics:**
- Depend on Foundation + Core Services
- Implement specific application features
- May have dependencies on each other
- Should be initialized after Core Services

---

### Tier 3: UI Managers

```
ClassificationManager
  ├── StateManager
  ├── NotificationManager
  ├── PanelManager (circular - via setter)
  └── PopupManager

PanelManager
  ├── StateManager
  ├── NotificationManager
  ├── BasemapManager
  ├── ClassificationManager (circular)
  └── SwipeManager (late binding via setter)

SwipeManager
  ├── StateManager
  ├── NotificationManager
  ├── PanelManager (circular)
  └── AnalysisManager (late binding via setter)

MeasurementManager
  ├── StateManager
  ├── NotificationManager
  ├── PanelManager
  └── DrawingManager

ToolbarManager
  ├── StateManager
  ├── PanelManager
  ├── NotificationManager
  ├── DrawingManager
  └── MeasurementManager

TabSystem
  └── NotificationManager

SearchManager
  ├── StateManager
  └── NotificationManager

WidgetManager
  ├── StateManager
  ├── NotificationManager
  ├── PanelManager
  ├── DrawingManager
  └── PopupManager
```

**Characteristics:**
- Coordinate UI components
- Multiple dependencies across tiers
- Contains circular dependencies (handled via setter injection)
- Should be initialized after Feature Services

---

### Tier 4: Complex Managers

```
MapInitializer
  ├── StateManager
  ├── NotificationManager
  ├── TourManager
  ├── LayerManager
  ├── ClassificationManager
  ├── VisualizationManager
  └── WidgetManager
```

**Characteristics:**
- High-level coordinators
- Many dependencies (7 in MapInitializer)
- Orchestrate complex initialization sequences
- Should be initialized after UI Managers

---

### Tier 5: Event Handlers

```
MapEventHandler
  ├── StateManager
  ├── PopupManager
  └── CountryInfo

CoordinateDisplay
  ├── StateManager
  └── NotificationManager

WindowEventHandler
  ├── PopupManager
  └── PanelManager
```

**Characteristics:**
- Handle user interactions
- Depend on modules from all tiers
- Should be initialized last
- Attach event listeners after all modules ready

---

## Circular Dependencies

### 1. ClassificationManager ↔ PanelManager

```
ClassificationManager
  ↓ needs
PanelManager (for UI operations)
  ↓ needs
ClassificationManager (for classification panel)
  ↑ circular dependency
```

**Why it exists:**
- ClassificationManager needs to open panels and update UI
- PanelManager needs ClassificationManager to initialize classification panel

**Resolution:**
```javascript
// Create ClassificationManager with null PanelManager
const classificationManager = new ClassificationManager(
  stateManager,
  notificationManager,
  null, // Will be set via setter
  popupManager
);

// Create PanelManager
const panelManager = new PanelManager(
  stateManager,
  notificationManager,
  basemapManager,
  classificationManager
);

// Break circular dependency
classificationManager.setPanelManager(panelManager);
```

**Is this an anti-pattern?**
- **Partially** - Indicates tight coupling between UI and feature logic
- **Acceptable** - Common in UI frameworks where coordinators need bidirectional communication
- **Future improvement** - Consider event bus or mediator pattern

---

### 2. SwipeManager ↔ PanelManager

```
SwipeManager
  ↓ needs
PanelManager (for UI operations)
  ↓ needs
SwipeManager (for swipe panel initialization)
  ↑ circular dependency
```

**Why it exists:**
- SwipeManager needs to update panel UI
- PanelManager needs SwipeManager to initialize swipe panel

**Resolution:**
```javascript
const swipeManager = new SwipeManager(
  stateManager,
  notificationManager,
  panelManager
);

panelManager.setSwipeManager(swipeManager);
```

**Is this an anti-pattern?**
- **Partially** - Similar to ClassificationManager ↔ PanelManager
- **Acceptable** - UI coordination pattern
- **Future improvement** - Extract panel operations to separate service

---

### 3. SwipeManager → AnalysisManager (Late Binding)

```
SwipeManager
  ↓ needs (optional)
AnalysisManager (for accessing analysis layers)
```

**Why it exists:**
- SwipeManager needs to access analysis layers for swipe comparison
- Not a true circular dependency (one-way)

**Resolution:**
```javascript
const swipeManager = new SwipeManager(
  stateManager,
  notificationManager,
  panelManager
);

swipeManager.setAnalysisManager(analysisManager);
```

**Is this an anti-pattern?**
- **No** - This is late binding, not circular dependency
- **Acceptable** - Optional dependency for extended functionality
- **Good practice** - Keeps AnalysisManager independent

---

### 4. DrawingManager → SwipeManager (Late Binding)

```
DrawingManager
  ↓ needs (optional)
SwipeManager (for clearAll coordination)
```

**Why it exists:**
- DrawingManager's clearAll needs to also clear swipe widget
- Not a true circular dependency (one-way)

**Resolution:**
```javascript
const drawingManager = new DrawingManager(
  stateManager,
  notificationManager
);

drawingManager.setSwipeManager(swipeManager);
```

**Is this an anti-pattern?**
- **No** - Late binding for optional coordination
- **Acceptable** - Keeps modules loosely coupled
- **Good practice** - DrawingManager doesn't require SwipeManager to function

---

## Anti-Patterns

### 1. God Object: MapInitializer

**Issue:**
```
MapInitializer depends on:
  1. StateManager
  2. NotificationManager
  3. TourManager
  4. LayerManager
  5. ClassificationManager
  6. VisualizationManager
  7. WidgetManager
```

**Impact:**
- **HIGH** - Difficult to test in isolation
- **HIGH** - Changes to any dependency affect MapInitializer
- **HIGH** - Violates Single Responsibility Principle

**Metrics:**
- Dependency count: 7
- Recommended maximum: 5

**Recommendations:**
1. **Split into smaller initializers:**
   ```
   MapInitializer (core map setup)
   LayerInitializer (layer loading)
   FeatureInitializer (feature setup)
   UIInitializer (UI setup)
   ```

2. **Use initialization phases:**
   ```javascript
   class MapInitializer {
     async initializeCore() { /* map + view */ }
     async initializeLayers() { /* layers */ }
     async initializeFeatures() { /* features */ }
     async initializeUI() { /* UI */ }
   }
   ```

3. **Consider builder pattern:**
   ```javascript
   const app = new ApplicationBuilder()
     .withState(stateManager)
     .withNotifications(notificationManager)
     .withMap(mapConfig)
     .withLayers(layerManager)
     .withFeatures(tourManager, classificationManager)
     .withUI(widgetManager)
     .build();
   ```

---

### 2. Hub Module: PanelManager

**Issue:**
```
PanelManager is depended on by:
  1. ClassificationManager
  2. SwipeManager
  3. MeasurementManager
  4. ToolbarManager
  5. WidgetManager
  6. WindowEventHandler
```

**Impact:**
- **MODERATE** - Changes to PanelManager ripple through many modules
- **MODERATE** - High coupling across application
- **MODERATE** - Difficult to refactor

**Metrics:**
- Dependent modules: 6
- Recommended maximum: 4

**Recommendations:**
1. **Extract panel operations to service:**
   ```javascript
   class PanelService {
     openPanel(panelId, content) { }
     closePanel(panelId) { }
     updatePanel(panelId, content) { }
   }
   ```

2. **Use event bus for panel communication:**
   ```javascript
   eventBus.emit('panel:open', { id: 'classification', content });
   eventBus.on('panel:opened', (panelId) => { });
   ```

3. **Implement mediator pattern:**
   ```javascript
   class UIMediator {
     registerPanel(panel) { }
     requestPanelOpen(panelId) { }
     notifyPanelChange(panelId, state) { }
   }
   ```

---

### 3. Circular Dependencies

**Issue:**
- 2 true circular dependencies (ClassificationManager ↔ PanelManager, SwipeManager ↔ PanelManager)
- 2 late binding dependencies (not truly circular)

**Impact:**
- **HIGH** - Complex initialization order
- **HIGH** - Difficult to reason about data flow
- **MODERATE** - Requires manual setter injection

**Recommendations:**
1. **Break cycles with interfaces:**
   ```javascript
   interface IPanelOperations {
     openPanel(id, content);
     closePanel(id);
   }
   
   class ClassificationManager {
     constructor(panelOps: IPanelOperations) { }
   }
   ```

2. **Use dependency injection container:**
   ```javascript
   container.bind('IPanelOperations').to(PanelManager);
   container.bind('ClassificationManager').toSelf();
   // Container resolves circular dependencies automatically
   ```

3. **Implement event-based communication:**
   ```javascript
   // Instead of direct calls
   classificationManager.panelManager.openPanel();
   
   // Use events
   eventBus.emit('panel:open:request', { id: 'classification' });
   ```

---

### 4. Manual Dependency Wiring

**Issue:**
```javascript
// 4 manual setter calls after construction
classificationManager.setPanelManager(panelManager);
panelManager.setSwipeManager(swipeManager);
swipeManager.setAnalysisManager(analysisManager);
drawingManager.setSwipeManager(swipeManager);
```

**Impact:**
- **MODERATE** - Easy to forget during refactoring
- **MODERATE** - No compile-time checking
- **LOW** - Well-documented in current code

**Recommendations:**
1. **Use dependency injection container** (future enhancement)
2. **Document setter requirements in class JSDoc**
3. **Add runtime validation:**
   ```javascript
   class ClassificationManager {
     setPanelManager(pm) {
       if (!pm) throw new Error('PanelManager required');
       this.panelManager = pm;
     }
     
     someMethod() {
       if (!this.panelManager) {
         throw new Error('PanelManager not set. Call setPanelManager() first.');
       }
     }
   }
   ```

---

## Dependency Metrics

### Modules by Dependency Count

| Module | Dependencies | Tier | Status |
|--------|-------------|------|--------|
| MapInitializer | 7 | 4 | ⚠️ Too many |
| WidgetManager | 5 | 3 | ⚠️ High |
| ToolbarManager | 5 | 3 | ⚠️ High |
| PanelManager | 4 | 3 | ✓ OK |
| ClassificationManager | 4 | 3 | ✓ OK |
| SwipeManager | 4 | 3 | ✓ OK |
| MeasurementManager | 4 | 2 | ✓ OK |
| AnalysisManager | 4 | 2 | ✓ OK |
| Others | ≤3 | Various | ✓ Good |

### Modules by Dependents Count

| Module | Dependents | Status |
|--------|-----------|--------|
| StateManager | 20+ | ✓ Expected (foundation) |
| NotificationManager | 20+ | ✓ Expected (foundation) |
| PanelManager | 6 | ⚠️ Hub module |
| PopupManager | 5 | ✓ OK |
| LayerManager | 4 | ✓ OK |
| DrawingManager | 4 | ✓ OK |
| Others | ≤3 | ✓ Good |

---

## Initialization Order Summary

```
1. Foundation (Tier 0)
   └── StateManager, NotificationManager, Config

2. Core Services (Tier 1)
   └── LayerManager, BasemapManager, DrawingManager, PopupManager

3. Feature Services (Tier 2)
   └── TourManager, CountryInfo, VisualizationManager, AnalysisManager,
       AttributeTable, UploadHandler

4. UI Managers (Tier 3)
   └── ClassificationManager, PanelManager, SwipeManager, MeasurementManager,
       ToolbarManager, TabSystem, SearchManager, WidgetManager
   └── Handle circular dependencies via setter injection

5. Complex Managers (Tier 4)
   └── MapInitializer

6. Event Handlers (Tier 5)
   └── MapEventHandler, CoordinateDisplay, WindowEventHandler

7. Async Initialization
   └── MapInitializer.initializeMap()
   └── UI component initialization
   └── Event handler initialization
   └── Window function binding
```

---

## Recommendations Summary

### Immediate Actions (Current Refactor)
1. ✅ Organize main.js by dependency tiers
2. ✅ Document circular dependencies
3. ✅ Add clear phase comments
4. ✅ Improve error handling

### Short-term Improvements (Next Sprint)
1. Add runtime validation for setter injection
2. Extract panel operations to PanelService
3. Document setter requirements in JSDoc
4. Add initialization order tests

### Long-term Enhancements (Future)
1. Consider dependency injection container (InversifyJS)
2. Implement event bus for loose coupling
3. Split MapInitializer into smaller initializers
4. Refactor PanelManager to reduce dependents

---

## Conclusion

The current dependency structure is **acceptable for a map application** of this complexity. The circular dependencies are well-documented and handled appropriately via setter injection. The main areas for improvement are:

1. **MapInitializer** - Too many dependencies (God Object)
2. **PanelManager** - Too many dependents (Hub Module)
3. **Circular dependencies** - Could be eliminated with architectural changes

However, these anti-patterns are **not critical** and the current approach is maintainable. The refactored main.js with clear phases and documentation significantly improves code clarity.
