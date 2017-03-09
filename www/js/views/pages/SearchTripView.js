define(function(require) {

  var Backbone = require("backbone");
  var TripModel = require("models/TripModel");
  var Utils = require("utils");

  var regularToggled = 0;
  var daysClicked = [0,0,0,0,0,0,0];

  var SearchTripView = Utils.Page.extend({

    constructorName: "SearchTripView",

    model: TripModel,

    events: {
      "tap #search": "searchTripView",
      "tap #create": "createTripView",
      "tap .daybutton": "dayButtonClicked"
      
    },

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.searchtripview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.loadData);
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "searchtripview",
    className: "i-g page view",

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    loadData: function(){

      //here we enable the toggle button listener
      document
        .querySelector('#regulartoggle')
        .addEventListener('toggle', this.regularToggle)

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

    regularToggle: function(){
      

      //if the toggle is active or inactive it hides the elements
      var toggle = document.getElementById("regulartoggle");

      if(regularToggled == 0){
        document.getElementById("date").style.display = 'none';
        var buttons = document.getElementsByClassName("btn daybutton");
        console.log(buttons);
        for(var i=0; i<buttons.length; i++){
          buttons[i].style.display = 'inline-block';
        }
        regularToggled = 1;
      }else{
        document.getElementById("date").style.display = 'inline-block';
        var buttons = document.getElementsByClassName("btn daybutton");
        console.log(buttons);
        for(var i=0; i<buttons.length; i++){
          buttons[i].style.display = 'none';
        }
        regularToggled = 0;

      }

    },

    createTripView: function(event){

      //getting the form values
      var form = document.getElementById("searchtripform");

      var trip = new TripModel();
        var i;
        for (i = 0; i < form.length - 2 ;i++) {
          trip.set(form.elements[i].name, form.elements[i].value);
        }

        //save the regular trip settings
        trip.set("isRegular" , regularToggled);
        trip.set("daysofweek", daysClicked);
        //saving the form data on sessionStorage
        sessionStorage["tripData"] = JSON.stringify(trip);
        sessionStorage.temporaryCreate = 1;


      Backbone.history.navigate("createtripview", {
        trigger: true
      });

    },

    searchTripView: function(event) {



      
      //getting the form values and validate if the user typed something
      var form = document.getElementById("searchtripform");
      var valid = true;
      var trip ="";
      
      if(form.elements[0].value){
        var originstring = form.elements[0].value;
        originstring = originstring.replace(/"/g, "\'");
        trip = 'origin = "' + originstring + '"';
      }else{
        valid = null;
        alert("Please type where does the trip start :)");
      }

      if(form.elements[1].value && valid == true){
        var destinationstring = form.elements[1].value;
        destinationstring = destinationstring.replace(/"/g, "\'");
        trip += ' and destination = "' + destinationstring + '"';
      }else if(valid){
        valid = null;
        alert("Please type your destination :)");
      }

      //if its not regular
      if(regularToggled == 0){
        trip += " and isRegular = 0";
        if(form.elements[9].value && valid == true){
          trip += " and date >= '" + form.elements[9].value + "'";
        }else{
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
          trip += " and date >= '" + yyyy + "-" + mm + "-" + dd + "'";
        }

      //if it is
      }else{
        trip += " and isRegular = 1";
        var dayclicked = null;
        for(var j=0; j<7;j++){
          if(daysClicked[j]==1){
            trip += " and daysofweek[" + j + "] = 1";
            dayclicked = true;
          }
        }
        if(!dayclicked && valid){
          valid = null;
          alert("Please choose days of the week :)")
        }
      }

      if(form.elements[10].value && valid == true){
        trip += " and seats >= '" + form.elements[10].value + "'";
      }else  if(valid){
        valid = null;
        alert("Please choose how many seats you ae searching for :)");
      }


      if(valid == true){
        //saving the query on sessionStorage
        sessionStorage["searchQuery"] = trip;

        //changing the view to the list
        Backbone.history.navigate("listtripview/" + trip, {
          trigger: true
        });
      }
    }


  });

  return SearchTripView;

});