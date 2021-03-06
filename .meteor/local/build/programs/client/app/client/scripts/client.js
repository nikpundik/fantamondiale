(function(){Meteor.startup(function () {

	Meteor.updateServerTime("time");
	Meteor.updateServerTime("roundTime");
    
    setInterval(function () {
        Meteor.updateServerTime("time");
    }, 1000);

    setInterval(function () {
        Meteor.updateServerTime("roundTime");
    }, 1000*60);

});

Meteor.updateServerTime = function(sessionVariable) {
	Meteor.call("getServerDate", function (error, result) {
        Session.set(sessionVariable, result);
    });	
}

Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.subscribe("pastRounds");
Meteor.subscribe("nextRounds");
Meteor.subscribe("teams");
Meteor.subscribe("visibleBets");
Meteor.subscribe("hiddenBets");
Meteor.subscribe("myBets");
Meteor.subscribe("users");
Meteor.subscribe("messages");

Template.rounds.rounds = function () {
	return Rounds.find({}, {sort: {start_at: 1}});
};

Template.round.isRoundStarted = function(roundId) {
	var round = Rounds.findOne({_id: roundId});
	return Rounds.isStarted(round);
}

/*
Template.round.isRoundStarted = UI.emboxValue(
	function(roundId) {
		console.log(this.data);
		console.log("QUERY " + roundId);
		var round = Rounds.findOne({_id: roundId});
		return Rounds.isStarted(round);
	},
	EJSON.equals
);
*/

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

Template.bet.shown = function(team1, team2) {
    return team1 !== undefined && team2 !== undefined;
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
	var time = new Date(Session.get("time"));
    return time;
};

})();
