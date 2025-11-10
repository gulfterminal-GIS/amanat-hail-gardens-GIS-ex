# Design Document

## Overview

This document provides a comprehensive analysis of the current module dependency structure and proposes a refactored initialization system for the GIS application. The analysis reveals circular dependencies, initialization order issues, and opportunities for architectural improvements.

## Current Dependency Analysis

### Module Dependency Graph

```
TIER 0 - FOUNDATION (No dependencies)
├── StateManager
├── NotificationManager
└── Config

TIER 1 - CORE SERVICES (Depend only on Foundation)
├── ModuleLoader (depends on: none - utility)
├── LayerManager (depends on: StateManager, NotificationManager)
├── BasemapManager (depends on: StateManager, NotificationManager)
├── DrawingManager (depends on: StateManager, NotificationManager)
├── PopupManager (depends on: StateManager, NotificationManager)
└── LiquidGlassEffect (depends on: none - custom element)

TIER 2 - FEATURE SERVICES (Depend on Foundation + Core Services)
├── TourManager (depends on: StateManager, NotificationManager, PopupManager)
├── CountryInfo (depends on: StateManager, NotificationManager)
├── VisualizationManager (depends on: StateManager, NotificationManager, LayerManager)
├── AnalysisManager (depends on: StateManager, NotificationManager, LayerManager, DrawingManager)
├── MeasurementManager (depends on: StateManager, NotificationManager, PanelManager, DrawingManager)
├── AttributeTable (depends on: StateManager, NotificationManager, PopupManager)
└── UploadHandler (depends on: StateManager, LayerManager, NotificationManager)

TIER 3 - UI MANAGERS (Depend on Foundation + Services + Features)
├── PanelManager (depends on: StateManager, NotificationManager, BasemapManager, ClassificationManager)
├── ToolbarManager (depends on: StateManager, PanelManager, NotificationManager, DrawingManager, MeasurementManager)
├── TabSystem (depends on: NotificationManager)
├── SearchManager (depends on: StateManager, NotificationManager)
└── WidgetManager (depends on: StateManager, NotificationManager, PanelManager, DrawingManager, PopupManager)

TIER 4 - COMPLEX MANAGERS (Depend on multiple tiers)
├── ClassificationManager (depends on: StateManager, NotificationManager, PanelManager, PopupManager)
├── SwipeManager (depends on: StateManager, NotificationManager, PanelManager, AnalysisManager)
└── MapInitializer (depends on: StateManager, NotificationManager, TourManager, LayerManager, ClassificationManager, VisualizationManager, WidgetManager)

TIER 5 - EVENT HANDLERS (Depend on everything else)
├── MapEventHandler (depends on: StateManager, PopupManager, CountryInfo)
├── CoordinateDisplay (depends on: StateManager, NotificationManager)
└── WindowEventHandler (depends on: PopupManager, PanelManager)
```

### Circular Dependencies Identified

#### 1. **ClassificationManager ↔ PanelManager** (CRITICAL)
- ClassificationManager needs PanelManager for UI operations
- PanelManager needs ClassificationManager for classification panel initialization
- **Current Solution**: Setter injection (`classificationManager.panelManager = panelManager`)
- **Impact**: HIGH - Requires manual wiring, error-prone

#### 2. **SwipeManager ↔ PanelManager** (MODERATE)
- SwipeManager needs PanelManager for UI operations
- PanelManager needs SwipeManager for swipe panel initialization
- **Current Solution**: Setter injection (`panelManager.setSwipeManager(swipeManager)`)
- **Impact**: MODERATE - Manageable with setter

#### 3. **SwipeManager ↔ AnalysisManager** (LOW)
- SwipeManager needs AnalysisManager for accessing analysis layers
- AnalysisManager doesn't directly depend on SwipeManager
- **Current Solution**: Setter injection (`swipeManager.setAnalysisManager(analysisManager)`)
- **Impact**: LOW - One-way dependency with setter

#### 4. **DrawingManager ↔ SwipeManager** (LOW)
- DrawingManager needs SwipeManager for clearAll functionality
- SwipeManager doesn't directly depend on DrawingManager
- **Current Solution**: Setter injection (`drawingManager.setSwipeManager(swipeManager)`)
- **Impact**: LOW - One-way dependency with setter

### Anti-Patterns Identified

#### 1. **God Object: MapInitializer**
- **Issue**: MapInitializer depends on 7 different modules
- **Impact**: HIGH - Difficult to test, high coupling
- **Recommendation**: Consider splitting into smaller initializers

#### 2. **Hub Module: PanelManager**
- **Issue**: PanelManager is depended on by 5+ modules
- **Impact**: MODERATE - Changes ripple through many modules
- **Recommendation**: Consider event-based communication

#### 3. **Circular Dependencies**
- **Issue**: 4 circular dependencies requiring setter injection
- **Impact**: HIGH - Complex initialization, hard to reason about
- **Recommendation**: Break cycles with interfaces or event bus

#### 4. **Manual Dependency Wiring**
- **Issue**: 4 manual setter calls after construction
- **Impact**: MODERATE - Easy to forget, no compile-time checking
- **Recommendation**: Use dependency injection container

## Proposed Architecture

### Option 1: Improved Manual Initialization (Recommended for Now)

**Pros:**
- Minimal changes to existing code
- Clear and explicit
- No new dependencies

**Cons:**
- Still requires manual wiring
- Circular dependencies remain

**Implementation:**
```javascript
// Phase 1: Foundation
const stateManager = new StateManager();
const notificationManager = new NotificationManager();

// Phase 2: Core Services
const layerManager = new LayerManager(stateManager, notificationManager);
const basemapManager = new BasemapManager(stateManager, notificationManager);
const drawingManager = new DrawingManager(stateManager, notificationManager);
const popupManager = new PopupManager(stateManager, notificationManager);

// Phase 3: Feature Services
const tourManager = new TourManager(stateManager, notificationManager, popupManager);
const countryInfo = new CountryInfo(stateManager, notificationManager);
const visualizationManager = new VisualizationManager(stateManager, notificationManager, layerManager);
const analysisManager = new AnalysisManager(stateManager, notificationManager, layerManager, drawingManager);
const attributeTable = new AttributeTable(stateManager, notificationManager, popupManager);
const uploadHandler = new UploadHandler(stateManager, layerManager, notificationManager);

// Phase 4: UI Managers (with circular dependency handling)
const classificationManager = new ClassificationManager(stateManager, notificationManager, null, popupManager);
const panelManager = new PanelManager(stateManager, notificationManager, basemapManager, classificationManager);
classificationManager.setPanelManager(panelManager); // Break circular dependency

const swipeManager = new SwipeManager(stateManager, notificationManager, panelManager);
panelManager.setSwipeManager(swipeManager); // Break circular dependency
swipeManager.setAnalysisManager(analysisManager); // Late binding
drawingManager.setSwipeManager(swipeManager); // Late binding

const measurementManager = new MeasurementManager(stateManager, notificationManager, panelManager, drawingManager);
const toolbarManager = new ToolbarManager(stateManager, panelManager, notificationManager, drawingManager, measurementManager);
const tabSystem = new TabSystem(notificationManager);
const searchManager = new SearchManager(stateManager, notificationManager);
const widgetManager = new WidgetManager(stateManager, notificationManager, panelManager, drawingManager, popupManager);

// Phase 5: Complex Managers
const mapInitializer = new MapInitializer(
  stateManager,
  notificationManager,
  tourManager,
  layerManager,
  classificationManager,
  visualizationManager,
  widgetManager
);

// Phase 6: Event Handlers
const mapEventHandler = new MapEventHandler(stateManager, popupManager, countryInfo);
const coordinateDisplay = new CoordinateDisplay(stateManager, notificationManager);
const windowEventHandler = new WindowEventHandler(popupManager, panelManager);
```

### Option 2: Dependency Injection Container (Future Enhancement)

**Pros:**
- Automatic dependency resolution
- No manual wiring
- Better testability

**Cons:**
- Requires new dependency (InversifyJS or similar)
- Learning curve
- More complex setup

**Not recommended for immediate implementation** - save for future refactor.

### Option 3: Event Bus Pattern (Future Enhancement)

**Pros:**
- Breaks circular dependencies
- Loose coupling
- Easy to extend

**Cons:**
- Less explicit dependencies
- Harder to trace data flow
- Requires event bus implementation

**Not recommended for immediate implementation** - save for future refactor.

## Initialization Sequence for Map Applications

### Critical Order Requirements

1. **Foundation First**: StateManager and NotificationManager must exist before anything else
2. **Map Before Widgets**: Map and View must be initialized before any ArcGIS widgets
3. **Layers Before Features**: Layer managers must exist before features that use layers
4. **UI Before Events**: UI components must be ready before event handlers attach
5. **Window Bindings Last**: Window functions should be bound after all managers exist

### Recommended Initialization Flow

```
1. Create Foundation Modules
   ↓
2. Create Core Service Modules
   ↓
3. Create Feature Service Modules
   ↓
4. Create UI Manager Modules (with circular dependency handling)
   ↓
5. Create Complex Manager Modules
   ↓
6. Initialize Map (MapInitializer.initializeMap())
   ↓
7. Initialize UI Components (Toolbar, Tabs, etc.)
   ↓
8. Initialize Event Handlers
   ↓
9. Bind Window Functions
   ↓
10. Application Ready
```

## Refactored main.js Structure

```javascript
// ============================================================================
// PHASE 1: IMPORTS
// ============================================================================
// [All imports organized by tier]

// ============================================================================
// PHASE 2: FOUNDATION MODULES
// ============================================================================
// Create core state and notification systems

// ============================================================================
// PHASE 3: CORE SERVICE MODULES
// ============================================================================
// Create services with no cross-dependencies

// ============================================================================
// PHASE 4: FEATURE SERVICE MODULES
// ============================================================================
// Create feature services that depend on core services

// ============================================================================
// PHASE 5: UI MANAGER MODULES
// ============================================================================
// Create UI managers (handle circular dependencies here)

// ============================================================================
// PHASE 6: COMPLEX MANAGER MODULES
// ============================================================================
// Create managers that coordinate multiple modules

// ============================================================================
// PHASE 7: EVENT HANDLER MODULES
// ============================================================================
// Create event handlers that depend on everything else

// ============================================================================
// PHASE 8: INITIALIZATION FUNCTION
// ============================================================================
// Async function that initializes the application in proper order

// ============================================================================
// PHASE 9: START APPLICATION
// ============================================================================
// Call initialization function
```

## Breaking Circular Dependencies

### ClassificationManager ↔ PanelManager

**Current Pattern:**
```javascript
const classificationManager = new ClassificationManager(stateManager, notificationManager, null, popupManager);
const panelManager = new PanelManager(stateManager, notificationManager, basemapManager, classificationManager);
classificationManager.panelManager = panelManager; // Setter injection
```

**Recommendation:** Keep current pattern for now. This is acceptable because:
- PanelManager is a UI coordinator that naturally depends on feature managers
- ClassificationManager needs PanelManager for UI operations
- The dependency is clear and documented

**Future Enhancement:** Consider extracting panel operations to a separate service.

### Other Circular Dependencies

Similar reasoning applies to SwipeManager ↔ PanelManager and related dependencies. The setter injection pattern is acceptable for UI coordination scenarios.

## Testing Strategy

1. **Unit Tests**: Test each module in isolation with mocked dependencies
2. **Integration Tests**: Test initialization sequence
3. **Dependency Tests**: Verify no new circular dependencies are introduced
4. **Order Tests**: Verify modules are created in correct order

## Migration Path

1. **Phase 1**: Document current state (this document)
2. **Phase 2**: Refactor main.js with clear sections and comments
3. **Phase 3**: Update index.html to use new src/ path
4. **Phase 4**: Test thoroughly
5. **Phase 5**: Consider future enhancements (DI container, event bus)
