UI.registerHelper('isAdmin', function() {
	if (Meteor.users.isAdmin()) {
		return true;
	}
    return false;
});