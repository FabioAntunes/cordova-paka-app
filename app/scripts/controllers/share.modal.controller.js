'use strict';
angular.module('controllers')
.controller('ShareModalCtrl', ['$scope','FriendsFctr', '$ionicPopover', function($scope, FriendsFctr, $ionicPopover) {
  $scope.shareModal = {
    friends: FriendsFctr.getFriends(),
    shareFriends: [],
    search: '',
    equal: true
    
  };
  $scope.me = {
    expenseValue: $scope.expense.value
  }

  $ionicPopover.fromTemplateUrl('templates/popover-search-friend.html', {
    scope: $scope
  }).then(function(popover) {
     $scope.popover = popover;
  });

  $scope.addFriend = function(friendId){
    var friend;
    for (var i = 0; i < $scope.shareModal.friends.length; i++) {
      if($scope.shareModal.friends[i].id === friendId){
        friend = $scope.shareModal.friends[i];
      }
    };
    friend.expenseValue = 0;
    $scope.shareModal.shareFriends.push(friend);
    $scope.popover.hide();
    $scope.recalcTotal();
    $scope.shareModal.search = '';
  };

  $scope.triggerPopover = function($event){
    if($scope.shareModal.search && $scope.shareModal.search.length && !$scope.popover.isShown()){
      $scope.popover.show($event);

    }else if(!$scope.shareModal.search && $scope.popover.isShown()){
      $scope.popover.hide();
    }
  };

  $scope.calcEqual = function(){
    var i = 0;
    var length = $scope.shareModal.shareFriends.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / (length + 1);


    for(i = 0; i < length; i++){
      $scope.shareModal.shareFriends[i].expenseValue = _roundToTwo(equalExpense);
      max = _roundToTwo(max - $scope.shareModal.shareFriends[i].expenseValue);
    }

    $scope.me.expenseValue = _roundToTwo(equalExpense);
    max = _roundToTwo(max - $scope.me.expenseValue);

    $scope.me.expenseValue = _roundToTwo(max + $scope.me.expenseValue);
  }

  $scope.recalcTotal = function(index){
    
    
    if($scope.shareModal.equal){

      $scope.calcEqual();
      
    }else{
      $scope.calcDiff(index);
    }
  };

  $scope.calcDiff = function(index){
    var length = $scope.shareModal.shareFriends.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / (length + 1);
    var delta = 0;
    var i = 0;
    var leftovers = 0;
    var total = $scope.me.expenseValue = parseFloat($scope.me.expenseValue) * 100;
    


    for (i = 0; i < length; i++) {
      $scope.shareModal.shareFriends[i].expenseValue = parseFloat($scope.shareModal.shareFriends[i].expenseValue) * 100;
      total += $scope.shareModal.shareFriends[i].expenseValue;
    }

    delta = ($scope.expense.value * 100 - total)/length;

    for (i = 0; i < length; i++) {
      
      if(i !== index && index >= 0){
        $scope.shareModal.shareFriends[i].expenseValue = _calcNewValue(delta, $scope.shareModal.shareFriends[index].expenseValue, $scope.shareModal.shareFriends[i].expenseValue);
      }else if(index <0){
        $scope.shareModal.shareFriends[i].expenseValue = _calcNewValue(delta, $scope.me.expenseValue, $scope.shareModal.shareFriends[i].expenseValue);
      }else{
        $scope.shareModal.shareFriends[i].expenseValue = _roundToTwo($scope.shareModal.shareFriends[i].expenseValue / 100);
      }
      
      max = _roundToTwo(max - $scope.shareModal.shareFriends[i].expenseValue);
    }

    if(index < 0){
      $scope.me.expenseValue = _roundToTwo($scope.me.expenseValue / 100);
      max = _roundToTwo(max - $scope.me.expenseValue);
      for (i = 0; i < length; i++) {
        leftovers = _roundToTwo($scope.shareModal.shareFriends[i].expenseValue + max);
        if(leftovers >= 0 && leftovers <= $scope.expense.value){
          $scope.shareModal.shareFriends[i].expenseValue = leftovers;
          break;
        }
      }
    }else{
      $scope.me.expenseValue = _calcNewValue(delta, $scope.shareModal.shareFriends[index].expenseValue, $scope.me.expenseValue);
      max = _roundToTwo(max - $scope.me.expenseValue);
      leftovers = _roundToTwo(max + $scope.me.expenseValue);
      if(leftovers >= 0 && leftovers <= $scope.expense.value){
        $scope.me.expenseValue = leftovers;
      }else{
        for (i = 0; i < length; i++) {
          leftovers = _roundToTwo($scope.shareModal.shareFriends[i].expenseValue + max);
          if(leftovers >= 0 && leftovers <= $scope.expense.value && i !== index){
            $scope.shareModal.shareFriends[i].expenseValue = leftovers;
            break;
          }
        }
      }
    }
  }

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