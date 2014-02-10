/*
 * The LoginGitHub object provides functions to login a user, log them out, and  * read their repo info.
 * @param   {string}    baseURL     The Firebase URL
 * @param   {boolean}   newContext  When a new Firebase context is u                        used.
 * @return  {boolean}   sucess
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

    this.login = function(provider){
        this._firebaseAuthClient.login(provider, {
        rememberMe: false,
        scope: 'user,public_repo'   
        });
    };
}
LoginGitHub.prototype = {
    _validateCallback: function(cb, notInit) {
        if (!cb || typeof cb != "function") {
            throw new Error("Invalid onComplete callback provided");
        }
        else {
            //logged out
        }
    },
    _onLoginStateChange: function(error, user) {
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
LoginGitHub.prototype.getJSON = function(user, onResult){
    var username = user.login;
    var requri   = 'https://api.github.com/users/'+username;
    var repouri  = 'https://api.github.com/users/'+username+'/repos';
    $('#ghapidata').html('<div id="loader"></div>');
    requestJSON(requri, function(json) {
        if(json.message == "Not Found" || username == '') {
            $('#ghapidata').html("<h2>No User Info Found</h2>");
        }
        else {
            // else we have a user and we display their info
            var fullname   = json.name;
            var username   = json.login;
            var aviurl     = json.avatar_url;
            var profileURL = json.html_url;
            var location   = json.location;
            var followersNum = json.followers;
            var followingNum = json.following;
            var reposNum     = json.public_repos;
            var stargazerNum = 0;
            var languageMap = new Object();

            if(fullname == undefined) { fullname = username; }
        
            var outputHTML = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileURL+'" target="_blank">'+username+'</a>)</span></h2>';
            outputHTML = outputHTML + '<div class="ghcontent"><div class="avi"><a href="'+profileURL+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
            outputHTML = outputHTML + '<p>Followers: '+followersNum+' - Following: '+followingNum+'<br>Repos: '+reposNum+'</p></div>';
            outputHTML = outputHTML + '<div class="repolist clearfix">';
            
            var repositories;
            $.getJSON(repouri, function(json){
              repositories = json;   
              console.log(repositories);
              outputPageContent();                
            });          
        
        function outputPageContent() {
          if(repositories.length == 0) { outputHTML = outputHTML + '<p>No repos!</p></div>'; }
          else {
            outputHTML = outputHTML + '<p><strong>Repos List:</strong></p> <ul>';

            $.each(repositories, function(index) {
                stargazerNum = stargazerNum + repositories[index].stargazers_count;
                outputHTML = outputHTML + '<li><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a></li>';
            });
            outputHTML = outputHTML + '</ul></div>'; 
            outputHTML = outputHTML + '<p>Stargazeers you have:</p>';
            outputHTML = outputHTML + '' + stargazerNum;

            var popularitySubText = json.name + " has " + json.followers + " followers.";
            var popularityAchievements = {'name': 'GitHub Popularity', 'subtext': popularitySubText, 'image': "", 'priority': 0, 'source': 'github'};
            pushToFirebase(popularityAchievements);

            var starSubText = json.name + " star-gazes " + stargazerNum + " repositories.";
            var starAchievements = {'name': 'Starry Developer', 'subtext': starSubText, 'image': "", 'priority': 0, 'source': 'github'};
            pushToFirebase(starAchievements);

          }
          $('#ghapidata').html(outputHTML);
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
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }