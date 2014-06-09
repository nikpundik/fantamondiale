Accounts.onCreateUser(function(options, user) {
  user.points = 0;
  user.admin = false;
  return user;
});