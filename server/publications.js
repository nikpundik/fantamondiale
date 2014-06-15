Meteor.publish("nextRounds", function () {
	return Rounds.findNextRounds(3);
});

Meteor.publish("pastRounds", function () {
	return Rounds.findPastRounds(2);
});

Meteor.publish("teams", function () {
	return Teams.find();
});

Meteor.publish("bets", function () {
  	return Bets.find();
});

Meteor.publish("hiddenBets", function () {
	/*
	var user = Meteor.users.findOne(this.userId);
	if (user!==undefined && user["admin"]!==undefined && user["admin"]) {
		return Bets.find();
	} else {
		var startedRounds = Rounds.startedRoundIds();
		return Bets.find({round_id: {$nin: startedRounds}}, {fields: {team1: 0, team2: 0}});
	}
	*/
	var startedRounds = Rounds.startedRoundIds();
	return Bets.find({round_id: {$nin: startedRounds}}, {fields: {team1: 0, team2: 0}});
});

Meteor.publish("visibleBets", function () {
	/*
	var user = Meteor.users.findOne(this.userId);
	if (user!==undefined && user["admin"]!==undefined && user["admin"]) {
		return Bets.find();
	} else {
		var startedRounds = Rounds.startedRoundIds();
		return Bets.find({round_id: {$in: startedRounds}});
	}
	*/
	var startedRounds = Rounds.startedRoundIds();
	return Bets.find({round_id: {$in: startedRounds}});
});

Meteor.publish("myBets", function () {
	if (this.userId!==undefined) {
		return Bets.find({user_id: this.userId});
	} else {
		return null;
	}
});

Meteor.publish("users", function () {
    return Meteor.users.find({},
        {fields: {'points': 1, 'username': 1, 'winner_name': 1, 'admin': 1}});
});

Meteor.publish("messages", function () {
	return Messages.find({}, {limit: 10, sort: {time : -1}});
});