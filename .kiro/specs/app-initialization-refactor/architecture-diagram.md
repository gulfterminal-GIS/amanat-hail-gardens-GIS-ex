# Architecture Diagram

## Module Dependency Visualization

### Tier-Based Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TIER 0: FOUNDATION                          │
│                                                                     │
│  ┌──────────────┐  ┌────────────────────┐  ┌────────┐            │
│  │ StateManager │  │ NotificationManager│  │ Config │            │
│  └──────────────┘  └────────────────────┘  └────────┘            │
│         │                    │                   │                 │
└─────────┼────────────────────┼───────────────────┼─────────────────┘
          │                    │                   │
          └────────────────────┴───────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                         TIER 1: CORE SERVICES                        │
│                              │                                       │
│  ┌──────────────┐  ┌────────┴────────┐  ┌──────────────┐          │
│  │ LayerManager │  │ BasemapManager  │  │ PopupManager │          │
│  └──────────────┘  └─────────────────┘  └──────────────┘          │
│                                                                     │
│  ┌──────────────────┐                                              │
│  │ DrawingManager   │◄─────────────┐                              │
│  └──────────────────┘              │ (late binding)                │
│                                     │                               │
└─────────────────────────────────────┼───────────────────────────────┘
                                      │
┌─────────────────────────────────────┼───────────────────────────────┐
│                      TIER 2: FEATURE SERVICES                       │
│                                     │                               │
│  ┌─────────────┐  ┌──────────────┐ │  ┌────────────────────┐      │
│  │ TourManager │  │ CountryInfo  │ │  │ AttributeTable     │      │
│  └─────────────┘  └──────────────┘ │  └────────────────────┘      │
│                                     │                               │
│  ┌──────────────────────┐  ┌───────┴──────────┐                   │
│  │ VisualizationManager │  │ AnalysisManager  │                   │
│  └──────────────────────┘  └──────────────────┘                   │
│                                     │                               │
│  ┌──────────────┐                  │                               │
│  │ UploadHandler│                  │                               │
│  └──────────────┘                  │                               │
│                                     │                               │
└─────────────────────────────────────┼───────────────────────────────┘
                                      │
┌─────────────────────────────────────┼───────────────────────────────┐
│                       TIER 3: UI MANAGERS                           │
│                                     │                               │
│  ┌──────────────────────┐  ┌───────┴──────────┐                   │
│  │ ClassificationManager│◄─┤  PanelManager    │                   │
│  │                      │  │                  │                   │
│  │  (circular via       │─►│  (hub module)    │                   │
│  │   setter)            │  │                  │                   │
│  └──────────────────────┘  └──────────────────┘                   │
│                                     │                               │
│                            ┌────────┴────────┐                     │
│                            │                 │                     │
│  ┌──────────────────┐  ┌──┴──────────────┐  │                     │
│  │ MeasurementMgr   │  │ SwipeManager    │◄─┘                     │
│  └──────────────────┘  │                 │  (circular via setter)  │
│                        │  (late binding) │                         │
│  ┌──────────────────┐  └─────────────────┘                         │
│  │ ToolbarManager   │           │                                  │
│  └──────────────────┘           │                                  │
│                                 │                                  │
│  ┌──────────────┐  ┌────────────┴──┐  ┌──────────────┐           │
│  │ TabSystem    │  │ SearchManager │  │ WidgetManager│           │
│  └──────────────┘  └───────────────┘  └──────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼───────────────────────────────┐
│                    TIER 4: COMPLEX MANAGERS                         │
│                                     │                               │
│                        ┌────────────┴────────────┐                 │
│                        │   MapInitializer        │                 │
│                        │   (7 dependencies)      │                 │
│                        │   [God Object]          │                 │
│                        └─────────────────────────┘                 │
│                                     │                               │
└─────────────────────────────────────┼───────────────────────────────┘
                                      │
┌─────────────────────────────────────┼───────────────────────────────┐
│                     TIER 5: EVENT HANDLERS                          │
│                                     │                               │
│  ┌──────────────────┐  ┌───────────┴──────────┐                   │
│  │ MapEventHandler  │  │ CoordinateDisplay    │                   │
│  └──────────────────┘  └──────────────────────┘                   │
│                                                                     │
│  ┌────────────────────┐                                            │
│  │ WindowEventHandler │                                            │
│  └────────────────────┘                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Circular Dependency Details

### 1. ClassificationManager ↔ PanelManager

```
┌──────────────────────┐
│ ClassificationManager│
│                      │
│  needs PanelManager  │
│  for UI operations   │
└──────────┬───────────┘
           │
           │ setPanelManager()
           ↓
    ┌──────────────┐
    │ PanelManager │
    │              │
    │  needs       │
    │  Classification│
    │  Manager for │
    │  panel init  │
    └──────────────┘
           │
           │ constructor param
           ↑
┌──────────┴───────────┐
│ ClassificationManager│
│  (created with null) │
└──────────────────────┘

Resolution:
1. Create ClassificationManager with null PanelManager
2. Create PanelManager with ClassificationManager
3. Call classificationManager.setPanelManager(panelManager)
```

### 2. SwipeManager ↔ PanelManager

```
┌──────────────┐
│ SwipeManager │
│              │
│  needs       │
│  PanelManager│
│  for UI ops  │
└──────┬───────┘
       │
       │ constructor param
       ↓
┌──────────────┐
│ PanelManager │
│              │
│  needs       │
│  SwipeManager│
│  for panel   │
│  init        │
└──────────────┘
       │
       │ setSwipeManager()
       ↑
┌──────┴───────┐
│ SwipeManager │
│  (already    │
│   created)   │
└──────────────┘

Resolution:
1. Create SwipeManager with PanelManager
2. Call panelManager.setSwipeManager(swipeManager)
```

---

## Initialization Sequence

### Phase 1: Module Creation

```
START
  │
  ├─► Create StateManager
  ├─► Create NotificationManager
  │
  ├─► Create LayerManager
  ├─► Create BasemapManager
  ├─► Create DrawingManager
  ├─► Create PopupManager
  │
  ├─► Create TourManager
  ├─► Create CountryInfo
  ├─► Create VisualizationManager
  ├─► Create AnalysisManager
  ├─► Create AttributeTable
  ├─► Create UploadHandler
  │
  ├─► Create ClassificationManager (null PanelManager)
  ├─► Create PanelManager
  ├─► Wire: classificationManager.setPanelManager()
  │
  ├─► Create SwipeManager
  ├─► Wire: panelManager.setSwipeManager()
  ├─► Wire: swipeManager.setAnalysisManager()
  ├─► Wire: drawingManager.setSwipeManager()
  │
  ├─► Create MeasurementManager
  ├─► Create ToolbarManager
  ├─► Create TabSystem
  ├─► Create SearchManager
  ├─► Create WidgetManager
  │
  ├─► Create MapInitializer
  │
  ├─► Create MapEventHandler
  ├─► Create CoordinateDisplay
  ├─► Create WindowEventHandler
  │
  └─► All modules created ✓
```

### Phase 2: Async Initialization

```
initializeApplication()
  │
  ├─► MapInitializer.initializeMap()
  │     ├─► Load ArcGIS modules
  │     ├─► Create Map
  │     ├─► Create View
  │     ├─► Wait for view.when()
  │     ├─► Load default GeoJSON
  │     ├─► Initialize countries layer
  │     ├─► Setup tour
  │     ├─► Apply classification
  │     └─► Handle loading screen
  │
  ├─► Initialize UI Components
  │     ├─► ToolbarManager.initialize()
  │     ├─► LayerManager.setupCallbacks()
  │     ├─► TabSystem.initializeMapTabs()
  │     ├─► UploadHandler.initializeFileUpload()
  │     └─► WidgetManager.initializeFullscreenListener()
  │
  ├─► Initialize Event Handlers
  │     ├─► MapEventHandler.initializeEventHandlers()
  │     ├─► CoordinateDisplay.initialize()
  │     └─► WindowEventHandler.initialize()
  │
  ├─► Bind Window Functions
  │     └─► bindWindowFunctions(allManagers)
  │
  └─► Application Ready ✓
```

---

## Data Flow Diagram

### User Interaction Flow

```
User Action (click, hover, etc.)
  │
  ├─► Event Handler (MapEventHandler, WindowEventHandler)
  │     │
  │     ├─► Read State (StateManager)
  │     │
  │     ├─► Call Manager Method
  │     │     │
  │     │     ├─► Update State (StateManager)
  │     │     │
  │     │     ├─► Call Service (LayerManager, DrawingManager, etc.)
  │     │     │
  │     │     └─► Update UI (PanelManager, WidgetManager)
  │     │
  │     └─► Show Notification (NotificationManager)
  │
  └─► UI Update (DOM changes, map updates)
```

### Module Communication Patterns

```
1. Direct Dependency (Constructor Injection)
   ┌─────────┐
   │ Module A│─────► constructor(moduleB)
   └─────────┘

2. Setter Injection (Circular Dependency)
   ┌─────────┐
   │ Module A│◄────► setModuleB(moduleB)
   └─────────┘

3. State-Based Communication
   ┌─────────┐
   │ Module A│─────► StateManager.setState()
   └─────────┘
        │
        ↓
   ┌─────────┐
   │ Module B│◄───── StateManager.getState()
   └─────────┘

4. Callback Registration
   ┌─────────┐
   │ Module A│─────► moduleB.setupCallbacks(moduleA)
   └─────────┘
```

---

## Anti-Pattern Visualization

### God Object: MapInitializer

```
                    ┌──────────────────┐
                    │  MapInitializer  │
                    │                  │
                    │  7 dependencies  │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ↓                    ↓                    ↓
┌───────────────┐    ┌──────────────┐    ┌──────────────┐
│ StateManager  │    │ Notification │    │ TourManager  │
└───────────────┘    │   Manager    │    └──────────────┘
                     └──────────────┘
        │                    │                    │
        ↓                    ↓                    ↓
┌───────────────┐    ┌──────────────┐    ┌──────────────┐
│ LayerManager  │    │Classification│    │Visualization │
└───────────────┘    │   Manager    │    │   Manager    │
                     └──────────────┘    └──────────────┘
                             │
                             ↓
                     ┌──────────────┐
                     │WidgetManager │
                     └──────────────┘

Problem: Too many dependencies
Solution: Split into smaller initializers
```

### Hub Module: PanelManager

```
                     ┌──────────────┐
                     │ PanelManager │
                     │              │
                     │ 6 dependents │
                     └──────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ↑                   ↑                   ↑
┌───────────────┐   ┌──────────────┐   ┌──────────────┐
│Classification │   │ SwipeManager │   │ Measurement  │
│   Manager     │   └──────────────┘   │   Manager    │
└───────────────┘                      └──────────────┘
        │                   │                   │
        ↑                   ↑                   ↑
┌───────────────┐   ┌──────────────┐   ┌──────────────┐
│ ToolbarManager│   │WidgetManager │   │WindowEvent   │
└───────────────┘   └──────────────┘   │  Handler     │
                                       └──────────────┘

Problem: Too many dependents
Solution: Extract PanelService or use event bus
```

---

## Recommended Future Architecture

### Option 1: Dependency Injection Container

```
┌─────────────────────────────────────┐
│     Dependency Injection Container  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Module Registry             │   │
│  │  - StateManager (singleton) │   │
│  │  - NotificationManager      │   │
│  │  - LayerManager             │   │
│  │  - ...                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Dependency Resolver         │   │
│  │  - Resolves circular deps   │   │
│  │  - Manages lifecycle        │   │
│  │  - Validates dependencies   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         ├─► Automatic injection
         ├─► No manual wiring
         └─► Compile-time checking (with TypeScript)
```

### Option 2: Event Bus Pattern

```
┌─────────────────────────────────────┐
│          Event Bus                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Event Registry              │   │
│  │  - panel:open               │   │
│  │  - layer:added              │   │
│  │  - classification:applied   │   │
│  │  - ...                      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         ├─► emit('panel:open', data)
         ├─► on('panel:open', handler)
         └─► Loose coupling
```

---

## Summary

The current architecture is:
- ✅ Well-organized by tiers
- ✅ Properly documented
- ✅ Follows map application best practices
- ⚠️ Has acceptable circular dependencies
- ⚠️ Has some anti-patterns (God Object, Hub Module)
- ✅ Production-ready with room for improvement

The refactored `main.js` provides a clear, maintainable initialization system that can evolve as the application grows.
