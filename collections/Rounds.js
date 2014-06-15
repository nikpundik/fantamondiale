Rounds = new Meteor.Collection("rounds");

Rounds.getStartDate = function(round) {
	if (round) {
		return new Date(round["start_at"]);
	}
	return null;
};

Rounds.todayRoundString = function() {
	var date = new Date();
	return date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2);
}

Rounds.findNextRounds = function(howMany) {
	var dateString = this.todayRoundString();
	return Rounds.find({start_at: {$gte: dateString}}, {limit: howMany, sort: {start_at: 1}});
}

Rounds.findPastRounds = function(howMany) {
	var dateString = this.todayRoundString();
	return Rounds.find({start_at: {$lt: dateString}}, {limit: howMany, sort: {start_at: -1}});
}

Rounds.isStarted = function(round) {
	if (Meteor.isServer) {
		//var time = new Date(2014, 5, 13, 19);
		var time = new Date();   
	} else {
		//not reliable!
		//get time from session, but updated with higher delay
		var time = new Date();
	}
	var offset = time.getTimezoneOffset();
    var hours = 16 - offset/60;
    var roundDate = Rounds.getStartDate(round);
    roundDate.setHours(hours,0,0,0);
    return roundDate < time; 
}

Rounds.startedRoundIds = function() {
	var rounds = Rounds.find().fetch();
	var startedRounds = new Array();
	for (var i = 0; i < rounds.length; i++) {
		var round = rounds[i];
		var isStarted = Rounds.isStarted(round);
		if (isStarted) {
			startedRounds.push(round["_id"]);
		}
	}
	return startedRounds;
}