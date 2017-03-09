define(function(require) {

  var Backbone = require("backbone");
  var TripModel = require("models/TripModel");
  var Utils = require("utils");

  var regularToggled = 0;
  var daysClicked = [0,0,0,0,0,0,0];

  var CreateTripView = Utils.Page.extend({

    constructorName: "CreateTripView",

    model: TripModel,

    events: {
      "tap #submit": "tripView",
      "tap #origincoords": "originCoords",
      "tap .daybutton": "dayButtonClicked",
      "tap #destinationcoords": "destinationCoords"
      
    },

    initialize: function() {


      // load the precompiled template
      this.template = Utils.templates.createtripview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.reloadTemporaryValues);
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "createtripview",
    className: "i-g page view",

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    regularToggle: function(){
      

      //if the toggle is active or inactive 
      var toggle = document.getElementById("regulartoggle");

      if(regularToggled == 0){
        document.getElementById("date").style.display = 'none';
        document.getElementById("labelofweekdays").style.display = 'block';
        document.getElementById("daysofweek").style.display = 'block';
        regularToggled = 1;
      }else{
        document.getElementById("date").style.display = 'block';
        document.getElementById("labelofweekdays").style.display = 'none';
        document.getElementById("daysofweek").style.display = 'none';
        regularToggled = 0;

      }

    },

    dayButtonClicked: function(event){



      //check if the buttons are clicked
      var button = event.currentTarget;
      if(button.getAttribute("class") == "btn daybutton"){
        button.setAttribute("class", "btn btn-primary daybutton");
        daysClicked[button.getAttribute("value")] = 1;
      }else{
        button.setAttribute("class", "btn daybutton");
        daysClicked[button.getAttribute("value")] = 0;
      } 

    },

    reloadTemporaryValues: function(){


      //here we enable the toggle button listener
      document
        .querySelector('#regulartoggle')
        .addEventListener('toggle', this.regularToggle)
      //if we redirected only for the maps we recover the lost fields
      if(sessionStorage.temporaryCreate == 1){
        
        var form = document.getElementById("createtripform");
        var trip = new TripModel(JSON.parse(sessionStorage["tripData"]));

        var i;
        for (i = 0; i < form.length - 1 ;i++) {
          if(form.elements[i].name != "label" && form.elements[i].name != "daysofweek"){
            form.elements[i].value =  trip.get(form.elements[i].name);
          }
        }

        regularToggled = trip.get("isRegular");
        daysClicked = trip.get("daysofweek");


        var toggle = document.getElementById("regulartoggle");

        if(regularToggled == 1){
          document.getElementById("date").style.display = 'none';
          document.getElementById("labelofweekdays").style.display = 'block';
          document.getElementById("daysofweek").style.display = 'block';
          toggle.setAttribute("class", "toggle active");
          //toggle.childNodes[0].setAttribute("style" , "-webkit-transform: translate3d(44px, 0px, 0px);");
          var buttons = document.getElementsByClassName("btn daybutton");
          for(var j=0; j<7; j++){
            if(daysClicked[j] == 1){
              buttons[j].setAttribute("class" , "btn btn-primary daybutton");
            }
          }
        }else{
          document.getElementById("date").style.display = 'block';
          document.getElementById("labelofweekdays").style.display = 'none';
          document.getElementById("daysofweek").style.display = 'none';

        }




        sessionStorage.temporaryCreate = 0;
      }


    },

    originCoords: function() {
      //Save the current form values 
        //getting the form values and JSONing them
        var form = document.getElementById("createtripform");
        
        var trip = new TripModel();
        var i;
        for (i = 0; i < form.length - 1 ;i++) {
          //only add the needed values
          if(form.elements[i].name != "label" || form.elements[i].name != "daysofweek"){
            trip.set(form.elements[i].name, form.elements[i].value);
          }
        }

        trip.set("isRegular" , regularToggled);
        trip.set("daysofweek", daysClicked);

        //saving the form data on sessionStorage
        sessionStorage["tripData"] = JSON.stringify(trip);
        sessionStorage.temporaryCreate = 1;

        //choose coordinates for origin
        sessionStorage.chooseCoordinatesFor = "origin";
      Backbone.history.navigate("choosemapcoords", {
        trigger: true
      });
    },

    destinationCoords: function() {
      //Save the current form values 
        //getting the form values and JSONing them
        var form = document.getElementById("createtripform");
        
        var trip = new TripModel();
        var i;
        for (i = 0; i < form.length - 1 ;i++) {
          //only add the needed values
          if(form.elements[i].name != "label" && form.elements[i].name != "daysofweek"){
            trip.set(form.elements[i].name, form.elements[i].value);
          }
        }

        trip.set("isRegular" , regularToggled);
        trip.set("daysofweek", daysClicked);

        //saving the form data on sessionStorage
        sessionStorage["tripData"] = JSON.stringify(trip);
        sessionStorage.temporaryCreate = 1;

        //choose coordinates for destination
      sessionStorage.chooseCoordinatesFor = "destination";
      Backbone.history.navigate("choosemapcoords", {
        trigger: true
      });
    },

    
    tripView: function(event) {

      //getting the form values and JSONing them
      var form = document.getElementById("createtripform");
      
      var trip = new TripModel();
      var i;
      for (i = 0; i < form.length - 1 ;i++) {
        //only add the needed values
        if(form.elements[i].name != "label" && form.elements[i].name != "daysofweek"){
          trip.set(form.elements[i].name, form.elements[i].value);
        }
      }

      trip.set("isRegular" , regularToggled);
      trip.set("daysofweek", daysClicked);

      trip.set("originlat", sessionStorage.createdOriginLatitude);
      trip.set("originlong", sessionStorage.createdOriginLongitude);
      trip.set("destinationlat", sessionStorage.createdDestinationLatitude);
      trip.set("destinationlong", sessionStorage.createdDestinationLongitude);


      //Validation
      var valid = true;
      if(trip.get("origin")=="null"||trip.get("origin")==""||trip.get("origin")==null){
        alert("Sorry but you didn't enter the city of origin :(");
          valid = null;
      }
      if(trip.get("destination")=="null"||trip.get("destination")==""||trip.get("destination")==null){
        alert("Sorry but you didn't enter the city of destination :(");
          valid = null;
      }


      if(regularToggled == 0){
        if(trip.get("date")=="1"||trip.get("date")==""||trip.get("date")==null){
          alert("Sorry but you didn't enter the date :(");
            valid = null;
        }

        //validate if the date and time is more than now
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

        var h = today.getHours();
        var m = today.getMinutes();

        if(h<10) {
            h='0'+h;
        } 

        if(m<10) {
            m='0'+m;
        } 
        today = yyyy + '-'+ mm + '-' + dd;
        var now = h + ':' + m;
        if(trip.get("date")<today||(trip.get("date")==today&&trip.get("time")<now)){
          alert("Sorry but the date and time you entered is invalid :(")
            valid = null;
        }
      }else{
        var oneDayClicked = 0;
        for(var j=0; j<7; j++){
          oneDayClicked += daysClicked[j];
        }
        console.log(daysClicked);
        console.log(oneDayClicked);
        if(oneDayClicked == 0){
          alert("Sorry you didn't pick any day :(");
          valid = null;
        }  

      }


      if(trip.get("time")=="1"||trip.get("time")==""||trip.get("time")==null){
        alert("Sorry but you didn't enter the time:(");
          valid = null;
      }
      if(trip.get("seats")==0||trip.get("seats")<0||trip.get("seats")>10){
        alert("Sorry but you didn't enter the number of available seats :(");
          valid = null;
      }
      if(trip.get("originlat")==0||trip.get("originlong")==0){
        alert("Sorry but you didn't point the trip origin at the map :(");
          valid = null;
      }
      if(trip.get("destinationlat")==0||trip.get("destinationlong")==0){
        alert("Sorry but you didn't point the trip destination at the map :(");
          valid = null;
      }

      if(sessionStorage.userProfileId != ""){
          trip.set("driverId", sessionStorage.userProfileId);
        }else{
           alert("Sorry but you are not logged in");
          valid = null;
        }
      //If the validation is ok continue
      if(valid == 1){
        

        //dont forget to make null the sessionstorage coords
        sessionStorage.removeItem("createdOriginLatitude");
        sessionStorage.removeItem("createdOriginLongitude");
        sessionStorage.removeItem("createdDestinationLatitude");
        sessionStorage.removeItem("createdDestinationLongitude");


        //create the trip and save it to the database and then send the id to tripview
        BaasBox.save(trip, "Trips")
          .done(function(res) {
            console.log("res ", res);

            //we zero the values  
            regularToggled = 0;
            daysClicked = [0,0,0,0,0,0,0];

            var tripData = res;
            
            //But first save the tripId on the profile that created it
            BaasBox.loadObject("Profiles", res.driverId)
            .done(function(res) {
              console.log("res ", res);
              
              //add the tripId value on the array 
              res['data'].trips.push(tripData.id);
              res['data'].tripNumber += 1;
              
              BaasBox.save(res['data'],"Profiles")
              .done(function(res) {
                console.log("res ", res);
                
                //call the tripview with the newly made trip
                Backbone.history.navigate("tripview/" + tripData.id, {
                  trigger: true
                });
                sessionStorage["tripCreated"] = 1;
              })
              .fail(function(error) {
                console.log("error ", error);
                alert("There was an internal error creatign the trip");
              })
            })
            .fail(function(error) {
              console.log("error ", error);
              alert("There was an internal error creatign the trip");
            })

            
          })
          .fail(function(error) {
            console.log("error ", error);
            alert("There was an internal error creatign the trip");
          })

      }
    }


  });

  return CreateTripView;

});