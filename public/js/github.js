var githubRef = new Firebase('https://endorser.firebaseio.com/github');

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
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

function loginGitHub(callback){
	var auth = new FirebaseSimpleLogin(githubRef, function(error, user) {
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
	});
	
	auth.login('github', {
		rememberMe: true,
		scope: 'user,public_repo'
	});
}

