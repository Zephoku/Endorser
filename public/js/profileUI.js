function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var email, password;
var chatRef = new Firebase('https://endorser.firebaseio.com/profile');
var userID = getParameterByName('userID');
console.log("User with ID:" + userID + " is logged in.");

var githubAuth = new FirebaseSimpleLogin(chatRef, function(error, githubUser) {
	
    var __github_ui;
    var __openbadges_ui;
    $(function() {
    	__github_ui = new GitHubUI();
        __openbadges_ui = new OpenBadgesUI();
    });

    function GitHubUI() {
    	this._github = new LoginGitHub("https://endorser.firebaseio.com/github", userID);
    	var self = this;
    	var loginButton = $("#github-button");
    	loginButton.click(function(e) {
    		self._github.login('github');
    	});
    }

    function OpenBadgesUI() {
        var loginButtonOpenBadges = $("#openbadges-button");
        loginButtonOpenBadges.click(function(e) {
            var openb_email = prompt("Please enter your email address","");
            if (openb_email != null && validateEmail(openb_email)) {
                GetBadges(openb_email, userID);
            }
        });
    }
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 
});


var card = $('#card');
card.on('click', function(e) {
    $('#card').toggleClass("flipped");
    e.preventDefault();
});
