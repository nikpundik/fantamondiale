Meteor.publish("nextRounds", function () {
	return Rounds.findNextRounds(3);
});

Meteor.publish("pastRounds", function () {
	return Rounds.findPastRounds(2);
});

Meteor.publish("teams", function () {
	return Teams.find();
});

Meteor.publishBets = function() {

	var startedRoundIds = Rounds.startedRoundIds();

	Meteor.publish("hiddenBets", function () {
		return Bets.find({round_id: {$nin: startedRoundIds}}, {fields: {team1: 0, team2: 0}});
	});

	Meteor.publish("visibleBets", function () {
		return Bets.find({round_id: {$in: startedRoundIds}});
	});

	Meteor.publish("myBets", function () {
		if (this.userId !== undefined) {
			return Bets.find({user_id: this.userId});
		} else {
			return null;
		}
	});

}

Meteor.publishBets();

Meteor.publish("users", function () {
    return Meteor.users.find({},
        {fields: {'points': 1, 'username': 1, 'winner_name': 1, 'admin': 1}});
});

Meteor.publish("messages", function () {
	return Messages.find({}, {limit: 10, sort: {time : -1}});
});