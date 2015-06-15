'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state', '$ionicModal','ExpenseFctr', 'DBFctr', function($scope, $state, $ionicModal, ExpenseFctr, DBFctr) {
  $scope.data = DBFctr.getData;
  $scope.expense = _resetExpense();
  

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
    
    if($scope.expense.share){

      $scope.modalShare.show();

    }else{
      ExpenseFctr.insertExpense($scope.expense);

      $scope.expense = _resetExpense();
    }

  };

  $scope.editExpense = function(expense){
    $scope.modal.show();
    $scope.expense = expense;
    $scope.expense.share = expense.friends.length > 1;
    $scope.expense.update = true;
    
    if($scope.expense.share){

      $scope.modalShare.show();

    }else{
      ExpenseFctr.insertExpense($scope.expense);

      $scope.expense = _resetExpense();
    }

  };

  $scope.closeModalShare = function(){
    $scope.modalShare.hide();
    $scope.modal.show(); 
  };

  function _resetExpense(){
    return {
      category: {},
      value: null,
      date: new Date(),
      description: null,
      friends: [],
      share: false,
      update: false
    };
  }
}]);