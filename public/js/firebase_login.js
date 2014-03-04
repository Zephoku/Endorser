var chatRef = new Firebase('https://endorser.firebaseio.com/users');
var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
});

auth.createUser(email, password, function(error, user) {
  if (!error) {
    console.log('User Id: ' + user.id + ', Email: ' + user.email);
  }
});
