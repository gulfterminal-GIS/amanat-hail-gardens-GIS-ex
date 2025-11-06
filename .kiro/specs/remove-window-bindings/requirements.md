# Requirements Document

## Introduction

This specification addresses the removal of unnecessary window bindings from the GIS application. Currently, the application exposes numerous functions on the global window object to support inline HTML event handlers (onclick, onchange, etc.). This approach creates security risks, makes the codebase harder to maintain, and violates modern JavaScript best practices. The goal is to refactor the application to use proper event listeners attached programmatically, eliminating the need for most window bindings while maintaining full functionality.

This refactoring will be performed incrementally, module by module, building on the architecture established in the `gis-app-modularization` spec. Each module will be migrated independently to minimize risk and allow for testing between changes.

After completing the window bindings removal, the initialization process in `main.js` will be redesigned to follow modern JavaScript best practices and common initialization patterns.

**Implementation Note:** Avoid commenting out large portions of code in long files as this can cause IDE performance issues. Instead, delete obsolete code or notify for manual review when large-scale changes are needed.

## Glossary

- **Window Binding**: A function or object attached to the global `window` object, making it accessible from anywhere in the application including inline HTML event handlers
- **Inline Event Handler**: HTML attributes like `onclick="functionName()"` that execute JavaScript code directly in the markup
- **Event Listener**: JavaScript code that programmatically attaches event handlers to DOM elements using methods like `addEventListener()`
- **GIS Application**: The geographic information system web application being refactored
- **Module**: A self-contained JavaScript file that exports specific functionality
- **Manager**: A class or object responsible for coordinating a specific feature area (e.g., LayerManager, ToolbarManager)

## Requirements

### Requirement 1

**User Story:** As a developer, I want to eliminate inline HTML event handlers, so that the application follows modern JavaScript best practices and improves security

#### Acceptance Criteria

1. THE GIS Application SHALL replace all inline HTML event handlers (onclick, onchange, etc.) with programmatically attached event listeners
2. WHEN an HTML element requires event handling, THE GIS Application SHALL attach event listeners using addEventListener() in the corresponding module
3. THE GIS Application SHALL remove all window function bindings that were only needed for inline event handlers
4. THE GIS Application SHALL maintain identical user-facing functionality after removing inline handlers

### Requirement 2

**User Story:** As a security auditor, I want to minimize the global API surface, so that the application has fewer potential security vulnerabilities

#### Acceptance Criteria

1. THE GIS Application SHALL expose on the window object only functions that have a legitimate external requirement
2. THE GIS Application SHALL document the justification for each remaining window binding
3. WHEN a function can be accessed through module imports or event listeners, THE GIS Application SHALL NOT expose it on the window object
4. THE GIS Application SHALL reduce the number of window bindings by at least 80% from the current implementation

### Requirement 3

**User Story:** As a maintainer, I want clear separation between internal and external APIs, so that I can refactor internal code without breaking external dependencies

#### Acceptance Criteria

1. THE GIS Application SHALL distinguish between internal module functions and external API functions
2. THE GIS Application SHALL encapsulate all internal functionality within modules without window exposure
3. WHERE a function must remain on the window object for external access, THE GIS Application SHALL document this requirement in code comments
4. THE GIS Application SHALL provide a clear migration path for any remaining window bindings

### Requirement 4

**User Story:** As a developer, I want HTML templates to be decoupled from JavaScript function names, so that I can refactor code without updating HTML

#### Acceptance Criteria

1. THE GIS Application SHALL use data attributes or CSS classes to identify interactive elements instead of inline handlers
2. WHEN a module initializes, THE GIS Application SHALL query for relevant DOM elements and attach event listeners
3. THE GIS Application SHALL use event delegation where appropriate to handle dynamically created elements
4. THE GIS Application SHALL maintain a clear mapping between DOM elements and their event handlers within each module

### Requirement 5

**User Story:** As a developer, I want to organize event handling logic within the appropriate modules, so that related code stays together

#### Acceptance Criteria

1. THE GIS Application SHALL place event handler logic in the same module that manages the related feature
2. WHEN a widget has interactive controls, THE GIS Application SHALL handle those events within the widget's module
3. THE GIS Application SHALL initialize event listeners during module initialization or setup phases
4. THE GIS Application SHALL provide cleanup methods to remove event listeners when features are disabled or destroyed

### Requirement 6

**User Story:** As a developer, I want to migrate window bindings incrementally, so that I can test each change and minimize risk

#### Acceptance Criteria

1. THE GIS Application SHALL migrate window bindings one module at a time following the architecture from the gis-app-modularization spec
2. WHEN a module is migrated, THE GIS Application SHALL update both the JavaScript module and corresponding HTML templates in the same step
3. THE GIS Application SHALL verify functionality after each module migration before proceeding to the next module
4. THE GIS Application SHALL reference the design and task notes from the gis-app-modularization spec to maintain architectural consistency
5. WHEN large-scale code changes are needed, THE GIS Application SHALL delete obsolete code rather than commenting it out to avoid IDE performance issues

### Requirement 7

**User Story:** As a developer, I want the refactoring to respect the sensitivity of map applications, so that the application remains stable and functional throughout the migration

#### Acceptance Criteria

1. THE GIS Application SHALL maintain the current implementation approach unless changes are explicitly suggested and approved
2. WHEN refactoring event handling, THE GIS Application SHALL preserve the existing initialization timing and sequence
3. THE GIS Application SHALL handle map-related event listeners with care due to the sensitivity of ArcGIS API interactions
4. WHEN proposing changes to the current implementation, THE GIS Application SHALL present suggestions for review before implementation
5. THE GIS Application SHALL prioritize stability and minimal disruption over architectural purity during the migration

### Requirement 8

**User Story:** As a developer, I want the initialization process redesigned after window bindings removal, so that the application follows modern JavaScript best practices

#### Acceptance Criteria

1. WHEN all window bindings are removed, THE GIS Application SHALL redesign the main.js initialization process
2. THE GIS Application SHALL follow common initialization patterns and best practices for modern JavaScript applications
3. THE GIS Application SHALL implement a clear and maintainable initialization sequence
4. THE GIS Application SHALL document the initialization flow and module dependencies
5. THE GIS Application SHALL ensure the new initialization process is more maintainable than the current implementation
