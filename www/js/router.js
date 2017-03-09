define(function(require) {
  var $ = require("jquery");
  var Backbone = require("backbone");
  require("baasbox");
  var spinner = require("spinner");

  //Models
  var MyModel = require("models/MyModel");
  var TripModel = require("models/TripModel");
  var ReviewModel = require("models/ReviewModel");
  var UserProfileModel = require("models/UserProfileModel");

  //Views
  var StructureView = require("views/StructureView");
  var MyView = require("views/pages/MyView");
  var MapView = require("views/pages/MapView");
  var ChooseMapCoords = require("views/pages/ChooseMapCoords");
  var ProfileView = require("views/pages/ProfileView");
  var SmallTripView = require("views/pages/SmallTripView");
  var LoginView = require("views/pages/LoginView");
  var SignupView = require("views/pages/SignupView");
  var TripView = require("views/pages/TripView");
  var ListTripView = require("views/pages/ListTripView");
  var SearchTripView = require("views/pages/SearchTripView");
  var CreateTripView = require("views/pages/CreateTripView");
  var CreateReview = require("views/pages/CreateReview");
  var SettingsView = require("views/pages/SettingsView");

  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is the structure view
      "": "showStructure",
      "myview": "myView",
      "map": "map",
      "choosemapcoords": "chooseMapCoords",
      "profileview(/:id)": "profileView",
      "addtrip": "addTrip",
      "loginview": "loginView",
      "signupview": "signupView",
      "tripview": "tripView",
      "tripview/:id": "tripView",
      "listtripview": "listTripView",
      "listtripview/:query": "listTripView",
      "searchtripview": "searchTripView",
      "createtripview": "createTripView",
      "createreview/:id": "createReview",
      "settingsview": "settingsView",
      "goback": "goBack"
    },

    firstView: "loginview",


   


    initialize: function(options) {
     // spinner.spin(document.body);
      BAASBOX_URL = "http://localhost:9000";
      BAASBOX_APP_CODE = "1234567890";

      sessionStorage.baasboxURL = BAASBOX_URL;
      sessionStorage.baasboxAppCode = BAASBOX_APP_CODE;

      BaasBox.setEndPoint(BAASBOX_URL); //the address of your BaasBox server
      BaasBox.appcode = BAASBOX_APP_CODE;               //the application code of your server
      


      this.currentView = undefined;
    },

    profileView: function(id) {
        var model = new UserProfileModel({
          id: id
        });
        // create the view
        var page = new ProfileView({
          model: model
        });
        // show the view
        this.changePage(page);
    },
    settingsView: function() {
        var model = new MyModel({
          //defaults
        });
        // create the view
        var page = new SettingsView({
          model: model
        });
        // show the view
        this.changePage(page);
    },

    tripView: function(id) {

        var model = new TripModel({
          id: id
        });
        // create the view
        var page = new TripView({
          model: model
        });
        // show the view
        this.changePage(page);
    },
    map: function() {
      // create the view and show it
      var page = new MapView();
      this.changePage(page);
    },
    chooseMapCoords: function() {
      // create the view and show it
      var page = new ChooseMapCoords();
      this.changePage(page);
    },
    listTripView: function(query) {

        var model = new MyModel({
          query: query
        });
        // create the view
        var page = new ListTripView({
          model: model
        });
        // show the view
        this.changePage(page);
    },
    searchTripView: function() {

        var model = new TripModel({
          //defaults
        });
        // create the view
        var page = new SearchTripView({
          model: model
        });
        // show the view
        this.changePage(page);
    },

    createTripView: function() {

        var model = new TripModel({
          //defaults
        });
        // create the view
        var page = new CreateTripView({
          model: model
        });
        // show the view
        this.changePage(page);
    },

    createReview: function(id) {
      // highlight the nav1 tab bar element as the current one
        var model = new ReviewModel({
          //defaults
          id: id
        });
        // create the view
        var page = new CreateReview({
          model: model
        });
        // show the view
        this.changePage(page);
    },


    myView: function() {

      // create a model with an arbitrary attribute for testing the template engine
      var model = new MyModel({
        key: "testValue"
      });
      // create the view
      var page = new MyView({
        model: model
      });
      // show the view
      this.changePage(page);
    },
    
    loginView: function() {

      // create a model with an arbitrary attribute for testing the template engine
      var model = new MyModel({
        //defaults
      });
      // create the view
      var page = new LoginView({
        model: model
      });
      // show the view
      this.changePage(page);
    },

    signupView: function() {

      // create a model with an arbitrary attribute for testing the template engine
      var model = new UserProfileModel({
        //defaults
      });
      // create the view
      var page = new SignupView({
        model: model
      });
      // show the view
      this.changePage(page);
    },

  
    goBack: function() {
      window.history.go(-2);
    },

    // load the structure view
    showStructure: function() {
      if (!this.structureView) {
        this.structureView = new StructureView();
        // put the el element of the structure view into the DOM
        document.body.appendChild(this.structureView.render().el);
        this.structureView.trigger("inTheDOM");
      }
      // go to first view
      this.navigate(this.firstView, {trigger: true});
    }

  });

  return AppRouter;

});