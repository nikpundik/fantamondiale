(function(){Rounds = new Meteor.Collection("rounds");

Rounds.getCurrent = function() {
	var round = Rounds.find({}, {limit: 5, sort: ["start_at", "asc"]});
	return round;
};

Rounds.getDay = function(round) {
	var round = Rounds.findOne({_id: round});
	if (round) {
		return new Date(round["start_at"]);
	}
	return null;
};

})();
