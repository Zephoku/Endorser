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

var githubAuth;
var __github_ui;
var githubAuth = new FirebaseSimpleLogin(chatRef, function(error, githubUser) {
    $(function() {
    	if(__github_ui == null)
            __github_ui = new GitHubUI();
    });

    function GitHubUI() {
    	this._github = new LoginGitHub("https://endorser.firebaseio.com/github", userID);
    	var self = this;
    	var loginButton = $("#github-button");
    	loginButton.click(function(e) {
    		self._github.login('github');
            self._github.logout();
    	});
    }
});

$(document).on('click', "#card", function(e) {
    $(this).toggleClass("flipped");
    console.log("Card is flipped")
    e.preventDefault();
});

function fbs_click() {u=location.href;t=document.title;window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');return false;}
