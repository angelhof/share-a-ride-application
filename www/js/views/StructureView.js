define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "main",

    events: {
      "tap #nav1": "searchTripView",
      "tap #nav2": "signupView",
      "tap #nav3": "profileView",
      "tap #nav4": "loginView",
      "tap #nav5": "tripView",
      "tap #nav6": "listTripView",
      "tap #nav7": "createTripView",
      "tap #settings": "settingsView",
      "tap #backButton": "goBack"
    },

    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },

    // rendered: function(e) {
    // },

    // generic go-back function
    goBack: function() {
      //window.history.back();
    },

   


    profileView: function(event) {
      Backbone.history.navigate("profileview", {
        trigger: true
      });
    },
    tripView: function(event) {
      Backbone.history.navigate("tripview", {
        trigger: true
      });
    },
    settingsView: function(event) {
      Backbone.history.navigate("settingsview", {
        trigger: true
      });
    },
    loginView: function(event) {
      Backbone.history.navigate("loginview", {
        trigger: true
      });
    },
    signupView: function(event) {
      Backbone.history.navigate("signupview", {
        trigger: true
      });
    },
    searchTripView: function(event) {
      Backbone.history.navigate("searchtripview", {
        trigger: true
      });
    },
    listTripView: function(event) {
      Backbone.history.navigate("listtripview", {
        trigger: true
      });
    },
    createTripView: function(event) {
      Backbone.history.navigate("createtripview", {
        trigger: true
      });
    },
    goBack: function(event){
      Backbone.history.navigate("goback", {
        trigger: true
      });
    }
  });

  return StructureView;

});