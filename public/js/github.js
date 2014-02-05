var githubRef = new Firebase('https://endorser.firebaseio.com/github');
var auth = new FirebaseSimpleLogin(githubRef, function(error, user) {
    if (error) {
        alert(error);
    }
    else if (user) {
        alert('User ID: ' + user.id + ', Provider: ' + user.provider);
    }
    else {
        //logged out
    }
});

auth.login('github');
