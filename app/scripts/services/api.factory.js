'use strict';
angular.module('services')
.factory('ApiFctr', ['ENV', '$http', function (ENV, $http) {
  var categories
  function _getCategories() {
    return $http.get(ENV.api + '/categories/expenses');
  }

  return {
    getCategories: _getCategories
  };
}]);