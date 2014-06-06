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
  user.admin = false;
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

Meteor.methods({
    update: function () {

        var usersPoints = {};
        var rounds = Rounds.find().fetch();
        for (var i = 0; i < rounds.length; i++) {
            var round = rounds[i];
            for (var j = 0; j < round["games"].length; j++) {
                var game = round["games"][j];
                var score1 = parseInt(game["score1"]);
                var score2 = parseInt(game["score2"]);
                var bets = Bets.find({game_id: game["_id"]}).fetch();
                for (var k = 0; k < bets.length; k++) {
                    var bet = bets[k];
                    var betScore1 = parseInt(bet["team1"]);
                    var betScore2 = parseInt(bet["team2"]);
                    var bonus = bet["bonus"];
                    var points = 0;
                    if (score1==betScore1 && score2==betScore2) {
                        points = 3;
                    } else if (score1>score2 && betScore1>betScore2) {
                        points = 1;
                    } else if (score1<score2 && betScore1<betScore2) {
                        points = 1;
                    } else if (score1==score2 && betScore1==betScore2) {
                        points = 1;
                    } 
                    if (bonus) {
                        points *= 2;
                    };
                    usersPoints[bet["user_id"]] = (usersPoints[bet["user_id"]]===undefined) ? points : usersPoints[bet["user_id"]] + points;
                };
            };
        };

        
        for (var userId in usersPoints) {
            Meteor.users.update({_id: userId}, {$set: {points: usersPoints[userId]}});
        }

    }
});

Meteor.methods({
    gameResult: function(gameId, score1, score2) {
        var round = Rounds.findOne({
            games: {$elemMatch : {_id: gameId}}
        });
        for (var i = 0; i < round["games"].length; i++) {
            var game = round["games"][i];
            if (game["_id"] == gameId) {
                var set = {};
                set['games.'+i+'.score1'] = parseInt(score1);
                set['games.'+i+'.score2'] = parseInt(score2);
                Rounds.update({_id: round["_id"]}, {$set: set});
            };
        };
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