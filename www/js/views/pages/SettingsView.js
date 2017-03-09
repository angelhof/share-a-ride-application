define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var MyModel = require("models/MyModel");

  var SettingsView = Utils.Page.extend({

    constructorName: "SettingsView",

    model: MyModel,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.settingsview;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    events:{
      "tap #myprofile": "myProfile",
      "tap #uploadprofilepic": "uploadProfilePic",
      "tap #myrides": "myRides",
      "tap #myregularrides": "myRegularRides",
      "tap #history": "historyRides",
      "tap #logout": "logout"
    },

    id: "settingsview",
    className: "i-g",

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    myProfile: function(){
      
      var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;
      Backbone.history.navigate("profileview/" + userId , {
        trigger: true
      });


    },
    uploadProfilePic: function(){
      
      alert("ok");
      $("#uploadForm").submit(function(e) {
      e.preventDefault();
      var formObj = $(this);
      console.log(formObj);
      var formData = new FormData(this);
      console.log(formData);
      BaasBox.uploadFile(formData)
        .done(function(res) {
          console.log("res ", res);
        })
        .fail(function(error) {
          console.log("error ", error);
        })
      });

    },

    logout: function() {

      BaasBox.logout()
      .done(function (res) {
        console.log(res);

        //Navigate to login view
        Backbone.history.navigate("loginview", {
          trigger: true
        });
      })
      .fail(function (error) {
        console.log("error ", error);
      })

    },


    myRides: function(){

    //this lists all the rides we participate in that are later than today


    var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;

    console.log(userId);

    //to check if they are not of the past
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 
    today = yyyy + '-'+ mm + '-' + dd;


    var query = "date >= '" + today + "' and driverId = '" + userId + "' or date >= '" + today + "' and '" + userId + "' in passengersIds";


    //changing the view to the list
    Backbone.history.navigate("listtripview/" + query, {
      trigger: true
    });

    },

    myRegularRides: function(){

    //this lists all the regular rides we participate in 


    var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;

    var query = "isRegular = 1 and driverId = '" + userId + "' or isRegular = 'y' and '" + userId + "' in passengersIds";


    //changing the view to the list
    Backbone.history.navigate("listtripview/" + query, {
      trigger: true
    });

    },

    historyRides: function(){

    //this lists all the rides we participate in that are later than today


    var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;

    console.log(userId);

    //to check if they are not of the past
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 
    today = yyyy + '-'+ mm + '-' + dd;


    var query = "date < '" + today + "' and driverId = '" + userId + "' and isRegular = 0 or date < '" + today + "' and isRegular = 0 and '" + userId + "' in passengersIds ";


    //changing the view to the list
    Backbone.history.navigate("listtripview/" + query, {
      trigger: true
    });

    }
    

  });

  return SettingsView;

});