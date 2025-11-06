/**
 * WindowEventHandler - Manages window-level events
 * 
 * This module handles:
 * - Window resize events
 * - Responsive UI adjustments
 * - Popup management on resize
 * 
 * Extracted from script.js as part of the modularization effort.
 */

export class WindowEventHandler {
  constructor(popupManager, panelManager) {
    this.popupManager = popupManager;
    this.panelManager = panelManager;
    this.resizeTimeout = null;
  }

  /**
   * Initialize window event listeners
   */
  initialize() {
    window.addEventListener("resize", () => this.handleResize());
  }

  /**
   * Handle window resize event
   * @private
   */
  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      // Close popup on resize
      this.popupManager.closeCustomPopup();

      // Adjust mobile UI
      const controlPanel = document.querySelector(".control-panel");
      if (
        window.innerWidth < 768 &&
        controlPanel &&
        !controlPanel.classList.contains("collapsed")
      ) {
        // Close side panel on mobile resize
        this.panelManager.closeSidePanel();
      }
    }, 250);
  }
}
