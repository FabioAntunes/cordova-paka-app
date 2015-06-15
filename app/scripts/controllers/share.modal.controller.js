'use strict';
angular.module('controllers')
.controller('ShareModalCtrl', ['$scope','FriendsFctr','AuthFctr', '$ionicPopup', '$ionicListDelegate','filterFilter', 
  function($scope, FriendsFctr, AuthFctr, $ionicPopup, $ionicListDelegate, filterFilter) {
  $scope.sMod = {
    friends: FriendsFctr.getFriends(),
    autoSearch: $scope.expense.update ? $scope.expense.friends : [],
    equal: true,
    popup: null
    
  };

  $scope.filterFriends = function(query){
    return filterFilter($scope.sMod.friends, query);
  }

  $scope.clickedMethod = function (callback) {
    var user = AuthFctr.userInfo().self;
    user.value = 0;
    callback.item.value = 0;
    $scope.expense.friends = [user].concat($scope.sMod.autoSearch);
    $scope.recalcTotal(0);
  }

  $scope.incDec = function($index, isInc){
    var morpheus = isInc ? 1 : -1;
    var sum = _roundToTwo((parseFloat($scope.expense.friends[$index].expenseValue) * 100 + morpheus)/100);
    if(isInc && sum <= $scope.expense.value || !isInc && sum >= 0){
      $scope.expense.friends[$index].expenseValue = sum;
      $scope.calcDiff($index);
    }
  };

  $scope.removedMethod = function (callback) {
    var user = AuthFctr.userInfo().self;
    user.value = 0;
    $scope.expense.friends = [user].concat(callback.selectedItems);
    $scope.recalcTotal(0);
  }

  $scope.edit = function($index){
    $scope.sMod.popup = $scope.expense.friends[$index].expenseValue;
    var popup = $ionicPopup.show({
      template: '<input type="number" min="0" step="0.01"  ng-model="sMod.popup" placeholder="Value">',
      title: 'Edit value',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.sMod.popup || $scope.sMod.popup > $scope.expense.value) {
              e.preventDefault();
            } else {
              return $scope.sMod.popup;
            }
          }
        }
      ]
    });

    popup.then(function(res) {
      $scope.expense.friends[$index].expenseValue = res;
      $scope.calcDiff($index);
      $ionicListDelegate.closeOptionButtons();
    });
  };

  $scope.calcEqual = function(){
    var i = 0;
    var length = $scope.expense.friends.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / length;


    for(i = 0; i < length; i++){
      $scope.expense.friends[i].expenseValue = _roundToTwo(equalExpense);
      max = _roundToTwo(max - $scope.expense.friends[i].expenseValue);
    }

    $scope.expense.friends[0].expenseValue = _roundToTwo(max + $scope.expense.friends[0].expenseValue);
  };

  $scope.recalcTotal = function(index){
    
    
    if($scope.sMod.equal){

      $scope.calcEqual();
      
    }else{
      $scope.calcDiff(index);
    }
  };

  $scope.calcDiff = function(index){
    var length = $scope.expense.friends.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / length;
    var delta = 0;
    var i = 0;
    var leftovers = 0;
    var total = 0;
    


    for (i = 0; i < length; i++) {
      $scope.expense.friends[i].expenseValue = parseFloat($scope.expense.friends[i].expenseValue) * 100;
      total += $scope.expense.friends[i].expenseValue;
    }

    delta = ($scope.expense.value * 100 - total)/length;

    for (i = 0; i < length; i++) {
      
      if(i !== index){
        $scope.expense.friends[i].expenseValue = _calcNewValue(delta, $scope.expense.friends[index].expenseValue, $scope.expense.friends[i].expenseValue);
        max = _roundToTwo(max - $scope.expense.friends[i].expenseValue);
      }
      
    }

    $scope.expense.friends[index].expenseValue = _roundToTwo($scope.expense.friends[index].expenseValue / 100);
    max = _roundToTwo(max - $scope.expense.friends[index].expenseValue);


    for (i = 0; i < length; i++) {
      leftovers = _roundToTwo($scope.expense.friends[i].expenseValue + max);
      if(leftovers >= 0 && leftovers <= $scope.expense.value && i !== index){
        $scope.expense.friends[i].expenseValue = leftovers;
        break;
      }
    }
  };

  function _calcNewValue(delta, value, userExpense){
    
    var newValue =  userExpense + delta;
    
    
    if (newValue < 0 || value === $scope.expense.value * 100){
      return 0;
    }
    else if (newValue > $scope.expense.value * 100){
      return $scope.expense.value * 100;
    }

    return _roundToTwo(newValue / 100);
  }

  function _roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
  }

}]);