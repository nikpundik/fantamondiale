Meteor.publish("round", function () {
  return Rounds.getCurrent();
});

Meteor.publish("bets", function () {
  return Bets.find();
});

Meteor.publish("users", function () {
    return Meteor.users.find({},
        {fields: {'points': 1, 'username': 1}});
});

Meteor.publish("messages", function () {
  return Messages.find({}, {limit: 10, sort: {time : -1}});
});