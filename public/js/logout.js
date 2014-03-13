var chatRef = new Firebase('https://endorser.firebaseio.com/');
var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
    
  } else {
    // user is logged out
    console.log('Not logged in');
  }
});

auth.logout();
window.location.href = '/';
