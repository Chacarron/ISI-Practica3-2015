describe("Testing Login", function(){

	beforeEach(function(done){
		Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
			Tracker.afterFlush(done);
		});
	});

	afterEach(function(done){
		Meteor.logout(function() {
			Tracker.afterFlush(done);
		});
	});


	it("Button 'Reset All' must be Visible", function(){
    		expect($(".resetall").is(":visible")).toBe(true);
	});


});

describe("Testing Logout", function(){


	it("Button 'Reset All' must be Hidden", function(){
    		expect($(".resetall").is(":visible")).toBe(false);
	});
});


