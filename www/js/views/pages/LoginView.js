define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utils = require("utils");
  var padding ;

  var LoginView = Utils.Page.extend({

    constructorName: "LoginView",

    model: MyModel,

    events: {
      "tap #login": "loginFunction",
      "tap #Signup": "signupView"
      
    },

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.loginview;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.loadData)
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "loginview",
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

    signupView: function(){

      //this redirects to sign up form
      Backbone.history.navigate("signupview", {
            trigger: true
          });

    },

    loginFunction: function(event) {


      //first of all we logout from the previous user
      BaasBox.logout()
      .done(function (res) {
        console.log(res);
      })
      .fail(function (error) {
        console.log("error ", error);
      })

      //getting the form values
      var form = document.getElementById("loginform");

      //TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO -------------LOGIN HAPPENS WITH EMAIL AND NOT USERNAEM

      //TODO Maxlength of fields maybe with html use
      //Form Validation
      var formValid = true;
      
      //username validation
      if(form.elements[0].value == "" || form.elements[0].value == null){
        alert("You didn't type an email :(");
          formValid = null;
      }

      //password validation
      if(form.elements[1].value == "" || form.elements[1].value == null){
        alert("You didn't even type a password :'(");
          formValid = null;
      }

      if(formValid){

      //login with the user info gotten
      BaasBox.login(form.elements[0].value, form.elements[1].value)
        .done(function (user) {
          console.log("Logged in ", user);

          //we store the userToken and ProfileId 
          sessionStorage.userToken = user.token;
          sessionStorage.userProfileId = user.visibleByAnonymousUsers.profileId;
          document.getElementsByClassName("bar bar-nav")[0].style.display = "block";
          document.getElementById("content").style.padding = padding;

          //change the view to the list for now
          Backbone.history.navigate("searchtripview", {
            trigger: true
          });
      })
        .fail(function (err) {
          console.log("error ", err);
          alert("The username/password combination is not correct :/")
          Backbone.history.navigate("loginview", {
            trigger: true
          });
      });

      }


    }

    
  });

  return LoginView;

});