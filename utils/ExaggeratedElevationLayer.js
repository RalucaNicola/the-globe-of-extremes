define([
  "esri/layers/ElevationLayer",
  "esri/layers/BaseElevationLayer"
], function(ElevationLayer, BaseElevationLayer) {

  return BaseElevationLayer.createSubclass({

    properties: {
      exaggerationTopography: null,
      exaggerationBathymetry: null
    },

    load: function() {
      this._elevation = new ElevationLayer({
        url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/TopoBathy3D/ImageServer"
      });
      this.addResolvingPromise(this._elevation.load());
    },

    fetchTile: function(level, row, col) {
      return this._elevation.fetchTile(level, row, col).then(
        function(data) {
          for (let i = 0; i < data.values.length; i++) {
            if (data.values[i] >= 0) {
              data.values[i] = data.values[i] * this.exaggerationTopography;
            }
            else {
              data.values[i] = data.values[i] * this.exaggerationBathymetry;
            }
          }
          return data;
        }.bind(this));
    }
  });
});
