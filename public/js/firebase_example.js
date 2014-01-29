var test;
var firebaseApp = angular.module('firebaseApp', ["firebase"]);
firebaseApp.controller('FireBaseCtrl', firebaseController);

function firebaseController($scope, $firebase) {
  var testList = new Firebase("https://endorser.firebaseio.com/testlist") ;

  $scope.testList = $firebase(testList);
  console.log($scope.testList);
  test = $scope.testList;

  $scope.addToFire = function() {
    $scope.testList.$set($scope.addInput);
    $scope.addInput = '';
  };

  $scope.orderByProp = 'value';



}
