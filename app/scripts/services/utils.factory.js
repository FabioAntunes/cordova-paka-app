'use strict';
angular.module('services')
.factory('UtilsFctr', ['$state', '$ionicHistory', function ($state, $ionicHistory) {

  function _redirectState(state, disableBack) {
    $ionicHistory.nextViewOptions({
        disableBack: disableBack
      });
      $state.go(state);
  }

  return {
    redirectState: _redirectState
  };
}]);