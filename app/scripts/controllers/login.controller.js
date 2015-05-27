'use strict';
angular.module('controllers')
.controller('LoginCtrl', ['$scope', 'AuthFctr', '$ionicPopup', function($scope, AuthFctr, $ionicPopup) {
  // Form data for the login modal
  $scope.user = {name: '', email: 'fabioantuness@gmail.com', password: 'paka'};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    AuthFctr.login({
      email: $scope.user.email,
      password: $scope.user.password
    }).error(function(data, status, headers, config){
      $ionicPopup.alert({
        title: 'Oops',
        template: data.error.message
      });
    });
  };
}]);