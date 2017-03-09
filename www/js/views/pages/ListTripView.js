define(function(require) {

  var Backbone = require("backbone");
  var TripModel = require("models/TripModel");
  var MyModel = require("models/MyModel");
  var SmallTripView = require("views/pages/SmallTripView");
  var Utils = require("utils");
  var spinner = require("spinner");

  var numberOfPage = 0;
  var recsPerPage = 8;

  var daysOfWeek = ["Mon","Tue","Wed", "Thu", "Fri", "Sat", "Sun"];

  //TODO Check how to downscale pics
  //function that loads the picture thumbnails
  function loadPictures(i, trip){
      BaasBox.loadObject("Profiles",trip[i].driverId)
          .done(function(res) {
            console.log("res ", res);
            //TODO make clear new functions for all these specific tasks
            //loads the prof pic from the server
            if(res['data'].picId){

              //finds the prof pic by url
              var source = sessionStorage.baasboxURL + "/file/" + res['data'].picId + "?X-BB-SESSION=" + sessionStorage.userToken + "&X-BAASBOX-APPCODE=" + sessionStorage.baasboxAppCode;
              var num = numberOfPage * recsPerPage + i;
              document.getElementById("profilePic" + num).setAttribute('src',source);
            }
          })
          .fail(function(error) {
            console.log("error ", error);
            alert(error);
          })
      return;
    };

  var ListTripView = Utils.Page.extend({

    constructorName: "ListTripView",

    model: MyModel,

    events: {
      "tap .smalltripview": "tripView",
      "tap #loadmore": "loadMore"
      
    },

    initialize: function() {
      spinner.spin(document.body);
      numberOfPage = 0;
      // load the precompiled template
      this.template = Utils.templates.listtripview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.loadData);
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "listtripview",
    className: "i-g page view",

    

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    loadMore: function(){

      //delete the old load more button
      numberOfPage += 1;
      this.loadData();
      var btn = document.getElementById("loadmore");
      btn.parentNode.removeChild(btn);

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



      //load the trip data
      var query;
      if(this.model.attributes.query){
        query = this.model.attributes.query;
      }
      if(!query){
        query = "";
      }
      BaasBox.loadCollectionWithParams("Trips", {page: numberOfPage, recordsPerPage: recsPerPage, orderBy: "date asc", where: query})
      .done(function(res) {
        console.log("res ", res);
        spinner.stop();
        //if there is nothing more to load alert and destroy the button
        if(!res[0]){
          alert("There are no more trips to load :)");
          var btn = document.getElementById("loadmore");
          btn.parentNode.removeChild(btn);
        }
        for (var i = 0; i < res.length; i++){
          
          //For each doc retrieved we initialize a model and a view with its data
          data = res[i];
          var model = new TripModel({
          //defaults
          });

          model.attributes = data;

          var page = new SmallTripView({
           model: model
          });
          
          


          //append the list item
          var bodyEl = $(".tripContainer");
          var pageHtml = page.render();
          bodyEl.append(pageHtml.el);


          //put the id  of the user as data for the button IM NOT SURE THIS CODE IS NEEDED
          var button = $(".smallTripButton")[i + numberOfPage*recsPerPage];
          button.setAttribute('data-id',res[i].id);
          var num = i + numberOfPage*recsPerPage;
          button.setAttribute('id','profilePic' + num);

          var dateHTML = "";
            if(res[i].isRegular == 1){
              for(var j=0; j<7;j++){
                if(res[i].daysofweek[j] == 1){
                  dateHTML += daysOfWeek[j] + ", ";
                }
              }
              dateHTML = dateHTML.substring(0, dateHTML.length - 2);
            }else{
              dateHTML = res[i].date;
          }

          var date = document.getElementsByClassName("date");
          date[num].innerHTML = (dateHTML);


          //put the id of the user as data for the div
          var box = $(".smalltripview")[i + numberOfPage*recsPerPage];
          box.setAttribute('data-id',res[i].id);

          //calls the function that loads the picture for each different trip
          loadPictures(i, res);


        }

        //create the load more button
        var divider = document.createElement("div");
        divider.setAttribute("class" ,"i-4 profileDivider");
        divider.setAttribute("id" , "loadmore");
        var node = document.createTextNode("Load More");
        divider.appendChild(node);

        var element = $(".tripContainer");
        element[0].appendChild(divider);

      })
      .fail(function(error) {
        console.log("error ", error);
        alert(error);
      })



    }

  });

  return ListTripView;

});
