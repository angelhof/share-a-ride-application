define(function(require) {

	var Backbone = require("backbone");
	var LetExp = /^[a-zA-Z]+$/;
	var MailExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	var UserProfileModel = Backbone.Model.extend({
		validate: function(attrs,options)
		{

		if (attrs.name=="" || !LetExp.test(attrs.name))
			{
				return "Invalid name!";
			}
		if (attrs.surname=="" || !LetExp.test(attrs.surname))
			{
				return "Invalid surname!";
			}
		if(attrs.email=="" || !MailExp.test(attrs.email))
			{
				return "Invalid E-mail!";
			}
		if(attrs.age==null || attrs.age < 16)
		{
			return "Invalid age!";
		}
		if(attrs.gender==""|| attrs.gender==null)
		{
			return "Choose gender!";
		}
		
		},
	
		constructorName: "UserProfileModel" 
		,
		defaults:{
			name: "No Name" ,
			surname: "No Surname",
			email: "none@none.none" ,
			rating: 0,
			numberOfRatings: 0,
			age: 0,
			picId: "2dc2a333-e594-492a-a833-00a57e915625",
			id: null,
			trips: [],
			tripNumber: 0,
			gender:null
			
		}
	});
	return UserProfileModel;
});