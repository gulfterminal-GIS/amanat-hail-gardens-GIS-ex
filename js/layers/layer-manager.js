/**
 * LayerManager - Manages layer operations including visibility, removal, zoom, and list updates
 * 
 * This module handles all layer CRUD operations and maintains the layer list UI.
 * It uses StateManager for accessing global state (uploadedLayers, map, view).
 */

export class LayerManager {
  constructor(stateManager, notificationManager) {
    this.stateManager = stateManager;
    this.notificationManager = notificationManager;
    
    // Store callbacks that should be triggered when layer list updates
    this.updateCallbacks = [];
  }

  /**
   * Register a callback to be called when layer list updates
   * @param {Function} callback - Function to call after layer list updates
   */
  onLayerListUpdate(callback) {
    if (typeof callback === 'function') {
      this.updateCallbacks.push(callback);
    }
  }

  /**
   * Remove a callback from the update list
   * @param {Function} callback - Function to remove
   */
  offLayerListUpdate(callback) {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  /**
   * Trigger all registered callbacks
   * @private
   */
  _triggerUpdateCallbacks() {
    this.updateCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in layer list update callback:', error);
      }
    });
  }

  /**
   * Setup callbacks for layer list updates
   * This replaces the old registerLayerManagerCallbacks pattern from script.js
   * @param {AttributeTable} attributeTable - AttributeTable instance
   * @param {VisualizationManager} visualizationManager - VisualizationManager instance
   * @param {AnalysisManager} analysisManager - AnalysisManager instance
   * @param {SwipeManager} swipeManager - SwipeManager instance
   */
  setupCallbacks(attributeTable, visualizationManager, analysisManager, swipeManager) {
    // Callback 1: Update attribute table layer select when layers change
    this.onLayerListUpdate(() => {
      const tableWidget = document.getElementById("attributeTableWidget");
      if (tableWidget && !tableWidget.classList.contains("hidden")) {
        if (attributeTable && typeof attributeTable.initializeTableLayerSelect === 'function') {
          attributeTable.initializeTableLayerSelect();
        }
      }
    });

    // Callback 2: Update heatmap layer select when layers change
    this.onLayerListUpdate(() => {
      if (
        window.heatmapEnabled &&
        visualizationManager &&
        typeof visualizationManager.updateHeatmapLayerSelect === 'function'
      ) {
        visualizationManager.updateHeatmapLayerSelect();
      }
    });

    // Callback 3: Add analysis layer to layer list if it has graphics
    this.onLayerListUpdate(() => {
      if (analysisManager) {
        const analysisLayer = analysisManager.getAnalysisLayer();
        if (
          analysisLayer &&
          analysisLayer.graphics &&
          analysisLayer.graphics.length > 0
        ) {
          const layerList = document.getElementById("layerList");
          if (layerList) {
            const analysisItem = document.createElement("div");
            analysisItem.className = "layer-item";
            analysisItem.innerHTML = `
              <input type="checkbox" class="layer-checkbox" 
                     ${analysisLayer.visible ? "checked" : ""} 
                     onchange="analysisLayer.visible = this.checked">
              <label class="layer-name">Analysis Results (${
                analysisLayer.graphics.length
              })</label>
              <div class="layer-actions">
                <button onclick="clearAnalysisResults()" title="Clear results">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `;
            layerList.appendChild(analysisItem);
          }
        }
      }
    });

    // Callback 4: Update swipe panel layer selects when layers change
    this.onLayerListUpdate(() => {
      const swipePanel = document.querySelector("#sidePanelContent #swipeLayer1Select");
      if (swipePanel && swipeManager && typeof swipeManager.updateSwipeLayerSelects === 'function') {
        swipeManager.updateSwipeLayerSelects();
      }
    });

    console.log(
      "✅ LayerManager callbacks registered (attribute table, heatmap, analysis, swipe)"
    );
  }

  /**
   * Toggle layer visibility
   * @param {number} index - Index of the layer in uploadedLayers array
   */
  toggleLayer(index) {
    const layers = this.stateManager.getUploadedLayers() || [];
    if (layers[index]) {
      layers[index].visible = !layers[index].visible;
    }
  }

  /**
   * Zoom to layer extent
   * @param {number} index - Index of the layer in uploadedLayers array
   */
  async zoomToLayer(index) {
    const layer = (this.stateManager.getUploadedLayers() || [])[index];
    if (layer && layer.fullExtent) {
      const view = this.stateManager.getView();
      if (view) {
        await view.goTo(layer.fullExtent);
      }
    }
  }

  /**
   * Remove layer from map and state
   * @param {number} index - Index of the layer in uploadedLayers array
   */
  removeLayer(index) {
    const layer = (this.stateManager.getUploadedLayers() || [])[index];
    if (layer) {
      const map = this.stateManager.getMap();
      if (map) {
        map.remove(layer);
      }
    }
    this.stateManager.removeUploadedLayer(index);
    this.updateLayerList();
  }

  /**
   * Update the layer list UI
   * Updates both the main layer list and the side panel layer list if present
   */
  updateLayerList() {
    const layerList = document.getElementById("layerList");

    // Check if we're in the side panel or original location
    const panelLayerList = document.querySelector("#sidePanelContent #layerList");
    const targetList = panelLayerList || layerList;

    if (!targetList) return;

    const layers = this.stateManager.getUploadedLayers() || [];
    
    if (layers.length === 0) {
      targetList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-layer-group"></i>
          <p>No layers loaded</p>
        </div>
      `;
    } else {
      targetList.innerHTML = layers
        .map((layer, index) => `
          <div class="layer-item">
            <input type="checkbox" class="layer-checkbox" id="layer-${index}" 
                  ${layer.visible ? "checked" : ""} onchange="toggleLayer(${index})">
            <label for="layer-${index}" class="layer-name">${layer.title}</label>
            <div class="layer-actions">
              <button onclick="zoomToLayer(${index})" title="Zoom to layer">
                <i class="fas fa-search-plus"></i>
              </button>
              <button onclick="removeLayer(${index})" title="Remove layer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join("");
    }

    // Trigger all registered callbacks (for attribute table, heatmap, analysis, legend, etc.)
    this._triggerUpdateCallbacks();
  }

  /**
   * Get all uploaded layers
   * @returns {Array} Array of uploaded layers
   */
  getUploadedLayers() {
    return this.stateManager.getUploadedLayers() || [];
  }

  /**
   * Get a specific layer by index
   * @param {number} index - Index of the layer
   * @returns {Object|null} The layer object or null if not found
   */
  getLayerByIndex(index) {
    const layers = this.stateManager.getUploadedLayers() || [];
    return layers[index] || null;
  }

  /**
   * Get a layer by its ID
   * @param {string} id - The layer ID
   * @returns {Object|null} The layer object or null if not found
   */
  getLayerById(id) {
    const layers = this.stateManager.getUploadedLayers() || [];
    return layers.find(layer => layer.id === id) || null;
  }

  /**
   * Add a layer to the map and state
   * @param {Object} layer - The layer to add
   */
  addLayer(layer) {
    const map = this.stateManager.getMap();
    if (map) {
      map.add(layer);
    }
    this.stateManager.addUploadedLayer(layer);
    this.updateLayerList();
  }
}
