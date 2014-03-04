var firebaseApp = angular.module('search-module', ['firebase']);
var userID = getParameterByName('userID');
firebaseApp.controller('searchCTRL', searchCTRL);

function searchCTRL($scope, $firebase) {
  var achievementList = new Firebase("https://endorser.firebaseio.com/users/" + userID + "/achievements/") ;
  $scope.achievements = $firebase(achievementList);
  console.log("$scope: "+$scope.achievements);

  var test = $scope.achievements.$getIndex();
  console.log("$scope index: " + test);

  $scope.orderProp = 'name';
}
