define(function(require) {

  var Backbone = require("backbone");
  var UserProfileModel = require("models/UserProfileModel");
  var Utils = require("utils");



  //TODO Fix the signup
  function createNewUser(){
    //getting the form values and making a new model instance with them
    var form = document.getElementById("signupform");
    
    var profile = new UserProfileModel();
    var i;
    for (i = 0; i < form.length - 3 ;i++) {
      profile.set(form.elements[i].name, form.elements[i].value);
    }

    


    //Save the new profile on the database
    BaasBox.save(profile, "Profiles")
    .done(function(res) {
      console.log("res ", res);
      document.getElementsByClassName("bar bar-nav")[0].style.display = "block";
      document.getElementById("content").style.padding = padding;
      Backbone.history.navigate("searchtripview", {
        trigger: true
      });

    })
    .fail(function(error) {
      console.log("error ", error);
    })


  };







  var SignupView = Utils.Page.extend({

    constructorName: "SignupView",

    model: UserProfileModel,

    events: {
      "tap #signup": "signupFunction"
      
    },

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.signupview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.loadData)
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "signupview",
    className: "i-g page view",

    

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    loadData: function() {
      document.getElementsByClassName("bar bar-nav")[0].style.display = "none";
      padding = document.getElementById("content").style.padding;
      document.getElementById("content").style.padding = 0;
    },

    signupFunction: function() {

      var formValid = true;
      //getting the form values
      var form = document.getElementById("signupform");

      var profile = new UserProfileModel();
      var i;
      for (i = 0; i < form.length - 5 ;i++) {
        profile.set(form.elements[i].name, form.elements[i].value);
      }

      if(form.elements[form.length - 5].checked){
        profile.set("gender", form.elements[form.length - 5].value);
      }else if (form.elements[form.length - 4].checked){
        profile.set("gender", form.elements[form.length - 4].value);
      }

      //password validation
      if(form.elements[6].value == "" || form.elements[6].value == null){
          formValid = null;
      }

      //password confirm validation
      if(form.elements[7].value == "" || form.elements[7].value == null){
          formValid = null;
      }

      //password equal to confirm password validation
      if(form.elements[6].value != form.elements[7].value){
          formValid = null;
      }

      if(profile.isValid() && formValid){

        //TODO Fix the signup becaus eit doesnt work, it keeps signing up with the same user and not the one i give credentials for
        //first of all logout

          
          BaasBox.signup(form.elements[2].value, form.elements[6].value)
          .done(function (user) {
            console.log("Signed Up", user);
            createNewUser();
          })
          .fail(function (err) {
            console.log("error ", err);
          })

        
      }else if(!profile.isValid()){
        alert(profile.validationError);
      }else{
        alert("The passwords you typed dont match :'( or you didnt even type a password :(");

      }

      
      
    }
  

    
  });

  return SignupView;

});