var http = require("http");
var https = require("https");
/*
 * The LoginGitHub object provides functions to login a user, log them out, and  * read their repo info.
 * @param	{string}	baseURL		The Firebase URL
 * @param	{boolean}	newContext 	When a new Firebase context is u						used.
 * @return	{boolean}	sucess
 */
function LoginGitHub(baseURL, newContext){
	var self = this;
	this._name = null;
	this._userID = null;
	this._firebase = null;

	if(!baseURL || typeof baseURL != "string") {
        var error = "Invalid baseURL provided";
        console.log(error);
        throw new Error(error);
    }
    
    this._firebase = new Firebase(
        baseURL, newContext || false ? new Firebase.Context() : null
    );
    this._firebaseAuthClient = new FirebaseSimpleLogin(this._firebase, function(error, user) {
        self._onLoginStateChange(error, user);
    });
    this._firebaseAuthClient.login('github', {
	    rememberMe: true,
	    scope: 'user,public_repo'
	});
}
LoginGitHub.prototype = {
    _validateCallback: function(cb, notInit) {
        if (!cb || typeof cb != "function") {
            throw new Error("Invalid onComplete callback provided");
        }
        else {
            //logged out
        }
    });
}

/**
    * _getJSON:  REST get request returning JSON object(s)
    * @param options: http options object
    * @param callback: callback to pass the results JSON object(s) back
 **/
LoginGitHub.prototype.getJSON = function(options, onResult){
    
        console.log("rest::getJSON");

        var prot = options.port == 443 ? https : http;
        var req = prot.request(options, function(res)
        {
            var output = '';
            console.log(options.host + ':' + res.statusCode);
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function() {
                var obj = JSON.parse(output);
                onResult(res.statusCode, obj);
            });
        });

        req.on('error', function(err) {
         //res.send('error: ' + err.message);
        });

        req.end();
}
LoginGitHub.prototype.login = function(provider) {
    var self = this;
    self._firebaseAuthClient.login(provider, {
        rememberMe: false,
        scope: 'user,public_repo'   
    });
}
