(function(){Meteor.startup(function () {
    setInterval(function () {
        Meteor.call("getServerTime", function (error, result) {
            Session.set("time", result);
        });
    }, 1000);
});

Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.subscribe("round");
Meteor.subscribe("bets");
Meteor.subscribe("users");
Meteor.subscribe("messages");

Template.rounds.rounds = function () {
	return Rounds.find({});
};

Template.game.events({
  	"click button": function (event) {
		event.preventDefault();

		var bonus = $(event.currentTarget).attr("bonus");
		var form = $(event.currentTarget).parent("form");
		var round = form.attr("round");
		var game = form.attr("game");
		var team1 = form.find(".team-1").val();
		var team2 = form.find(".team-2").val();
		if (Meteor.userId()) {
			Meteor.call("bet", round, game, team1, team2, bonus==="true");
		} else {
			alert("Login baby");
		}
  	}
});

Template.game.bets = function (game) {
	return Bets.find({game_id: game});
};

Template.table.users = function() {
	return Meteor.users.find({}, {sort: ["points", "asc"]});
};

Template.chat.messages = function() {
	return Messages.find({}, {sort: {time: 1}});
};

Template.chat.events({
	"click button": function(event) {
		event.preventDefault();
		if (Meteor.userId()) {
			var form = $(event.currentTarget).parent("form");
			var input = form.find("input");
			var message = input.val();
			input.val("");
			Meteor.call("chat", message);
		} else {
			alert("Login baby");
		}
	}
});



Template.time.time = function () {
    return Session.get("time");
};

})();
