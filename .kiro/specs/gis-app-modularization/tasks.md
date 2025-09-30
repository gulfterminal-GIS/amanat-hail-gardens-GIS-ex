# Implementation Plan

- [x] 1. Set up project structure and core configuration
  - Create js/ directory structure with core/, ui/, layers/, tools/, features/, and events/ subdirectories
  - Create js/core/config.js with all configuration constants extracted from script.js
  - Create js/main.js as the new entry point that will orchestrate module loading
  - Update index.html to load main.js as ES6 module instead of script.js
  - _Requirements: 1.2, 1.4, 3.1, 3.5_

- [-] 2. Convert script.js to ES6 module and update main.js

  - [-] 2.1 Convert script.js to ES6 module with export statements

    - Add export statements at the end of script.js for all functions that will be used by other modules
    - Export key functions: initializeMap, initializeUI, initializeEventHandlers, loadModule, showNotification, openSidePanel, closeSidePanel
    - Export layer functions: loadGeoJSON, loadCSV, handleFiles, toggleLayer, removeLayer, updateLayerList
    - Export drawing functions: startDrawingWithTool, clearAll, initializeSketchViewModel
    - Export other utility functions as needed by future modules
    - **Keep all global variables within script.js** - do not modify the internal structure
    - _Requirements: 1.2, 1.3, 4.1, 4.2_
  
  - [ ] 2.2 Update main.js to import and use script.js as ES6 module
    - Remove the current global variable assignments from main.js
    - Import the initializeMap function from script.js
    - Call initializeMap directly instead of through window object
    - Remove the dynamic import of script.js
    - Ensure main.js is clean and only handles application initialization
    - _Requirements: 1.1, 4.3, 4.4_
  
  - [ ] 2.3 Verify all functionality works with script.js as ES6 module
    - Test that the map initializes correctly
    - Verify all toolbar buttons and panels work
    - Test file upload, layer management, and drawing tools
    - Ensure tour system and all widgets function properly
    - Confirm no breaking changes in any existing functionality
    - _Requirements: 1.1, 4.4, 4.5_

- [ ] 3. Extract UI component modules (importing from script.js)
  - [ ] 3.1 Create js/ui/toolbar.js for toolbar functionality
    - Import required functions from script.js (openSidePanel, showNotification, etc.)
    - Create ToolbarManager class with methods for toolbar setup and button handling
    - Use imported functions directly instead of global access
    - Preserve all existing event handlers and functionality
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 3.2 Create js/ui/panels.js for side panel management
    - Import panel-related functions from script.js (openSidePanel, closeSidePanel, etc.)
    - Create PanelManager class with methods for panel operations
    - Use imported functions for notifications and formatting
    - Maintain all existing panel templates and content loading
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 3.3 Create js/ui/search.js for search functionality
    - Import search-related functions from script.js
    - Create SearchManager class with search input and suggestion methods
    - Use imported functions for notifications and formatting
    - Preserve all existing search behavior and ArcGIS search integration
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 4. Extract layer management modules (importing from script.js)
  - [ ] 4.1 Create js/layers/layer-manager.js for layer operations
    - Import layer functions from script.js (toggleLayer, removeLayer, updateLayerList, etc.)
    - Create LayerManager class with methods for layer CRUD operations
    - Use imported functions for notifications and formatting
    - Maintain uploadedLayers array access through script.js module
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [ ] 4.2 Create js/layers/upload-handler.js for file processing
    - Import file processing functions from script.js (handleFiles, loadGeoJSON, loadCSV, etc.)
    - Create UploadHandler class with file processing methods
    - Use imported functions for notifications and error handling
    - Preserve all existing file format support and error handling
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 4.3 Create js/layers/basemap-switcher.js for basemap functionality
    - Import basemap-related functions from script.js
    - Create BasemapSwitcher class with basemap selection methods
    - Use imported functions for notifications
    - Maintain all existing basemap options and selection behavior
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 5. Extract drawing and analysis tool modules (importing from script.js)
  - [ ] 5.1 Create js/tools/drawing-tools.js for sketch functionality
    - Import drawing functions from script.js (startDrawingWithTool, clearAll, initializeSketchViewModel, etc.)
    - Create DrawingTools class with methods for each drawing tool type
    - Use imported functions for notifications and formatting
    - Preserve all existing drawing settings, color picker, and opacity controls
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 5.2 Create js/tools/analysis-tools.js for spatial analysis
    - Import analysis functions from script.js
    - Create AnalysisTools class with methods for each analysis type
    - Use imported functions for notifications and calculations
    - Maintain all existing analysis workflows and result display
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 5.3 Create js/tools/measurement.js for measurement functionality
    - Import measurement functions from script.js
    - Create MeasurementTools class with measurement methods
    - Use imported functions for formatting and notifications
    - Preserve all existing measurement display and result formatting
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 6. Extract feature and widget modules (importing from script.js)
  - [ ] 6.1 Create js/features/popup-manager.js for popup functionality
    - Import popup functions from script.js (showCustomPopupTour, etc.)
    - Create PopupManager class with popup display and content methods
    - Use imported functions for attribute formatting and notifications
    - Maintain all existing popup templates and attribute formatting
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 6.2 Create js/features/attribute-table.js for data table
    - Import table-related functions from script.js
    - Create AttributeTable class with table display and interaction methods
    - Use imported functions for formatting and notifications
    - Preserve all existing table formatting, sorting, and export features
    - _Requirements: 1.2, 1.5, 3.2, 3.3_
  
  - [ ] 6.3 Create js/features/tour-system.js for feature tour
    - Import tour functions from script.js (startFeatureTour, stopFeatureTour, etc.)
    - Create TourSystem class with tour management and navigation methods
    - Use imported functions for notifications and formatting
    - Maintain all existing tour functionality and automatic tour startup
    - _Requirements: 1.2, 1.5, 3.2, 3.3_

- [ ] 7. Extract visualization and classification modules (importing from script.js)
  - [ ] 7.1 Create js/tools/visualization.js for heatmap and time animation
    - Import visualization functions from script.js
    - Create VisualizationTools class with heatmap and time animation methods
    - Use imported functions for notifications and calculations
    - Preserve all existing visualization settings and controls
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 7.2 Create js/features/classification.js for data classification
    - Import classification functions from script.js
    - Create ClassificationManager class with classification methods
    - Use imported functions for notifications and formatting
    - Maintain all existing classification types and color generation
    - _Requirements: 1.2, 1.5, 3.2, 3.3_

- [ ] 8. Extract event handling and notification modules (importing from script.js)
  - [ ] 8.1 Create js/events/event-handlers.js for global event coordination
    - Import event handling functions from script.js
    - Create EventHandler class with centralized event management
    - Use imported functions for coordinate formatting and notifications
    - Preserve all existing event handling behavior and coordinate updates
    - _Requirements: 1.2, 1.5, 3.2_
  
  - [ ] 8.2 Create js/events/notifications.js for user feedback system
    - Import notification functions from script.js (showNotification, etc.)
    - Create NotificationManager class with notification display methods
    - Use imported functions for message formatting
    - Maintain all existing notification types and display behavior
    - _Requirements: 1.2, 1.5, 3.2_

- [ ] 9. Create widget management module (importing from script.js)
  - [ ] 9.1 Create js/ui/widgets.js for custom widgets
    - Import widget-related functions from script.js
    - Create WidgetManager class with widget lifecycle methods
    - Use imported functions for notifications and formatting
    - Preserve all existing widget functionality and positioning
    - _Requirements: 1.2, 1.5, 3.2, 3.3_

- [ ] 10. Update main.js for complete module integration
  - [ ] 10.1 Import all created modules in main.js
    - Add import statements for all module classes created in previous tasks
    - Initialize all managers and tools in the correct order
    - Ensure script.js module is imported and initialized first
    - Verify all modules can access script.js functions through imports
    - _Requirements: 1.1, 1.5, 4.4_
  
  - [ ] 10.2 Verify complete application functionality with modular system
    - Test all toolbar buttons and their associated panels
    - Verify all drawing tools, analysis functions, and widgets work correctly
    - Confirm file upload, layer management, and basemap switching functionality
    - Ensure tour system, popups, and attribute table operate as expected
    - Verify script.js module and other modules work together seamlessly
    - _Requirements: 1.1, 3.2, 3.4, 4.4_

- [ ] 11. Optional cleanup and optimization
  - [ ] 11.1 Extract utility functions to utils.js (optional)
    - Create js/utils/utils.js with common utility functions if desired
    - Export utility functions using ES6 export syntax
    - Update modules to import from utils.js instead of script.js for utilities
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [ ] 11.2 Final optimization and cleanup
    - Optimize module imports and minimize any circular dependencies
    - Add proper error handling for module loading failures
    - Remove any unused code or redundant imports
    - Verify complete application functionality after cleanup
    - _Requirements: 1.1, 1.5, 4.5_