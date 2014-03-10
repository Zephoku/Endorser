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
  $("#logout").click(function() {
    $.ajax({
      type: 'post',
      url: 'http://beta.openbadges.org/displayer/convert/email/',
      data: {
        email: 'jaredj93@gmail.com'
      },

      success: function (data, status) {
        console.log("success");
        console.log(data);
      },
      error: function (code) {
        console.log("error");
      }
    });
  });
});