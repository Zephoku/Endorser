var email, password;
var firebaseRoot = new Firebase('https://endorser.firebaseio.com/');
var auth = new FirebaseSimpleLogin(firebaseRoot, function(error, user) {
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
    console.log("submitted");
    firstName = $( "#first-name" ).val();
    lastName = $( "#last-name" ).val();
    email = $( "#email" ).val();
    password = $( "#password" ).val();

    auth.createUser(email, password, function(error, user) {
      if (!error) {
        console.log("Register success!");
        console.log(user);
        var users = new Firebase('https://endorser.firebaseio.com/users/' + user.id);
        users.set({
          first_name: firstName,
          last_name: lastName,
          email: email
        });
      }
      else {
        console.log("Error: Not registered");
      }
    });

  });
});
