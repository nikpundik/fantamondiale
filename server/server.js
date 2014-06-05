var eventKey = "world.2014";

Meteor.startup(function () {

	//Rounds.remove({});
    //Bets.remove({});
    //Meteor.users.remove({});

	if(Rounds.find().count() === 0) {

	    Meteor.call("rounds", function(error, rounds) {
        	for (var i = 0; i < rounds.length; i++) {
        		Meteor.call("round", rounds[i]['pos'], function(error, round) {
                    for (var j = 0; j < round["games"].length; j++) {
                        round["games"][j]["_id"] = "game_id_" + i + "_" + j;
                    };
                    rounds[i]["games"] = round["games"];
                    if (rounds[i]["start_at"] == "1912/01/01") {
                        rounds[i]["start_at"] = "2015/01/01";
                    };
                    Rounds.insert(rounds[i]);
        		});
        	};
    	});

	}

});

Accounts.onCreateUser(function(options, user) {
  user.points = 0;
  return user;
});

Meteor.methods({
    rounds: function () {
        this.unblock();
        var result = Meteor.http.call("GET", "http://footballdb.herokuapp.com/api/v1/event/" + eventKey + "/rounds");
        var json = JSON.parse(result.content);
        return json.rounds;
    }
});

Meteor.methods({
    round: function (roundNumber) {
        this.unblock();
        var result = Meteor.http.call("GET", "http://footballdb.herokuapp.com/api/v1/event/" + eventKey + "/round/" + roundNumber);
        var json = JSON.parse(result.content);
        return json;
    }
});

Meteor.methods({
    bet: function (round, game, team1, team2, bonus) {
        if (Bets.bonusBet() && bonus) {

        } else {
            var user = Meteor.user();
            var time = new Date();
            var roundDate = Rounds.getDay(round);
            roundDate.setHours(18,0,0,0);
            if (time < roundDate) {
                var bets = Bets.remove({game_id: game, user_id: user._id});
                Bets.insert({
                    round_id: round,
                    game_id: game,
                    team1: team1,
                    team2: team2,
                    user_id: user._id, 
                    bonus: bonus,
                    username: user.username
                });
            };
        }
    }
});

Meteor.methods({
    getServerTime: function () {
        var _time = (new Date).toTimeString();
        return _time;
    }
});

Meteor.methods({
    chat: function (message) {
        var user = Meteor.user();
        Messages.insert({message: message, time: new Date(), username: user.username});
    }
});

Meteor.publish("round", function () {
  return Rounds.getCurrent();
});

Meteor.publish("bets", function () {
  return Bets.find();
});

Meteor.publish("users", function () {
    return Meteor.users.find({},
        {fields: {'points': 1, 'username': 1}});
});

Meteor.publish("messages", function () {
  return Messages.find({}, {limit: 10, sort: {time : -1}});
});