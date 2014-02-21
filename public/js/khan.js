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
		this._url = uri;

	this.getJSON = url1;
}


/**
 * _getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 **/
function url1(){
	/*
		consumerKey : "pEHDKRqN6MfGZ3xV",
		consumerSecret : "tWVGq25eF8Cyk4yy",
		signature_method : "HMAC-SHA1"
*/
	
	
	var util= require('/oauth/lib/_utils.js')
	console.log("Khan Login started");
    var OAuth= require('/oauth/lib/oauth.js').OAuth;

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