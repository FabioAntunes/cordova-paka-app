'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state', '$ionicModal','ExpenseFctr', 'CategoriesFctr', function($scope, $state, $ionicModal, ExpenseFctr, CategoriesFctr) {
  $scope.data = CategoriesFctr.getData;
  $scope.expense = {
    category: '',
    value: '',
    description: '',
  }

  $scope.menuIsEnabled = function() {
    return $state.current.name !== 'app.login';
  };

  $ionicModal.fromTemplateUrl('templates/modal-add-expense.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addExpense = function(){
    ExpenseFctr.insertExpense({
      value: $scope.expense.value,
      description: $scope.expense.description,
      date: Date.now
    }, $scope.data.categories[$scope.expense.category]);
    ExpenseFctr.loadData();
    $scope.modal.hide();
    $scope.expense = {
      category: '',
      value: '',
      description: '',
    }
  }
}]);