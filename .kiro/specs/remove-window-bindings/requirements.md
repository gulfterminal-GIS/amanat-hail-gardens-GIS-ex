# Requirements Document

## Introduction

This specification addresses the optimization of window bindings in the GIS application. Currently, the application exposes numerous functions on the global window object, including both legitimate bindings needed for HTML inline event handlers and unnecessary backward compatibility globals from StateManager.

The goal of this phase is to:
1. Remove unnecessary window globals from StateManager that were added for "backward compatibility during transition"
2. Document the legitimate window bindings API that supports HTML inline event handlers

**Out of Scope**: This phase does NOT include removing inline HTML event handlers or refactoring HTML to use addEventListener. That will be addressed in a separate spec focused on HTML refactoring.

**Implementation Note:** This is a focused optimization phase that cleans up unnecessary globals while maintaining all existing functionality. All inline HTML event handlers will continue to work exactly as before.

## Glossary

- **Window Binding**: A function or object attached to the global `window` object, making it accessible from anywhere in the application including inline HTML event handlers
- **Inline Event Handler**: HTML attributes like `onclick="functionName()"` that execute JavaScript code directly in the markup
- **Event Listener**: JavaScript code that programmatically attaches event handlers to DOM elements using methods like `addEventListener()`
- **GIS Application**: The geographic information system web application being refactored
- **Module**: A self-contained JavaScript file that exports specific functionality
- **Manager**: A class or object responsible for coordinating a specific feature area (e.g., LayerManager, ToolbarManager)

## Requirements

### Requirement 1

**User Story:** As a developer, I want to remove unnecessary window globals from StateManager, so that the global namespace is cleaner and more secure

#### Acceptance Criteria

1. THE GIS Application SHALL remove all backward compatibility window assignments from StateManager setter methods
2. WHEN StateManager sets internal state, THE GIS Application SHALL NOT create corresponding window globals
3. THE GIS Application SHALL maintain all StateManager functionality without window global assignments
4. THE GIS Application SHALL verify that all modules continue to work correctly after removing window globals

### Requirement 2

**User Story:** As a security auditor, I want to understand what functions are exposed globally, so that I can assess the application's security posture

#### Acceptance Criteria

1. THE GIS Application SHALL document each window binding with comprehensive JSDoc comments
2. WHEN a function is exposed on window, THE GIS Application SHALL document which HTML elements call it
3. THE GIS Application SHALL include security notes for each window binding
4. THE GIS Application SHALL provide a clear inventory of all window-exposed functions

### Requirement 3

**User Story:** As a maintainer, I want to distinguish between legitimate and unnecessary window bindings, so that I can plan future refactoring efforts

#### Acceptance Criteria

1. THE GIS Application SHALL document which window bindings are required for HTML inline handlers
2. THE GIS Application SHALL provide justification for each window binding in code comments
3. THE GIS Application SHALL create tools to audit the current window bindings
4. THE GIS Application SHALL establish a baseline for future HTML refactoring phases

### Requirement 4

**User Story:** As a developer, I want modules to use direct references instead of window bindings, so that dependencies are explicit and testable

#### Acceptance Criteria

1. THE GIS Application SHALL pass manager instances through constructors instead of accessing via window
2. WHEN a module needs to call another module, THE GIS Application SHALL use direct method calls
3. THE GIS Application SHALL store event handlers as instance properties instead of window globals
4. THE GIS Application SHALL make module dependencies explicit and traceable

### Requirement 5

**User Story:** As a developer, I want this refactoring to be non-breaking, so that all existing functionality continues to work

#### Acceptance Criteria

1. THE GIS Application SHALL maintain all inline HTML event handlers unchanged
2. WHEN removing window globals from StateManager, THE GIS Application SHALL verify no code depends on them
3. THE GIS Application SHALL test all features after changes to ensure no regressions
4. THE GIS Application SHALL prioritize stability over architectural changes

### Requirement 6

**User Story:** As a developer, I want comprehensive testing after changes, so that I can be confident nothing broke

#### Acceptance Criteria

1. THE GIS Application SHALL test all toolbar buttons and quick actions after changes
2. THE GIS Application SHALL test all modal dialogs and panel interactions
3. THE GIS Application SHALL test all widget controls and features
4. THE GIS Application SHALL verify no console errors about undefined globals

### Requirement 7

**User Story:** As a developer, I want the refactoring to respect the sensitivity of map applications, so that the application remains stable

#### Acceptance Criteria

1. THE GIS Application SHALL maintain the current implementation approach for all HTML event handlers
2. THE GIS Application SHALL preserve the existing initialization timing and sequence
3. THE GIS Application SHALL make only targeted changes to StateManager
4. THE GIS Application SHALL prioritize stability and minimal disruption

### Requirement 8

**User Story:** As a developer, I want this phase to set up for future HTML refactoring, so that the next phase has a clear foundation

#### Acceptance Criteria

1. THE GIS Application SHALL document which window bindings are candidates for future removal
2. THE GIS Application SHALL identify HTML elements that will need event listener migration
3. THE GIS Application SHALL provide a clear baseline of current window bindings
4. THE GIS Application SHALL document the path forward for HTML refactoring
