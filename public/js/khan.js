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

	var uri = window.document.baseURI;
	uri = uri.substr(0, uri.length -1);
	var url = "http://www.khanacademy.org/api/auth/request_token?oauth_callback="+uri+"&"; /*heroku*/
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
	console.log("request url: "+url);
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
		var title = null;
		try{
			title = auth.document.title;
		}
		catch(e){}
		if(title == "Endorser"){
			key = auth.document.URL;
			console.log("callback url: "+key);
			
			url2(key);
			clearInterval(timer);
		}
	}, 100);
}

function url2(key){
	var sec_beg = key.search("oauth_token_secret") + 19;
	var ver_beg = key.search("oauth_verifier") + 15;
	var token_beg = key.search("oauth_token=") + 12;
	var sec_end = key.search("&oauth_verifier");
	var ver_end = key.search("&oauth_token=");
	var token_end = key.search("#_=_");
	if(token_end == -1){
		token_end = key.length;
	}
	
	var secret = key.substring(sec_beg, sec_end);
	var otoken = key.substring(token_beg, token_end);
	var verify = key.substring(ver_beg, ver_end);
	var uri = window.document.baseURI;
	uri = uri.substr(0, uri.length -1);
	var url =   "http://www.khanacademy.org/api/auth/access_token?oauth_callback=" + uri +"&oauth_verifier=" + verify + "&"; /*heroku*/
	console.log("token: "+otoken);
	console.log("secret: "+secret);
	console.log("verifier: "+verify);
	var accessor = {
		token : otoken,
		tokenSecret : secret,
		consumerKey : "pEHDKRqN6MfGZ3xV",
		consumerSecret : "tWVGq25eF8Cyk4yy",
		signature_method : "HMAC-SHA1"
	};
	var message = {
	action: url,
	method: "GET",
	parameters: {oauth_consumer_key : null, oauth_token : null, oauth_nonce :null, oauth_version: null, oauth_signature :null, oauth_timestamp:null}
	};
	
	OAuth.completeRequest(message, accessor);
	OAuth.SignatureMethod.sign(message, accessor);
	url = url  + OAuth.formEncode(message.parameters);
	console.log("access url: "+url);
	var count = 0;
	window.open(uri+"/js/proxy.php");
	$.ajax({
    url: 'js/proxy.php',
    type: 'POST',
    data: {
        address: url
    },
    success: function(response) {
        console.log(response);
    }
})

	
	var auth1 = window.open(url, 'Login','height=600,width=900');
	var timer = setInterval(function() {
		if(count){
			var sec = auth1.document.innerHTML;
			console.log(sec);
			//auth1.close();
			console.log(accessor.tokenSecret);
			url3(accessor, message);
			clearInterval(timer);
		}
		count++;
	}, 1000);
	
	

}

function url3(accessor, message){
	var url = "http://www.khanacademy.org/api/v1/badges?";
	
	OAuth.completeRequest(message, accessor);
	OAuth.SignatureMethod.sign(message, accessor);
	url = url  + OAuth.formEncode(message.parameters);
	console.log("badge url: " + url);
	getJSON(url);
}

function getText(url){
var uri = url;
requestText(uri, function(text) {
		if (text == null) {
			console.log("NO USER FOUND!");
		} else {
			var badges;
			$.getText(uri, function(text) {
				badges = text;
				console.log(badges);
			});
		}
	}); 
}

function getJSON(url){
	var badgeURL = url;

    requestJSON(badgeURL, function(json) {
        if(json.message == "Not Found" ) {
            console.log("NO USER FOUND!");
        }
        else {
            var badges;
            $.getJSON(badgeURL, function(json){
              badges = json;
              console.log(badges);
              outputPageContent();
            });

        function outputPageContent() {
          if(badges.length == 0) { outputHTML = outputHTML + '<p>No badges!</p></div>'; }
          else {
            $.each(badges, function(index) {

                var isOwned = badges[index].is_owned;
                var badgeName = badges[index].translated_description;
                var badgeDescrip = badges[index].translated_safe_extended_description;
                var badgeURL = badges[index].absolute_url;
                var badgeIcon = badges[index].icons.large;

                console.log(isOwned.toString());
                if (isOwned.toString() == "true") {
                        var pushTest = {'name': badgeName, 'subtext': badgeDescrip};
                        //var pushTest = badgeName + ": " + badgeDescrip;
                        pushToFirebase(pushTest);
                }
            });
          }
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call




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

function requestText(url, callback) {
	$.ajax({
		url : url,
		complete : function(xhr) {
			callback.call(null, xhr.responseJSON);
		}
	});
}