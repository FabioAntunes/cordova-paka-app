'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state', '$ionicModal','ExpenseFctr', 'DBFctr', function($scope, $state, $ionicModal, ExpenseFctr, DBFctr) {
  $scope.data = DBFctr.getData;
  $scope.expense = {
    category: "2",
    value: 20,
    date: null,
    description: Math.random(),
    share: true
  };
  

  $scope.doRefresh = function() {
    DBFctr.loadData().finally(function() {
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  $scope.menuIsEnabled = function() {
    return $state.current.name !== 'app.login';
  };

  $ionicModal.fromTemplateUrl('templates/modal-add-expense.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modal-share-expense.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modalShare) {
    $scope.modalShare = modalShare;
  });

  $scope.addExpense = function(){
    $scope.modal.hide();
    console.log($scope.date);
    
    ExpenseFctr.insertExpense({
      value: $scope.expense.value,
      description: $scope.expense.description,
      date: Date.now
    }, $scope.data.categories[$scope.expense.category]);
    
    if($scope.expense.share){

      $scope.modalShare.show();

    }
    // $scope.expense = {
    //   category: '',
    //   value: '',
    //   description: ''
    // }
  }
}]);