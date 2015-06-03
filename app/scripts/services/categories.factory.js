'use strict';
angular.module('services')
.factory('CategoriesFctr', ['ENV', '$http', 'DBFctr', function (ENV, $http, DBFctr) {
  
  function _getCategories() {
    return $http.get(ENV.api + '/categories/expenses');
  }

  return {
    getCategories: _getCategories,
    getData: DBFctr.getData
  };
}]);