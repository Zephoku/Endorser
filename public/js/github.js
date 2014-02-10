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
            alert("Hello " + user.login +"!");
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
            var profileurl = json.html_url;
            var location   = json.location;
            var followersnum = json.followers;
            var followingnum = json.following;
            var reposnum     = json.public_repos;
        
            if(fullname == undefined) { fullname = username; }
        
            var outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
            outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
            outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
            outhtml = outhtml + '<div class="repolist clearfix">';
            
            var repositories;
            $.getJSON(repouri, function(json){
              repositories = json;   
              outputPageContent();                
            });          
        
        function outputPageContent() {
          if(repositories.length == 0) { outhtml = outhtml + '<p>No repos!</p></div>'; }
          else {
            outhtml = outhtml + '<p><strong>Repos List:</strong></p> <ul>';
            $.each(repositories, function(index) {
              outhtml = outhtml + '<li><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a></li>';
            });
            outhtml = outhtml + '</ul></div>'; 
          }
          $('#ghapidata').html(outhtml);
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call
}

function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }