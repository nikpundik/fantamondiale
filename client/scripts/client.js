Meteor.startup(function () {
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
Meteor.subscribe("teams");
Meteor.subscribe("visibleBets");
Meteor.subscribe("hiddenBets");
Meteor.subscribe("myBets");
Meteor.subscribe("users");
Meteor.subscribe("messages");

Template.rounds.rounds = function () {
	return Rounds.find({});
};

Template.game.events({

  	"click .bet-form button": function (event) {
		event.preventDefault();

		var bonus = $(event.currentTarget).attr("bonus");
		var form = $(event.currentTarget).parent("form");
		var round = form.attr("round");
		var game = form.attr("game");
		var team1 = parseInt(form.find(".team-1").val());
		var team2 = parseInt(form.find(".team-2").val());
		if (Meteor.userId()) {
			Meteor.call("bet", round, game, team1, team2, bonus==="true");
		} else {
			alert("Login");
		}
  	},

  	"click .result-form button": function (event) {
  		event.preventDefault();

		var form = $(event.currentTarget).parent("form");
		var round = form.attr("round");
		var game = form.attr("game");
		var team1 = form.find(".team-1-result").val();
		var team2 = form.find(".team-2-result").val();
		if (Meteor.users.isAdmin()) {
			Meteor.call("setResult", game, team1, team2);
		} else {
			alert("Login");
		}
  	}

});

Template.game.bets = function (game) {
	return Bets.find({game_id: game});
};

Template.admin.events({
	"click button.update": function() {
		if (Meteor.users.isAdmin()) {
			Meteor.call("update");
		} else {
			alert("Login");
		}
	}
});

Template.table.users = function() {
	return Meteor.users.find({}, {sort: {points: -1}});
};

Template.chat.messages = function() {
	return Messages.find({}, {sort: {time: 1}});
};

Template.winner.teams = function() {
	return Teams.find();
};

Template.winner.events({
  	"click button": function (event) {
		event.preventDefault();

		var form = $(event.currentTarget).parent("form");
		var winner = form.find("select").val();
		if (Meteor.userId()) {
			Meteor.call("winner", winner);
		} else {
			alert("Login");
		}
  	}
});

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
			alert("Login");
		}
	}
});



Template.time.time = function () {
    return Session.get("time");
};