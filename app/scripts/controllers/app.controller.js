'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state',function($scope, $state) {
  
  $scope.menuIsEnabled = function() {
  	console.log($state.current.name);
    return $state.current.name !== 'app.login';
  };
}]);