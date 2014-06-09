Meteor.users.isAdmin = function() {
	var user = Meteor.user();
  	return !!user && !!user.admin;
}