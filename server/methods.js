var eventKey = "world.2014";

Meteor.methods({

    rounds: function () {
        this.unblock();
        var result = Meteor.http.call("GET", "http://footballdb.herokuapp.com/api/v1/event/" + eventKey + "/rounds");
        var json = JSON.parse(result.content);
        return json.rounds;
    },

    round: function (roundNumber) {
        this.unblock();
        var result = Meteor.http.call("GET", "http://footballdb.herokuapp.com/api/v1/event/" + eventKey + "/round/" + roundNumber);
        var json = JSON.parse(result.content);
        return json;
    },

    teams: function () {
        this.unblock();
        var result = Meteor.http.call("GET", "http://footballdb.herokuapp.com/api/v1/event/" + eventKey + "/teams");
        var json = JSON.parse(result.content);
        return json.teams;
    },

    bet: function (round, game, team1, team2, bonus) {
        
        if (isNaN(team1)) {
            team1 = 0;
        }
        if (isNaN(team2)) {
            team2 = 0;
        };
        if (Bets.bonusBet(Meteor.userId()) && bonus) {

        } else {
            var roundObject = Rounds.findOne({_id: round});
            var isStarted = Rounds.isStarted(roundObject);
            if (!isStarted) {
                var bets = Bets.remove({game_id: game, user_id: Meteor.userId()});
                Bets.bet(round, game, team1, team2, bonus, Meteor.userId(), false);
            };
        }

    },

    setResult: function (gameId, score1, score2) {
        
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

    },

    winner: function (winner) {
        var team = Teams.findOne({_id: winner});
        var winnerEnd = new Date(2014, 5, 12, 16, 0, 0);
        var now = new Date();
        if (now < winnerEnd) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"winner_id": winner, "winner_name": team["title"]}});
        };
    },

    getServerTime: function () {
        var _time = (new Date).toTimeString();
        return _time;
    },

    chat: function (message) {
        var user = Meteor.user();
        Messages.insert({message: message, time: new Date(), username: user.username});
    },

    gameResult: function(gameId, score1, score2) {
        
    },

    update: function () {

        var usersPoints = {};
        var rounds = Rounds.find().fetch();
        for (var i = 0; i < rounds.length; i++) {
            var round = rounds[i];
            for (var j = 0; j < round["games"].length; j++) {
                var game = round["games"][j];
                var score1 = parseInt(game["score1"]);
                var score2 = parseInt(game["score2"]);
                Meteor.call("setDefaults", round["_id"], game["_id"]);
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

    },

    setDefaults: function (roundId, gameId) {
        var users = Meteor.users.find().fetch();
        for (var k = 0; k < users.length; k++) {
            var user = users[k];
            var bet = Bets.findOne({game_id: gameId, user_id: user["_id"]});
            if (bet === undefined) {
                Bets.bet(roundId, gameId, 0, 0, false, user["_id"], true);
            };
        }
    },

    makeAdmin: function (username) {
        var admins = Meteor.users.find({admin: true}).count();
        if ( admins==0 | Meteor.users.isAdmin() ) {
            Meteor.users.update({username: username}, {$set: {admin: true}});
        }
    },

    reset: function () {
        if (Meteor.users.isAdmin()) {
            //Rounds.remove({});
            Bets.remove({});
            Messages.remove({});
            Teams.remove({});
            Meteor.users.remove({});
            Meteor.afterStartUp();
        };
        
    }

});
