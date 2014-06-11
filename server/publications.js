Meteor.publish("round", function () {
	return Rounds.getCurrent();
});

Meteor.publish("teams", function () {
	return Teams.find();
});

Meteor.publish("bets", function () {
  	return Bets.find();
});

Meteor.publish("hiddenBets", function () {
	var startedRounds = Rounds.startedRoundIds();
	console.log("hidden: " + Bets.find({round_id: {$nin: startedRounds}}, {fields: {team1: 0, team2: 0}}).count());
	return Bets.find({round_id: {$nin: startedRounds}}, {fields: {team1: 0, team2: 0}});
});

Meteor.publish("visibleBets", function () {
	var startedRounds = Rounds.startedRoundIds();
	console.log("visible: " + Bets.find({round_id: {$in: startedRounds}}).count());
	return Bets.find({round_id: {$in: startedRounds}});
});

Meteor.publish("users", function () {
    return Meteor.users.find({},
        {fields: {'points': 1, 'username': 1, 'winner_name': 1, 'admin': 1}});
});

Meteor.publish("messages", function () {
	return Messages.find({}, {limit: 10, sort: {time : -1}});
});