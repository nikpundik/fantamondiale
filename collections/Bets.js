Bets = new Meteor.Collection("bets");

Bets.bet = function(round, game, team1, team2, bonus, userId) {
	if (Meteor.isServer) {
		var user = Meteor.users.findOne({_id: userId});
		Bets.insert({
            round_id: round,
            game_id: game,
            team1: team1,
            team2: team2,
            user_id: userId, 
            bonus: bonus,
            username: user.username,
            created: new Date()
        });
	};
}

Bets.bonusBet = function(userId) {
	return this.findOne({user_id: userId, bonus: true});
};