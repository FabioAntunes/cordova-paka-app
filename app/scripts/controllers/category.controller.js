'use strict';
angular.module('controllers')
.controller('CategoryCtrl', ['$scope', 'DBFctr','$stateParams', function($scope, DBFctr, $stateParams) {
  $scope.category_id = $stateParams.idCategory;

  
}]);