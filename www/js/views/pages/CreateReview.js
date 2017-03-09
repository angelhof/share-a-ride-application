define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utils = require("utils");
  var ReviewModel = require("models/ReviewModel");

  var CreateReview = Utils.Page.extend({

    constructorName: "CreateReview",

    model: MyModel,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.createreview;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "createreview",
    className: "i-g page",

    events:{
      "tap #submit": "review"
    },


    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    review: function(){


      
      //getting the form values and JSONing them
      var form = document.getElementById("createreviewform");
      
      //make the date
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


      var review = new ReviewModel();
      review.set(form.elements[0].name, form.elements[0].value);
      review.set(form.elements[1].name, form.elements[1].value);
      review.set(form.elements[2].name, form.elements[2].value);
      review.set("date", yyyy + "-" + mm + "-" + dd);
      review.set("authorId", BaasBox.getCurrentUser().visibleByAnonymousUsers.profileId);

      if(review.get("description") != "" && review.get("rating")){
        BaasBox.save(review, "Reviews")
        .done(function(res) {
          console.log("res ", res);

          var reviewData = res;
          //add the review on the profile
          BaasBox.loadObject("Profiles", res.receiverId)
            .done(function(res) {
              console.log("res ", res);
              res['data'].reviews.push(reviewData.id);
              if(res['data'].numberOfRatings != 0){


                res['data'].rating = (res['data'].rating * res['data'].numberOfRatings + parseFloat(reviewData.rating))/(res['data'].numberOfRatings + 1);


                res['data'].numberOfRatings += 1;
              }else{
                res['data'].numberOfRatings = 1;
                res['data'].rating = reviewData.rating;
              }
              
              //and save the profile
              BaasBox.save(res['data'],"Profiles")
              .done(function(res) {
                console.log("res ", res);
                
                //call the profileview with the newly made trip
                Backbone.history.navigate("profileview/" + res.id, {
                  trigger: true
                });
              })
              .fail(function(error) {
                console.log("error ", error);
                alert("There was an internal error creatign the trip");
              })
            })
            .fail(function(error) {
              console.log("error ", error);
            })

        })
        .fail(function(error) {
          console.log("error ", error);
        })
      }else{
        alert("Sorry but the data you entered is invalid")
      }
    }
    
  });

  return CreateReview;

});