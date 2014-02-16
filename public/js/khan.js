/*
 * The LoginKhan object provides functions to login a user, log them out, and  * read their repo info.
 * @param   {string}    baseURL     The Firebase URL
 * @param   {boolean}   newContext  When a new Firebase context is u                        used.
 * @return  {boolean}   sucess
 */
function LoginKhan(baseURL, newContext) {
	var self = this;
	this._name = null;
	this._userID = null;
	this._firebase = null;

	if (!baseURL || typeof baseURL != "string") {
		var error = "Invalid baseURL provided";
		console.log(error);
		throw new Error(error);
	}

	this._firebase = new Firebase(baseURL, newContext || false ? new Firebase.Context() : null);

	var url = "http://www.khanacademy.org/api/auth/request_token";
	var accessor = {
		token : null,
		tokenSecret : null,
		consumerKey : "pEHDKRqN6MfGZ3xV",
		consumerSecret : "tWVGq25eF8Cyk4yy",
		signature_method : "HMAC-SHA1"
	};

	var message = {
	action: url,
	method: "GET",
	parameters: {oauth_consumer_key : null, oauth_nonce :null, oauth_version: null, oauth_signature :null, oauth_timestamp:null}
	};

	OAuth.completeRequest(message, accessor);
	OAuth.SignatureMethod.sign(message, accessor);
	url = url + '?' + OAuth.formEncode(message.parameters);
	this._url=url;
	var result;
	console.log(url);
	self.getJSON(url, result);
	console.log(result);

}
LoginKhan.prototype = {
	_validateCallback : function(cb, notInit) {
		if (!cb || typeof cb != "function") {
			throw new Error("Invalid onComplete callback provided");
		} else {
			//logged out
		}
	},
	_onLoginStateChange : function(error, user) {
		var self = this;
		if (error) {
			console.log(error);
		} else if (user) {
			//   alert("Hello " + user.login +"!");
			var result;
			self.getJSON(user, result);
			console.log(result);
		} else {
			//logout
		}
	}
}

/**
 * _getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 **/
LoginKhan.prototype.getJSON = function(url, onResult) {
	var requri = url;
	requestJSON(requri, function(json) {
		if (json.message == "Not Found" || username == '') {
			console.log("NO USER FOUND!");
		} else {
			console.log("success");
			// else we have a user and we display their info
			var fullname = json.name;
			var username = json.login;
			var aviurl = json.avatar_url;
			var profileURL = json.html_url;
			var location = json.location;
			var followersNum = json.followers;
			var followingNum = json.following;
			var reposNum = json.public_repos;
			var stargazerNum = 0;
			var languageMap = {};
			var bestLanguage;
			var maxReposForLanguage = 0;

			if (fullname == undefined) {
				fullname = username;
			}

			function outputPageContent() {
				}
			} // end outputPageContent()

		} // end else statement
	);
	// end requestJSON Ajax call
}
function pushToFirebase(json) {
	var messageListRef = new Firebase('https://endorser.firebaseio.com/achievements');
	var newMessageRef = messageListRef.push();
	newMessageRef.set(json);
	var x = newMessageRef.toString();
	console.log(x);
}

function requestJSON(url, callback) {
	$.ajax({
		url : url,
		complete : function(xhr) {
			callback.call(null, xhr.responseJSON);
		}
	});
}
