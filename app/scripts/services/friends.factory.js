'use strict';
angular.module('services')
.factory('FriendsFctr', ['ENV', '$http', 'DBFctr', '$resource', function (ENV, $http, DBFctr, $resource) {
  var Friend = $resource(ENV.api+'/friends/:id', {id:'@id'});

  function _getFriends() {
    return Friend.query();
  }

  return {
    getFriends: _getFriends
  };
}]);