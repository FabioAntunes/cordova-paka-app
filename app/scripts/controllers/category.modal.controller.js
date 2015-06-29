'use strict';
angular.module('controllers')
.controller('CategoryModalCtrl', ['$scope','DBFctr', 
  function($scope, DBFctr) {

  $scope.saveCategory = function(){
    if($scope.sMod.update){
      DBFctr.updateDocument($scope.category).then(function(result){
        console.log(result);
        DBFctr.syncDB(true);
        $scope.modalCat.hide();
      });
    }else{
      DBFctr.addDocument($scope.category).then(function(result){
        console.log(result);
        DBFctr.syncDB(true);
        $scope.modalCat.hide();
      });
    }
  };

  $scope.genRandomColor = function(){
    $scope.category.color = $scope.randomColor();
  }

}]);