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
//        __openbadges_ui = new OpenBadgesUI();
    });

    function GitHubUI() {
    	this._github = new LoginGitHub("https://endorser.firebaseio.com/github", userID);
    	var self = this;
    	var loginButton = $("#github-button");
    	loginButton.click(function(e) {
    		self._github.login('github');
    	});
    }
});


$(document).ready(function() {

});

$(document).on('click', "#card", function(e) {
    $(this).toggleClass("flipped");
    console.log("Card is flipped")
    e.preventDefault();
});
