(function(){Bets = new Meteor.Collection("bets");

Bets.bet = function(round, game, team1, team2, bonus) {
	if (Meteor.isServer) {
		
	};
}

Bets.bonusBet = function() {
	return this.findOne({user_id: Meteor.userId(), bonus: true});
};

})();
