var chatRef = new Firebase('https://endorser.firebaseio.com/');
var loggedin;

var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
    loggedin = true;
  } else {
    // user is logged out
    console.log('Not logged in');
  }
});
$(document).ready(function() {
  if (loggedin) {
    $('#register').toggleClass('hidden');
    $('#login').toggleClass('hidden');
  }
  else {
    $('#logout').toggleClass('hidden');
  }

});
