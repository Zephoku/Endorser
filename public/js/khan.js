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

	var url = "http://www.khanacademy.org/api/auth/request_token?oauth_callback=http://localhost:3000&"; /*local host*/
	//var url = "http://www.khanacademy.org/api/auth/request_token?oauth_callback=http://endorse130.herokuapp.com&" /*heroku*/
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
	url = url  + OAuth.formEncode(message.parameters);

	this._url=url;
	console.log(url);
	this.getJSON = url1;
}


/**
 * _getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 **/
function url1(url){
	auth=window.open(url,'Login','height=600,width=900');
	if (window.focus) {auth.focus()}
	var key;
	var timer = setInterval(function() {
		if(auth.document.title == "Endorser"){
			key = auth.document.URL;
			console.log(key);
			auth.close();
			url2(key);
			clearInterval(timer);
		}
	}, 100);
	
}

function url2(key){
	console.log("url2");
	var sec_beg = key.search("oauth_token_secret") + 19;
	var ver_beg = key.search("oauth_verifier") + 15;
	var token_beg = key.search("oauth_token=") + 12;
	var sec_end = ver_beg -16;
	var ver_end = token_beg -13;
	var token_end = key.search("#_=_");
	
	var secret = key.substring(sec_beg, sec_end);
	var otoken = key.substring(token_beg, token_end);
	var verify = key.substring(ver_beg, ver_end);
	
	var url = "http://www.khanacademy.org/api/auth/access_token?oauth_callback=http://localhost:3000&oauth_verifier=" + verify + "&"; /*local host*/
	//var url = "http://www.khanacademy.org/api/auth/acces_token?oauth_callback=http://endorse130.herokuapp.com&oauth_verifier=" + verify + "&" /*heroku*/"
	console.log(otoken);
	console.log(secret);
	console.log(verify);
	var accessor = {
		token : otoken.toString(),
		tokenSecret : secret,
		consumerKey : "pEHDKRqN6MfGZ3xV",
		consumerSecret : "tWVGq25eF8Cyk4yy",
		signature_method : "HMAC-SHA1"
	};
	console.log(accessor.tokenSecret);
	var message = {
	action: url,
	method: "GET",
	parameters: {oauth_consumer_key : null, oauth_token : null, oauth_nonce :null, oauth_version: null, oauth_signature :null, oauth_timestamp:null}
	};
	
	OAuth.completeRequest(message, accessor);
	OAuth.SignatureMethod.sign(message, accessor);
	url = url  + OAuth.formEncode(message.parameters);
	console.log(url);
	var count = 0;
	var auth = window.open(url, 'Login','height=600,width=900');
	var timer = setInterval(function() {
		if(count){
			accessor.tokenSecret= null;
			auth.close();
			url3(accessor, message);
			clearInterval(timer);
		}
		count++;
	}, 200);
	
	
}

function url3(accessor, message){
	var url = "http://www.khanacademy.org/api/v1/badges?";
	
	OAuth.completeRequest(message, accessor);
	OAuth.SignatureMethod.sign(message, accessor);
	url = url  + OAuth.formEncode(message.parameters);
	console.log(url);
	getJSON(url);
}

function getJSON(url){
	var requri = url;
	/*requestJSON(requri, function(json) {
		if (json.message == "Not Found" || username == '') {
			consolereque.log("NO USER FOUND!");
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
	// end requestJSON Ajax call*/
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
