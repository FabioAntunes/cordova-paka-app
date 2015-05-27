'use strict';
angular.module('controllers')
.controller('CategoryCtrl', ['$scope', 'DBFctr','$stateParams', function($scope, DBFctr, $stateParams) {
  $scope.category = DBFctr.getCategory($stateParams.idCategory);
}]);