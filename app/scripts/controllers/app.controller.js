'use strict';
angular.module('controllers')
.controller('AppCtrl', ['$scope', '$state', '$ionicModal','ExpenseFctr', 'DBFctr','AuthFctr', function($scope, $state, $ionicModal, ExpenseFctr, DBFctr, AuthFctr) {
  $scope.data = DBFctr.getData;
  $scope.expense = _resetExpense();
  $scope.category = _resetCategory();

  $scope.doRefresh = function() {
    DBFctr.syncDB(true, $scope);
  };

  $scope.logout = function() {
    DBFctr.logoutAppUser().finally(function() {
      AuthFctr.logout();
    });
  };

  $scope.randomColor = randomColor;

  $scope.menuIsEnabled = function() {
    return $state.current.name !== 'app.login';
  };

  $ionicModal.fromTemplateUrl('templates/modal-category.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCat = modal;
  });

  $scope.modalAdd = function(){
    if($state.current.name === 'app.categorieslist'){
      $scope.categoryModal(false);      
    }else{
      $scope.expenseModal(false);
    }
  };

  $scope.categoryModal = function(category){
    $scope.category = _resetCategory();
    $scope.sMod = {
      update: false
    };
    if(category){
      $scope.sMod.title = 'Edit Category';
      $scope.sMod.update = true;
      $scope.category._id = category._id;
      $scope.category._rev = category._rev;
      $scope.category.name = category.name;
      $scope.category.color = category.color;
      $scope.category.user_id = category.color;
        
    }else{
      $scope.sMod.title = 'Add Category';
    }

    $scope.modalCat.show();
  }

  $scope.expenseModal = function(expense){
    $scope.expense = _resetExpense();
    $scope.sMod = {
      autoSearch: [],
      share: false,
      update: false,
      equal: true,
      popup: null
    };
    if(expense){
      $scope.sMod.title = 'Edit Expense';
      $scope.sMod.share = expense.shared.length > 1;
      $scope.sMod.update = true;
      $scope.expense = expense;
      $scope.expense._date = new Date($scope.expense.date[0], $scope.expense.date[1]-1, $scope.expense.date[2]);

      for (var i = 0; i < $scope.expense.shared.length; i++) {
        for (var j = 0; j < $scope.data.friends.length; j++) {
          if($scope.expense.shared[i].friend_id === $scope.data.friends[j]._id){
            $scope.sMod.autoSearch.push($scope.data.friends[j]);
          }
        }
      };

        
    }else{
      $scope.expense._date = new Date();
      $scope.sMod.title = 'Add Expense';
    }

    $ionicModal.fromTemplateUrl('templates/modal-expense.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

  }

  function _resetExpense(){
    return {
      category: {},
      value: null,
      date: new Date(),
      description: null,
      shared: [],
      share: false,
      update: false,
      type: 'expense'
    };
  }

  function randomColor() {
    var hex = Math.floor(Math.random()*16777215).toString(16);
    while(6 - hex.length){
      hex = '0'+hex;
    }
    return '#'+hex;
  }

  function _resetCategory(){
    return {
      name: null,
      color: randomColor(),
      type: 'category'
    };
  }

}]);