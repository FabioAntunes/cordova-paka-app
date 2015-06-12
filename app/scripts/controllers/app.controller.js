'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state', '$ionicModal','ExpenseFctr', 'DBFctr', function($scope, $state, $ionicModal, ExpenseFctr, DBFctr) {
  $scope.data = DBFctr.getData;
  $scope.expense = {
    category: '1',
    value: 15,
    date: new Date(),
    description: 'Dentista',
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
    
    if($scope.expense.share){
      $scope.me = {
        expenseValue: $scope.expense.value
      }
      $scope.modalShare.show();

    }else{
      ExpenseFctr.insertExpense({
        value: $scope.expense.value,
        description: $scope.expense.description,
        date: $scope.expense.date,
      }, $scope.data.categories[$scope.expense.category]);

      $scope.expense = {
        category: null,
        value: null,
        description: null
      }
    }

  };

  $scope.closeModalShare = function(){
    $scope.modalShare.hide();
    $scope.modal.show(); 
  };
}]);