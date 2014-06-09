//general
isAdmin = function () {
	var user = Meteor.user();
  	return !!user && !!user.admin;
};

//UI
UI.registerHelper('isAdmin', function() {
	if (isAdmin(Meteor.user())) {
		return true;
	}
    return false;
});