define(function(require) {

  var Backbone = require("backbone");
  var L = require("leaflet");
  var Utils = require("utils");

  var MapView = Utils.Page.extend({

    constructorName: "MapView",

    id: "fullmap",

    initialize: function(options) {
      // when I am in the DOM, I can start adding all the Leaflet stuff
      this.listenTo(this, "inTheDOM", this.addMap);
    },

    render: function() {
      return this;
    },

    addMap: function() {

      //if there are coords on the sessionstorage load them
      if(sessionStorage.originlat!=0&&sessionStorage.originlong!=0&&sessionStorage.destinationlat!=0&&sessionStorage.destinationlong!=0){
        var originDest = [L.latLng(sessionStorage.originlat, sessionStorage.originlong), L.latLng(sessionStorage.destinationlat, sessionStorage.destinationlong)];      
      }else{
        //If there is nothing on the db just load some static
        var originDest = [L.latLng(42.3676443, 13.3496695), L.latLng(42.4786543, 13.2586796)];
      }
      
      // the center of the map is the address of the origin
      var options = {
        center: originDest[0],
        zoom: 11
      };

      
      // create the map
      var map = L.map('fullmap', options);
      // say thanks to Leaflet
      map.attributionControl.setPrefix("Leaflet");

      // create a marker of the origin and dest and add it to the map
      var originMarker = L.marker(originDest[0]).addTo(map);
      originMarker.bindPopup("<b>Origin</b>").openPopup();
      var destinationMarker = L.marker(originDest[1]).addTo(map);
      destinationMarker.bindPopup("<b>Destination</b>");

      var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap',
        maxZoom: 20
      });
      map.addLayer(layer);

      //create a line between the two points
      var polyline = L.polyline(originDest, {color: 'red'}).addTo(map);

    }
  });

  return MapView;

});