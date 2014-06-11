Rounds = new Meteor.Collection("rounds");

Rounds.getCurrent = function() {
	var round = Rounds.find({}, {limit: 5, sort: ["start_at", "asc"]});
	return round;
};

Rounds.getStartDate = function(round) {
	if (round) {
		return new Date(round["start_at"]);
	}
	return null;
};

Rounds.isStarted = function(round) {
	if (Meteor.isServer) {
		//var time = new Date(2014, 5, 14, 19);
		var time = new Date();
        var offset = time.getTimezoneOffset();
        var hours = 16 - offset/60;
        var roundDate = Rounds.getStartDate(round);
        roundDate.setHours(hours,0,0,0);
        return roundDate < time;       
	}
	return false;
}

Rounds.startedRoundIds = function() {
	var rounds = Rounds.find().fetch();
	var startedRounds = new Array();
	for (var i = 0; i < rounds.length; i++) {
		var round = rounds[i];
		var isStarted = Rounds.isStarted(round);
		if (isStarted) {
			startedRounds.push(round["_id"]);
			console.log("Started: "+ round["title"]);
		}
	}
	//console.log("Started rounds: " + startedRounds);
	return startedRounds;
}