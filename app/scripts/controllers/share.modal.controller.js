'use strict';
angular.module('controllers')
.controller('ShareModalCtrl', ['$scope','FriendsFctr', '$ionicPopover', '$ionicPopup', '$ionicListDelegate', function($scope, FriendsFctr, $ionicPopover, $ionicPopup, $ionicListDelegate) {
  $scope.sMod = {
    friends: FriendsFctr.getFriends(),
    sFriends: [{
      id: 0,
      name: 'Me',
      expenseValue: $scope.expense.value
    }],
    search: '',
    equal: true,
    popup: null
    
  };

  $ionicPopover.fromTemplateUrl('templates/popover-search-friend.html', {
    scope: $scope
  }).then(function(popover) {
     $scope.popover = popover;
  });

  $scope.addFriend = function(friendId){
    var friend;
    for (var i = 0; i < $scope.sMod.friends.length; i++) {
      if($scope.sMod.friends[i].id === friendId){
        friend = $scope.sMod.friends[i];
      }
    };
    friend.expenseValue = 0;
    $scope.sMod.sFriends.push(friend);
    $scope.popover.hide();
    $scope.recalcTotal();
    $scope.sMod.search = '';
  };

  $scope.incDec = function($index, isInc){
    var morpheus = isInc ? 1 : -1;
    var sum = _roundToTwo((parseFloat($scope.sMod.sFriends[$index].expenseValue) * 100 + morpheus)/100);
    if(isInc && sum <= $scope.expense.value || !isInc && sum >= 0){
      $scope.sMod.sFriends[$index].expenseValue = sum;
      $scope.calcDiff($index);
    }
  };

  $scope.removeFriend = function($index){
    $scope.sMod.sFriends.splice($index, 1);
    $scope.recalcTotal(0);
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.edit = function($index){
    $scope.sMod.popup = $scope.sMod.sFriends[$index].expenseValue;
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
      $scope.sMod.sFriends[$index].expenseValue = res;
      $scope.calcDiff($index);
      $ionicListDelegate.closeOptionButtons();
    });
  };

  $scope.triggerPopover = function($event){
    if($scope.sMod.search && $scope.sMod.search.length && !$scope.popover.isShown()){
      $scope.popover.show($event);

    }else if(!$scope.sMod.search && $scope.popover.isShown()){
      $scope.popover.hide();
    }
  };

  $scope.calcEqual = function(){
    var i = 0;
    var length = $scope.sMod.sFriends.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / length;


    for(i = 0; i < length; i++){
      $scope.sMod.sFriends[i].expenseValue = _roundToTwo(equalExpense);
      max = _roundToTwo(max - $scope.sMod.sFriends[i].expenseValue);
    }

    $scope.sMod.sFriends[0].expenseValue = _roundToTwo(max + $scope.sMod.sFriends[0].expenseValue);
  }

  $scope.recalcTotal = function(index){
    
    
    if($scope.sMod.equal){

      $scope.calcEqual();
      
    }else{
      $scope.calcDiff(index);
    }
  };

  $scope.calcDiff = function(index){
    var length = $scope.sMod.sFriends.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / length;
    var delta = 0;
    var i = 0;
    var leftovers = 0;
    var total = 0;
    


    for (i = 0; i < length; i++) {
      $scope.sMod.sFriends[i].expenseValue = parseFloat($scope.sMod.sFriends[i].expenseValue) * 100;
      total += $scope.sMod.sFriends[i].expenseValue;
    }

    delta = ($scope.expense.value * 100 - total)/length;

    for (i = 0; i < length; i++) {
      
      if(i !== index){
        $scope.sMod.sFriends[i].expenseValue = _calcNewValue(delta, $scope.sMod.sFriends[index].expenseValue, $scope.sMod.sFriends[i].expenseValue);
        max = _roundToTwo(max - $scope.sMod.sFriends[i].expenseValue);
      }
      
    }

    $scope.sMod.sFriends[index].expenseValue = _roundToTwo($scope.sMod.sFriends[index].expenseValue / 100);
    max = _roundToTwo(max - $scope.sMod.sFriends[index].expenseValue);


    for (i = 0; i < length; i++) {
      leftovers = _roundToTwo($scope.sMod.sFriends[i].expenseValue + max);
      if(leftovers >= 0 && leftovers <= $scope.expense.value && i !== index){
        $scope.sMod.sFriends[i].expenseValue = leftovers;
        break;
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