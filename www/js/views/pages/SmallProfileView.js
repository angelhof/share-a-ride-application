define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utils = require("utils");

  var SmallProfileView = Utils.Page.extend({

    constructorName: "SmallProfileView",

    model: MyModel,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.smallprofileview;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "smallprofileview",
    className: "i-g page view smallprofileview",

    

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }

    
  });

  return SmallProfileView;

});