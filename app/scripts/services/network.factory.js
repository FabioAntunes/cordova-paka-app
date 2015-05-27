'use strict';
angular.module('services')
.factory('NetworkFctr', [ '$ionicPlatform', '$cordovaNetwork', function ($ionicPlatform, $cordovaNetwork) {

  function _isOnline() {
    return $ionicPlatform.ready(function() {
      return $cordovaNetwork.isOnline();
    });
  }

  return {
    isOnline: _isOnline
  };
}]);