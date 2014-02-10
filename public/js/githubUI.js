var __github_ui;
$(function() {
     __github_ui = new GitHubUI();
});

function GitHubUI() {
	this._github = new LoginGitHub("https://endorser.firebaseio.com/github");
	var self = this;
	var loginButton = $("#login-button");
	loginButton.click(function(e) {
    	self._github.login('github');
 	});
}
