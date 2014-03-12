

function GetBadges(emailParam, uid){
    //var badges;
    //var groups = [];
    //var all_badges = [];
    uid = uid.replace(/ +?/g, '');      //hacky to remove space from uid
    var urlArray = window.location.href.split( '/' );
    var url = urlArray[0] + '//' + urlArray[2];
    var email_url = url + '/displayer?email=' + emailParam;
    requestJSON(email_url, function(json) {
        if(json.message == "Not Found") {
            console.log("NO USER FOUND!");
        } else {
            var userID = json.userId;
            var groups_url = 'http://beta.openbadges.org/displayer/' + userID + '/groups.json';
            requestJSON(groups_url, function(json) {
                if(json.message == "Not Found") {
                    console.log("NO USER FOUND!");
                } else {
                    var groups = [];
                    var all_badges = [];
                    for(var i = 0; i < json.groups.length; i++) {
                        groups.push(json.groups[i].groupId);
                    }
                    for(var i = 0; i < groups.length; i++) {
                        var badges_url = 'http://beta.openbadges.org/displayer/' + userID + '/group/' + groups[i] + '.json';
                        requestJSON(badges_url, function(json) {
                            if(json.message == "Not Found") {
                                console.log("NO USER FOUND");
                            } else {
                                var badges = json.badges;
                                var achID = 1;  //badge ID starts at one because these are openbadges, not github badges, stored in separate area
                                for(var j = 0; j < badges.length; j++) {
                                    all_badges.push(badges[j]);
                                    var newBadge = {'name': json.badges[j].assertion.badge.name, 'subtext': json.badges[j].assertion.badge.description, 'image': "", 'priority': 0, 'source': 'OpenBadges'};
                                    pushToFirebaseOB(newBadge,uid,achID);
                                    achID++;
                                }
                            }
                        });
                    }
                }

            });
        }
    });

}

function pushToFirebaseOB(json, userID, achievementID) {
    var messageListRef = new Firebase('https://endorser.firebaseio.com/users/' + userID + '/achievements/openbadges/' + achievementID);
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
