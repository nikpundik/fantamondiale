UI.registerHelper('isAdmin', function() {
	if (Meteor.users.isAdmin()) {
		return true;
	}
    return false;
});

UI.registerHelper('isRoundStarted', function(roundId) {
	var round = Rounds.findOne({_id: roundId});
	return Rounds.isStarted(round);
});