'use strict';
angular.module('controllers')
.controller('LoginCtrl', ['$scope', 'AuthFctr', function($scope, AuthFctr) {
  // Form data for the login modal
  $scope.user = {name: '', email: 'fabioantuness@gmail.com', password: 'paka'};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    AuthFctr.login({
      email: $scope.user.email,
      password: $scope.user.password
    });
  };
}]);