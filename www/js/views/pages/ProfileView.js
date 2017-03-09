define(function(require) {

  var Backbone = require("backbone");
  var UserProfileModel = require("models/UserProfileModel");
  var SmallTripView = require("views/pages/SmallTripView");
  var Utils = require("utils");
  var TripModel = require("models/TripModel");
  var ReviewModel = require("models/ReviewModel");
  var Review = require("views/pages/Review");
  var Utils = require("utils");
  var spinner = require("spinner");


//TODO Check how to downscale pics
  //function that loads the picture thumbnails
  function loadPictures(i, trip){
      BaasBox.loadObject("Profiles",trip.driverId)
          .done(function(res) {
            console.log("res ", res);
            //TODO make clear new functions for all these specific tasks
            //loads the prof pic from the server
            if(res['data'].picId){

              //finds the prof pic by url
              var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
              document.getElementById("profilePic" + i).setAttribute('src',source);
            }
          })
          .fail(function(error) {
            console.log("error ", error);
            alert(error);
          })
      return;
    };


  function loadListOfTrips(tripIds){


    var j =0;
    for (var i = 0; i < tripIds.length; i++){
      //For each tripId we load the trip and append it on the prof view
      BaasBox.loadObject("Trips",tripIds[i])
      .done(function(res) {
        console.log("res ", res);
        data = res;
        var model = new TripModel({
        //defaults
        });

        model.attributes = data['data'];

        var page = new SmallTripView({
         model: model
        });
        
        //append the list item
        var bodyEl = $(".tripContainer");
        var pageHtml = page.render();
        bodyEl.append(pageHtml.el);


        //put the id  of the user as data for the button IM NOT SURE THIS CODE IS NEEDED
        var button = $(".smallTripButton")[j];
        button.setAttribute('data-id',res['data'].id);
        button.setAttribute('id','profilePic' + j);


        //put the id of the user as data for the div
        var box = $(".smalltripview")[j];
        box.setAttribute('data-id',res['data'].id);

        //this function loads the pictures for the trips
        loadPictures(j, res['data']);


        j++;
      })
      .fail(function(error) {
        console.log("error ", error);
        alert(error);
        j++;
      })
      
    }

  };


  function loadReviews(reviewIds){

    var j =0;
    var k = 0;
    for (var i = 0; i < reviewIds.length; i++){
      //For each tripId we load the trip and append it on the prof view
      BaasBox.loadObject("Reviews",reviewIds[i])
      .done(function(res) {
        console.log("res ", res);
        data = res;
        var model = new ReviewModel({
        //defaults
        });

        model.attributes = data['data'];

        var page = new Review({
         model: model
        });
        
        //append the list item
        var bodyEl = $(".reviewContainer");
        var pageHtml = page.render();
        bodyEl.append(pageHtml.el);


        //put the id  of the user as data for the button IM NOT SURE THIS CODE IS NEEDED
        var button = $(".reviewpic")[j];
        button.setAttribute('data-id',res['data'].id);
        button.setAttribute('id','reviewPic' + j);


        //put the id of the user as data for the div
        var box = $(".review")[j];
        box.setAttribute('data-id',res['data'].id);

        //this function loads the pictures for the reviews
        BaasBox.loadObject("Profiles",res['data'].authorId)
          .done(function(res) {
            console.log("res ", res);
            //TODO make clear new functions for all these specific tasks
            //loads the prof pic from the server
            if(res['data'].picId){

              //finds the prof pic by url
              var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
              document.getElementById("reviewPic" + k).setAttribute('src',source);
            }
            k++;
          })
          .fail(function(error) {
            console.log("error ", error);
            alert(error);
            k++;
          })

        j++;
      })
      .fail(function(error) {
        console.log("error ", error);
        alert(error);
        j++;
      })
      
    }



  };

  var ProfileView = Utils.Page.extend({

    constructorName: "ProfileView",

    model: UserProfileModel,

    events: {
      "tap .smalltripview": "tripView"
      
    },

    initialize: function() {
      spinner.spin(document.body);
      // load the precompiled template
      this.template = Utils.templates.profileview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.loadData);
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "profileview",
    className: "i-g page view",

    

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    tripView: function(event) {


      //passes the id of the trip via url
      Backbone.history.navigate("tripview/" + event.currentTarget.getAttribute('data-id'), {
        trigger: true
      });
    },

    loadData: function() {
      // query DB, ajax
      // append in the DOM

      if(this.model.attributes.id){
        BaasBox.loadObject("Profiles", this.model.attributes.id)
          .done(function(res) {



            spinner.stop();
            

            console.log("res ", res);
            document.getElementById("nameAndSurname").innerHTML = res['data'].name + " " + res['data'].surname;
            document.getElementById("rating").innerHTML = res['data'].rating;
            document.getElementById("tripNumber").innerHTML = res['data'].tripNumber;
            document.getElementById("age").innerHTML = res['data'].age;



            //TODO make clear new functions for all these specific tasks
            //loads the prof pic from the server
            if(res['data'].picId){

              //finds the prof pic by url
              var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
              document.getElementById("profilePic").setAttribute('src',source);
            }

            var tripIds = res['data'].trips;
            
            //this function loads the list of trips
            loadListOfTrips(tripIds);

            var reviewIds = res['data'].reviews;

            //this function loads the reviews
            loadReviews(reviewIds);

          })
          .fail(function(error) {
            console.log("error ", error);
            alert(error);
          })


      }else{
        var view = this;
        BaasBox.loadCollectionWithParams("Profiles", {page:0, recordsPerPage: BaasBox.pagelength, where: "name='Stannis'"})
        .done(function(res) {
          console.log("res ", res);
          document.getElementById("nameAndSurname").innerHTML = res[0].name + " " + res[0].surname;
          document.getElementById("rating").innerHTML = res[0].rating;
          document.getElementById("numberOfTrips").innerHTML = res[0].trips;
          document.getElementById("age").innerHTML = res[0].age;
        })
        .fail(function(error) {
          console.log("error ", error);
          alert(error);
        })

      }


      
    }

    
  });

  return ProfileView;

});