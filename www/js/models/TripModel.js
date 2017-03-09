define(function(require) {

	var Backbone = require("backbone");
	var LetExp = /^[a-zA-Z]+$/;
	var TripModel = Backbone.Model.extend({
		constructorName: "TripModel" ,
		validate: function(attrs,options)
		{
			if(attrs.origin=="" || !attrs.origin.match(LetExp))
			{
				return "Invalid entry!";
			}
			if(attrs.destination=="" || !attrs.destination.match(LetExp))
			{
				return "Invalid entry!";
			}
			if(attrs.date=="")
			{
				return "Invalid Date!";
			}
			if(attrs.orginlat=="")
			{
				return "Invalid lat!";
			}
			if(attrs.orginlong=="")
			{
				return "Invalid long!";
			}
			if(attrs.time=="")
			{
				return "Invalid Time!";
			}
		}
		


		,
		defaults:{
			driverId: "null",
			passengersIds: [],
			origin: "null" ,
			destination: "null",
			isRegular: null,
			date: "1",
			time:"1",
			seats: 0,
			description: "",
			originlat: 0,
			originlong: 0,
			destinationlat: 0,
			destinationlong: 0,
			id: null
		}
	});
	return TripModel;
});