'use strict';
angular.module('controllers')
.controller('ShareModalCtrl', ['$scope','FriendsFctr', '$ionicPopover', function($scope, FriendsFctr, $ionicPopover) {
  $scope.shareModal = {
    friends: FriendsFctr.getFriends(),
    shareFriends: [],
    search: ''
    
  };
  $scope.me = {
    expenseValue: $scope.expense.value
  }
  $scope.equal = true;

  $ionicPopover.fromTemplateUrl('templates/popover-search-friend.html', {
    scope: $scope
  }).then(function(popover) {
     $scope.popover = popover;
  });

  $scope.addFriend = function(index){
    var friend = $scope.shareModal.friends.splice(index, 1)[0];
    friend.expenseValue = 0;
    $scope.shareModal.shareFriends.push(friend);
    $scope.recalcTotal();
    $scope.popover.hide();
    $scope.shareModal.search = '';
  };

  $scope.triggerPopover = function($event){
    if($scope.shareModal.search && $scope.shareModal.search.length && !$scope.popover.isShown()){
      $scope.popover.show($event);

    }else if(!$scope.shareModal.search && $scope.popover.isShown()){
      $scope.popover.hide();
    }
  };

  $scope.recalcTotal = function(){
    var i = 0;
    var length = $scope.shareModal.shareFriends.length;
    
    if($scope.equal){

      var equalExpense = $scope.expense.value / (length + 1);

      for(i = 0; i < length; i++){
        $scope.shareModal.shareFriends[i].expenseValue = equalExpense;
      }
      $scope.me.expenseValue = equalExpense;
      
    }
  };

}]);