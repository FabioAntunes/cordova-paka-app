'use strict';
angular.module('services')
.factory('CategoriesFctr', ['ENV', '$http', 'DBFctr', function (ENV, $http, DBFctr) {
  var Category = $resource(ENV.api+'/categories/:id', {id:'@id'});
  
  function _getCategories() {
    return Category.query();
  }

  return {
    getCategories: _getCategories
  };
}]);