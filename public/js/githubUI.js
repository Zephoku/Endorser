function GitHubUI() {
	this._github = new Firefeed("https://endorser.firebaseio.com/github");
}

GitHubUI.prototype._renderLoad = function(e) {
	var loginButton = $("#login-button");
	loginButton.click(function(e) {
    	self._firefeed.login('github');
 	});
};