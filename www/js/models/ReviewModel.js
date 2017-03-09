define(function(require) {

	var Backbone = require("backbone");

	var ReviewModel = Backbone.Model.extend({
		constructorName: "ReviewModel" 
		,
		defaults:{
			authorId: null,
			receiverId: null,
			date: null,
			rating: null,
			description: null
		}
	});
	return ReviewModel;
});