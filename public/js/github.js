/*
 * The LoginGitHub object provides functions to login a user, log them out, and  * read their repo info.
 * @param   {string}    baseURL     The Firebase URL
 * @param   {boolean}   newContext  When a new Firebase context is u                        used.
 * @return  {boolean}   sucess
 */
function LoginGitHub(baseURL, githubUserID, newContext){
    var self = this;
    this._userID = githubUserID;
    this._name = null;
    this._firebase = null;

    if(!baseURL || typeof baseURL != "string") {
        var error = "Invalid baseURL provided";
        console.log(error);
        throw new Error(error);
    }
    
    this._firebase = new Firebase(
        baseURL, newContext || false ? new Firebase.Context() : null
    );
    this._firebaseAuthClient = new FirebaseSimpleLogin(this._firebase, function(error, gitHubUser) {
        self._onLoginStateChange(error, gitHubUser);
    });

    this.login = function(provider) {
        this._firebaseAuthClient.login(provider, {
        rememberMe: false,
        scope: 'user,public_repo'   
        });
    };

    this.logout = function(provider) {
        this._firebaseAuthClient.logout();
        console.log("github account logged out");
    }
}
LoginGitHub.prototype = {
    _onLoginStateChange: function(error, githubUser) {
        var self = this;
        if (error) {
            console.log(error);
        } else if (githubUser && githubUser.id != this._userID) {
        //   alert("Hello " + user.login +"!");
            self.getJSON(githubUser, this._userID);
            console.log('GitHub user ID: ' + githubUser.id);
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
LoginGitHub.prototype.getJSON = function(user, userID){
    var username = user.login;
    var requri   = 'https://api.github.com/users/'+username;
    var repouri  = 'https://api.github.com/users/'+username+'/repos';
    requestJSON(requri, function(json) {
        if(json.message == "Not Found" || username == '') {
            console.log("NO USER FOUND!");
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
            var languageMap = {};
            var bestLanguage;
            var maxReposForLanguage = 0;

            if(fullname == undefined) { fullname = username; }
          
            var repositories;
            $.getJSON(repouri, function(json){
              repositories = json;   
              console.log(repositories);
              outputPageContent(userID);                
            });          
            
        function outputPageContent(userID) {
          if(repositories.length == 0) { var outputHTML='<p>No repos!</p></div>'; }
          else {
            $.each(repositories, function(index) {
                stargazerNum = stargazerNum + repositories[index].stargazers_count;
                if(languageMap[repositories[index].language]) {
                    languageMap[repositories[index].language]++;
                } else {
                    languageMap[repositories[index].language] = 1;
                }
            });

            for(var key in languageMap) {
                if(languageMap[key] > maxReposForLanguage) {
                    maxReposForLanguage = languageMap[key];
                    bestLanguage = key;
                }
            }

            var date = new Date();
            var max_days = 0;
            $.each(repositories, function(index) {
                var days = 0;
                var months = 0;
                var days_in_month = 0;
                days += (date.getFullYear()-parseInt((repositories[index].created_at).substring(0,4)))*365;
                months = (date.getMonth()+1-parseInt((repositories[index].created_at).substring(5,7)));
                if(months < 0) {
                    months += 12;
                    days -= 365;
                }
                days += months*30;
                days_in_month = (date.getDate()-parseInt((repositories[index].created_at).substring(8,10)));
                if(days_in_month < 0) {
                    days_in_month += 30;
                    days-=30;
                }
                days += days_in_month;
                if(days > max_days) {
                    max_days = days;
                }
            });

            var experienceLevel;
            if(max_days < 30) {
                experienceLevel = "Novice";
            } else if(max_days >= 30 && max_days < 180) {
                experienceLevel = "Intermediate";
            } else if(max_days >= 180 && max_days < 365) {
                experienceLevel = "Intermediate Plus";
            } else if(max_days >= 365 && max_days < 730) {
                experienceLevel = "Advanced";
            } else if(max_days >= 730) {
                experienceLevel = "Expert";
            }

            if(username == "eggert") {
                experienceLevel = "Eggert";
            }
            var popularitySubText;

            if (json.followers == 1) {
                popularitySubText = json.name + " has " + json.followers + " follower."
            }
            else {
                popularitySubText = json.name + " has " + json.followers + " followers.";
            }
            var popularityAchievements = {'name': 'GitHub Popularity', 'subtext': popularitySubText, 'image': "", 'priority': 0, 'source': 'github'};
            pushToFirebase(popularityAchievements, userID, 1);

            var starSubText = json.name + " star-gazes " + stargazerNum + " repositories.";
            var starAchievements = {'name': 'Starry Developer', 'subtext': starSubText, 'image': "", 'priority': 0, 'source': 'github'};
            pushToFirebase(starAchievements, userID, 2);

            var bestLangSubText = json.name + "'s best language is " + bestLanguage +".";
            var languageAchievements = {'name': 'Best Language', 'subtext': bestLangSubText, 'image': "", 'priority': 0, 'source': 'github'};
            pushToFirebase(languageAchievements, userID, 3);

            var daysProgrammedSubText = json.name + " has programmed for at least " + max_days + " days.";
            var daysAchievements = {'name': 'Experience Level: '+experienceLevel, 'subtext': daysProgrammedSubText, 'image': "", 'priority': 0, 'source': 'github'};
            pushToFirebase(daysAchievements, userID, 4);
          }
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call
}
function pushToFirebase(json, userID, achievementID) {
    var messageListRef = new Firebase('https://endorser.firebaseio.com/users/' + userID + '/achievements/github/' + achievementID);
    messageListRef.update(json);
    var x = json.toString();
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
