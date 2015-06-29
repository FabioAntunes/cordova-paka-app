'use strict';
angular.module('services')
.factory('Categories', ['ENV', '$resource', function (ENV, $resource) {

  return $resource(ENV.api+'/categories/:id', {id:'@id'},
    {
      'update': { method:'PUT' }
    }
  );
}]);