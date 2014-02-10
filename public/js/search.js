var firebaseApp = angular.module('search-module', ['firebase']);
firebaseApp.controller('searchCTRL', searchCTRL);

function searchCTRL($scope, $firebase) {
  var achievementList = new Firebase("https://endorser.firebaseio.com/achievements") ;

  $scope.query = "";
  $scope.achievements = $firebase(achievementList);
  console.log($scope.achievements);

  var test = $scope.achievements.$getIndex();
  console.log(test);

  $scope.orderProp = 'name';
}
