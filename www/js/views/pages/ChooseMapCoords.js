define(function(require) {

  var Backbone = require("backbone");
  var L = require("leaflet");
  var Utils = require("utils");

  

  var ChooseMapCoords = Utils.Page.extend({

    constructorName: "ChooseMapCoords",

    id: "fullmap",

    initialize: function(options) {
      // when I am in the DOM, I can start adding all the Leaflet stuff
      this.listenTo(this, "inTheDOM", this.addMap);
    },

    render: function() {
      return this;
    },

    addMap: function() {

      var makeMarker = null;

      //check if we entered again
      if(sessionStorage.chooseCoordinatesFor == "origin"){
        if(sessionStorage.createdOriginLatitude && sessionStorage.createdOriginLongitude){
          var center = new L.latLng(sessionStorage.createdOriginLatitude, sessionStorage.createdOriginLongitude);
          makeMarker = true;
        }else{
          var center = new L.latLng(42.21225, 13.22754);
        }
      }else if(sessionStorage.chooseCoordinatesFor == "destination"){
        if(sessionStorage.createdDestinationLatitude && sessionStorage.createdDestinationLongitude){
          var center = new L.latLng(sessionStorage.createdDestinationLatitude, sessionStorage.createdDestinationLongitude);
          makeMarker = true;
        }else{
          var center = new L.latLng(42.21225, 13.22754);
        }
      }else{
        var center = new L.latLng(42.21225, 13.22754);
      }
      
      
      // the center of the map is the address of the origin
      var options = {
        center: center,
        zoom: 8
      };

      
      // create the map
      var map = L.map('fullmap', options);
      // say thanks to Leaflet
      map.attributionControl.setPrefix("Leaflet");

      var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap',
        maxZoom: 20
      });
      map.addLayer(layer);

      if(makeMarker){
        var marker = L.marker(center).addTo(map);
      }

      //adds a click listener so that when we click it gives the coordinates
      map.on('click', function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);

        if(sessionStorage.chooseCoordinatesFor == "origin"){
          sessionStorage.createdOriginLatitude = e.latlng.lat;
          sessionStorage.createdOriginLongitude = e.latlng.lng;
          Backbone.history.navigate("createtripview", {
            trigger: true
          });
        }else{
          sessionStorage.createdDestinationLatitude = e.latlng.lat;
          sessionStorage.createdDestinationLongitude = e.latlng.lng;
          Backbone.history.navigate("createtripview", {
            trigger: true
          });
        }
      });


    }
  });

  return ChooseMapCoords;

});