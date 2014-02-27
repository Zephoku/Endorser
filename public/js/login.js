var email, password;
var chatRef = new Firebase('https://endorser.firebaseio.com/users');
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

$(document).ready(function() {
  $( "form" ).submit(function( event ) {
    event.preventDefault();
    email = $( "#email" ).val();
    password = $( "#password" ).val();

    auth.login('password', { email: email, password: password });
  });
});
