var __khan_ui;
$(function() {
     __khan_ui = new KhanUI();
});

function KhanUI() {
	this._khan = new LoginKhan("https://endorser.firebaseio.com/khan");
	var self = this;
	console.log("KhanUI");
	var loginButton = $("#login-button-k");
	loginButton.click(function(e) {
    	self._khan.url1
 	});
}
