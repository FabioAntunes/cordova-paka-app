'use strict';
angular.module('controllers')
.controller('DashboardCtrl', ['$scope', 'DBFctr', function($scope, DBFctr) {
  $scope.data = DBFctr.getData;
  
}]);