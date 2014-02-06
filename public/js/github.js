/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 *
exports.getJSON = function(options, onResult)
{
    console.log("rest::getJSON");

    var prot = "http"; 
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
};
*/
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
	this._mainUser = null;

	this._handlers = [];

	if(!baseURL || typeof baseURL != "string") {
        var error = "Invalid baseURL provided";
        console.log(error);
        throw new Error(error);
    }
    
    this._firebase = new Firebase(
        baseURL, newContext || false ? new Firebase.Context() : null
    );
    this._firebaseAuthClient = new FirebaseSimpleLogin(this._firebase, function(error, user) {
        self._firebaseAuthClient.login('github', {
            rememberMe: true,
            scope: 'user,public_repo'
        });  
        self._onLoginStateChange(error, user);
    });
}
LoginGitHub.prototype = {
    _validateCallback: function(cb, notInit) {
        if (!cb || typeof cb != "function") {
            throw new Error("Invalid onComplete callback provided");
        }
        if (!notInit) {
            if (!this._userid || !this._firebase) {
                throw new Error("Method called without a preceding login() call");
            }
        }
    },
    _onLoginStateChange: function(error, user){
        var self = this;
    	if (error) {
        	alert(error);
    	}
    	else if (user) {
        	alert('User login: ' + user.username + ', Provider: ' + user.provider);
		    var options = {
				host: 'api.github.com',
				port: 80,
				path: '/'+ user.login + '/repos',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			};
			var result;
			exports.getJSON(options, result);
			console.log(result); 
    	}
    	else {
        	//logged out
    	}
	}
};

LoginGitHub.prototype.onLoginStateChange = function(onLoginStateChange) {
    var self = this;
    self._validateCallBack(onLoginStateChange, true);
    this._authHandlers.push(onLoginStateChange);
};
