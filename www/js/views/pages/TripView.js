define(function(require) {

  var Backbone = require("backbone");
  var TripModel = require("models/TripModel");
  var UserProfileModel = require("models/UserProfileModel");
  var MapView = require("views/pages/MapView");
  var SmallProfileView = require("views/pages/SmallProfileView");
  var Utils = require("utils");
  var L = require("leaflet");
  var spinner = require("spinner");

  var daysOfWeek = ["Mon","Tue","Wed", "Thu", "Fri", "Sat", "Sun"];


  //Maybe i will have to load the map when all fetches are done
  function loadMap(olat, olong, dlat, dlong){


      //Take the origin and destination coordinates from the db
      if(olat!=0&&olong!=0&&dlat!=0&&dlong!=0){
        var originDest = [L.latLng(olat, olong), L.latLng(dlat, dlong)];      
      }else{
        //If there is nothing on the db just load some static
        inDest = [L.latLng(42.3676443, 13.3496695), L.latLng(42.4786543, 13.2586796)];
      }
      
      


      // the center of the map is the address of the origin
      var options = {
        center: originDest[0],
        zoom: 11
      };

      
      // create the map
      var map = L.map('map', options);
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

  };



  function loadSmallProfileViews(i, profileId){


    BaasBox.loadObject("Profiles", profileId)
      .done(function(res) {
        console.log("res ", res);


          //Load the profile and append it to the doc
          var model = new UserProfileModel({
          //defaults
          });

          model.attributes = res['data'];

          var page = new SmallProfileView({
           model: model
          });
          
          


          //append the list item
          var bodyEl = $("#smallProfileContainer");
          var pageHtml = page.render();
          bodyEl.append(pageHtml.el);

          //put the id  of the user as data for the button IM NOT SURE THIS CODE IS NEEDED
          var button = $(".smallProfileButton")[i];
          button.setAttribute('data-id',res['data'].id);
          var num = i
          button.setAttribute('id','profilePic' + num);

          //put the id of the user as data for the div
          var box = $(".smallprofileview")[i];
          box.setAttribute('data-id',res['data'].id);

          //finds the prof pic by url
          var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
          document.getElementById("profilePic" + num).setAttribute('src',source);

      })
      .fail(function(error){
        console.log("error ", error);
        alert(error);

      })

  };




  var TripView = Utils.Page.extend({

    constructorName: "TripView",

    model: TripModel,

    events: {
      "tap #profileButton": "profileView",
      "tap #fullMapButton": "mapView",
      "tap #addicon": "joinTrip",
      "tap #deleteButton": "deleteTrip",
      "tap #cancelButton": "unjoinTrip",
      "tap .smallprofileview": "profileView",
      "tap #reviewButton": "createReview"
      
    },

    initialize: function() {
      spinner.spin(document.body);
      // load the precompiled template
      this.template = Utils.templates.tripview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.loadData);
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "tripview",
    className: "i-g page view",

    

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    createReview: function(event){
      //redirects to write review
      console.log("ok")
      Backbone.history.navigate("createreview/" + event.currentTarget.parentNode.getAttribute('data-id'), {
            trigger: true
          });
    },

    deleteTrip: function(event){


      //fix the deleteObject
      var conf = confirm("Are you sure you want to delete this trip?");
      if(conf == true){
        BaasBox.deleteObject(event.currentTarget.parentNode.getAttribute('data-id'), "Trips")
        .done(function(res) {
          console.log("res ", res);
          alert("Trip deleted succesfully :)")

          //redirect to search page
          Backbone.history.navigate("searchtripview", {
            trigger: true
          });
        })
        .fail(function(error) {
          console.log("error ", error);
        })
      }else{
        console.log("OUT");
      }



    },


    unjoinTrip: function(){
      var tripId = this.model.attributes.id;

      

      var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;

      //on the trip remove the user id 
      BaasBox.loadObject("Profiles", userId)
      .done(function(res) {
        console.log("res ", res);
        

        //on the profile of the user add the trip on the added trips
        var index = res.data.trips.indexOf(tripId);
        if (index > -1) {
          res.data.trips.splice(index, 1);
        }
        res.data.tripNumber -= 1;
        
        BaasBox.save(res['data'], "Profiles")
        .done(function(res) {
          console.log("res ", res);
          //load the trip so that we modify it
          BaasBox.loadObject("Trips", tripId)
          .done(function(res) {
            console.log("res ", res);
            
            //on the trip remove the user id and increase seats
            index = res.data.passengersIds.indexOf(userId);
            if (index > -1) {
               res.data.passengersIds.splice(index, 1);
            }
            res.data.seats += 1 ;
            
            BaasBox.save(res.data, "Trips")
            .done(function(res) {
              console.log("res ", res);
              alert("You unjoined the trip :)");
              //passes the id of the trip via url
              Backbone.history.navigate("", {
                trigger: true,
                replace: true
              });
              Backbone.history.navigate("tripview/" + res.id, {
                trigger: true,
                replace: true
              });

            })
            .fail(function(error) {
              console.log("error ", error);
            })
          })
          .fail(function(error){
            console.log("error ", error);
            alert(error);
          })
        })
        .fail(function(error) {
          console.log("error ", error);
        })

          
        

        
      })
      .fail(function(error){
        console.log("error ", error);
        alert(error);

      })

    },
    joinTrip: function(){
      var tripId = this.model.attributes.id;

      

      var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;

      //on the trip add the user id 
      BaasBox.loadObject("Profiles", userId)
      .done(function(res) {
        console.log("res ", res);
        
        //check if the user is already part of this trip
        var okToProceed = true;

        for(var i = 0 ;i < res['data'].trips.length;i++){
          if(res['data'].trips[i] == tripId){
            okToProceed = null;
            alert("Sorry but you are already part of the trip :( You cannot rejoin");
          }
        }

        if(okToProceed){

          //on the profile of the user add the trip on the added trips
          res.data.trips.push(tripId);
          res.data.tripNumber += 1;
          
          BaasBox.save(res['data'], "Profiles")
          .done(function(res) {
            console.log("res ", res);
            //load the trip so that we modify it
            BaasBox.loadObject("Trips", tripId)
            .done(function(res) {
              console.log("res ", res);
              
              //on the trip add the user id and reduce seats by the amount of the prompt
              res.data.passengersIds.push(userId);
              res.data.seats -= 1 ;
              
              BaasBox.save(res.data, "Trips")
              .done(function(res) {
                console.log("res ", res);
                alert("You joined the trip :)");
                //passes the id of the trip via url
                Backbone.history.navigate("", {
                  trigger: true,
                  replace: true
                });
                Backbone.history.navigate("tripview/" + res.id, {
                  trigger: true,
                  replace: true
                });

              })
              .fail(function(error) {
                console.log("error ", error);
              })
            })
            .fail(function(error){
              console.log("error ", error);
              alert(error);
            })
          })
          .fail(function(error) {
            console.log("error ", error);
          })

          
        }

        
      })
      .fail(function(error){
        console.log("error ", error);
        alert(error);

      })


    

      
    },

    mapView: function(){

      //The coordinates are already saved on the session so no need to do something else

      //change page
      Backbone.history.navigate("map", {
        trigger: true
      });
    },

    loadData: function() {

      // query DB, ajax
      // append in the DOM

      //gets into the if statement only if tripCreated is not zero so that it doesnt create trips everytime we go to this page
      if(sessionStorage["tripCreated"] && sessionStorage["tripCreated"] != 0){

          alert("Trip succesfully created");
          //first of all it remakes tripCreated false so that it doesnt continuously create trips
          sessionStorage["tripCreated"] = 0;
   

          //it loads the trip via the id it was given
          BaasBox.loadObject("Trips", this.model.attributes.id)
            .done(function(res) {
              console.log("res ", res);
              

              spinner.stop();


              //load the profiles that have joined the trip
              for(var l=0; l<res.passengersIds.length;l++){
                loadSmallProfileViews(l, res.passengersIds[l]);
              }
              


              //if it a regular trip creates the days of the week
              var dateHTML = "";
              if(res.isRegular == 1){
                for(var j=0; j<7;j++){
                  if(res.daysofweek[j] == 1){
                    dateHTML += daysOfWeek[j] + ", ";
                  }
                }
                dateHTML = dateHTML.substring(0, dateHTML.length - 2);
              }else{
                dateHTML = res.date;
              }

              //fills the html page
              document.getElementById("origin").innerHTML = res.origin;
              document.getElementById("destination").innerHTML = res.destination;
              document.getElementById("date").innerHTML = dateHTML;
              document.getElementById("time").innerHTML = res.time;
              document.getElementById("seats").innerHTML = res.seats;
              document.getElementById("description").innerHTML = "Description: "  + res.description;

              //put the id of the trip as data-id on the deleteButton
              document.getElementById("deleteButton").setAttribute('data-id',res['data'].id);

              //load map with the data given
              loadMap(res.originlat,res.originlong,res.destinationlat,res.destinationlong);

              //Save the longitudelatitude of origin and destination on the sessionStorage so that we can use them for full map
              sessionStorage.originlat = res.originlat;
              sessionStorage.originlong = res.originlong;
              sessionStorage.destinationlat = res.destinationlat;
              sessionStorage.destinationlong = res.destinationlong;


              //if the user is already in the trip show cancel button
              var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;
              var isInPassengers = $.inArray(userId, res.passengersIds);
              if(isInPassengers >= 0){
                document.getElementById("addButton").parentNode.style.display = 'none';
                document.getElementById("cancelButton").parentNode.style.display = 'block';
                document.getElementById("reviewButton").style.display = 'block';
              }


              //load Profile based on the id of the driver
              BaasBox.loadObject("Profiles", res.driverId)
              .done(function(res) {
                console.log("res ", res);
                document.getElementById("nameAndSurname").innerHTML = res['data'].name + " " + res['data'].surname;
                document.getElementById("rating").innerHTML = res['data'].rating;

                //put the id of the driver as data for the profile and review buttons
                var i = 0;
                var button = $(".profileButton")[i];
                while (button){
                  button.setAttribute('data-id',res['data'].id);
                  i++;
                  var button = $(".profileButton")[i];
                }
                document.getElementById("reviewButton").setAttribute('data-id',res['data'].id);


                //puts the correctProfilePic to the view
                if(res['data'].picId){

                  //finds the prof pic by url
                  var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
                  document.getElementById("profilePic").setAttribute('src',source);
                }

                //if the user is the creator show the delete button
                var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;
                var button = $(".profileButton")[1];
                if(button.getAttribute('data-id') == userId){
                  document.getElementById("deleteButton").style.display = 'block';
                }


              })
              .fail(function(error) {
                console.log("error ", error);
                alert(error);
              })
            })
            .fail(function(error) {
              console.log("error ", error);
            })


      }
      //an yparxei id sto url pou shmainei oti egine click apo kapou psaxnei gai sugekrimeno trip
      else if(this.model.attributes.id){

        BaasBox.loadObject("Trips",this.model.attributes.id)
          .done(function(res) {
            console.log("res ", res);


            spinner.stop();


            //load the profiles that have joined the trip
              for(var l=0; l<res['data'].passengersIds.length;l++){
                loadSmallProfileViews(l, res['data'].passengersIds[l]);
              }


            //if it a regular trip creates the days of the week
            var dateHTML = "";
            if(res['data'].isRegular == 1){
              for(var j=0; j<7;j++){
                if(res['data'].daysofweek[j] == 1){
                  dateHTML += daysOfWeek[j] + ", ";
                }
              }
              dateHTML = dateHTML.substring(0, dateHTML.length - 2);
            }else{
              dateHTML = res['data'].date;
            }

            document.getElementById("origin").innerHTML = res['data'].origin;
            document.getElementById("destination").innerHTML = res['data'].destination;
            document.getElementById("date").innerHTML = dateHTML;
            document.getElementById("time").innerHTML = res['data'].time;
            document.getElementById("seats").innerHTML = res['data'].seats;
            document.getElementById("description").innerHTML = "Description: "  + res['data'].description;

            //put the id of the trip as data-id on the deleteButton
            document.getElementById("deleteButton").setAttribute('data-id',res['data'].id);

            //loads the map with the info taken
            loadMap(res['data'].originlat,res['data'].originlong,res['data'].destinationlat,res['data'].destinationlong);

            //Save the longitudelatitude of origin and destination on the sessionStorage so that we can use them for full map
            sessionStorage.originlat = res['data'].originlat;
            sessionStorage.originlong = res['data'].originlong;
            sessionStorage.destinationlat = res['data'].destinationlat;
            sessionStorage.destinationlong = res['data'].destinationlong;

            //if the user is already in the trip show cancel button
            var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;
            var isInPassengers = $.inArray(userId, res['data'].passengersIds);
            if(isInPassengers >= 0){
              document.getElementById("addButton").parentNode.style.display = 'none';
              document.getElementById("cancelButton").parentNode.style.display = 'block';
              document.getElementById("reviewButton").style.display = 'block';
            }



            //load Profile based on the id of the driver
            BaasBox.loadObject("Profiles", res['data'].driverId)
            .done(function(res) {
              console.log("res ", res);
              document.getElementById("nameAndSurname").innerHTML = res['data'].name + " " + res['data'].surname;
              document.getElementById("rating").innerHTML = res['data'].rating;

              //put the id of the driver as data for the buttons
              var i = 0;
              var button = $(".profileButton")[i];
              while (button){
                button.setAttribute('data-id',res['data'].id);
                i++;
                var button = $(".profileButton")[i];
              }
              document.getElementById("reviewButton").setAttribute('data-id',res['data'].id);


              //puts the correctProfilePic to the view
              if(res['data'].picId){

                //finds the prof pic by url
                var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
                document.getElementById("profilePic").setAttribute('src',source);
              }


              //if the user is the creator show the delete button
              var userId = BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId;
              var button = $(".profileButton")[1];
              if(button.getAttribute('data-id') == userId){
                document.getElementById("deleteButton").style.display = 'block';
              }

            })
            .fail(function(error) {
              console.log("error ", error);
              alert(error);
            })


          })
          .fail(function(error) {
            console.log("error ", error);
          })

      //alliws bgazei to default trip
      }else{
        alert("Id not in the session Storage");
        //load the profile
        BaasBox.loadCollectionWithParams("Profiles", {page:0, recordsPerPage: BaasBox.pagelength, where: "name='Stannis'"})
        .done(function(res) {
          console.log("res ", res);
          document.getElementById("nameAndSurname").innerHTML = res[0].name + " " + res[0].surname;
          document.getElementById("rating").innerHTML = res[0].rating;
        })
        .fail(function(error) {
          console.log("error ", error);
          alert(error);
        })

        //load the trip data
        BaasBox.loadCollectionWithParams("Trips", {page:0, recordsPerPage: BaasBox.pagelength, where: "origin='Rome'"})
        .done(function(res) {
          console.log("res ", res);
          document.getElementById("origin").innerHTML = res[0].origin;
          document.getElementById("destination").innerHTML = res[0].destination;
          document.getElementById("date").innerHTML = res[0].date;
          document.getElementById("time").innerHTML = res[0].time;
          document.getElementById("seats").innerHTML = res[0].seats;
          document.getElementById("description").innerHTML = "Description: "  + res[0].description;
          loadMap(0,0,0,0);
        })
        .fail(function(error) {
          console.log("error ", error);
          alert(error);
        })


      }

      


    },

    profileView: function(event) {

      //adding the id on the url
      Backbone.history.navigate("profileview/" + event.currentTarget.getAttribute('data-id') , {
        trigger: true
      });
    }

    
  });

  return TripView;

});