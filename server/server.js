Meteor.startup(function () {

	//Rounds.remove({});
    //Bets.remove({});
    //Meteor.users.remove({});

	if(Rounds.find().count() === 0) {

	    Meteor.call("rounds", function(error, rounds) {
        	for (var i = 0; i < rounds.length; i++) {
        		Meteor.call("round", rounds[i]['pos'], function(error, round) {
                    for (var j = 0; j < round["games"].length; j++) {
                        round["games"][j]["_id"] = "game_id_" + i + "_" + j;
                    };
                    rounds[i]["games"] = round["games"];
                    if (rounds[i]["start_at"] == "1912/01/01") {
                        rounds[i]["start_at"] = "2015/01/01";
                    };
                    Rounds.insert(rounds[i]);
        		});
        	};
    	});

	}

    if (Teams.find().count() === 0) {

        Meteor.call("teams", function(error, teams) {
            for (var i = 0; i < teams.length; i++) {
                var team=teams[i];

            };
        });

    };

});