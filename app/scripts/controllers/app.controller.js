'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state',function($scope, $state) {
  
  $scope.menuIsEnabled = function() {
    return $state.current.name !== 'app.login';
  };
}]);