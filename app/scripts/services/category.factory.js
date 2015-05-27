'use strict';
angular.module('services')
.factory('CategoryFctr', ['ENV', '$http', function (ENV, $http) {
  var categories
  function _getCategories() {
    return $http.get(ENV.api + '/categories/expenses');
  }

  return {
    getCategories: _getCategories
  };
}]);