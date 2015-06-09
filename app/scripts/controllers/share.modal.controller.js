'use strict';
angular.module('controllers')
.controller('ShareModalCtrl', ['$scope','FriendsFctr', '$ionicPopover', function($scope, FriendsFctr, $ionicPopover) {
  $scope.shareModal = {
    friends: FriendsFctr.getFriends(),
    shareFriends: [],
    search: ''
    
  };
  
  $ionicPopover.fromTemplateUrl('templates/popover-search-friend.html', {
    scope: $scope
  }).then(function(popover) {
     $scope.popover = popover;
  });

  $scope.addFriend = function(index){
    $scope.shareModal.shareFriends.push($scope.shareModal.friends.splice(index, 1)[0]);
    $scope.popover.hide();
  };
  $scope.triggerPopover = function($event){
    if($scope.shareModal.search.search.length && !$scope.popover.isShown()){
      $scope.popover.show($event);

    }else if($scope.shareModal.search.search.length<1 && $scope.popover.isShown()){
      $scope.popover.hide();
    }
  }

}]);