'use strict';
angular.module('services')
.factory('ApiFctr', ['ENV', '$http', 'NetworkFctr', function (ENV, $http, NetworkFctr) {
  
  function _insertExpense(expense) {
    return $http.post(ENV.api + '/expenses', expense);
  }

  function _getCategories() {
    return $http.get(ENV.api + '/categories/expenses');
  }
  
  function _login(credentials) {
    return $http.post(ENV.api + '/auth/login', credentials);
  }

  function _logout(){
    localStorageService.remove('token');
    UtilsFctr.redirectState('app.home', true);
  }

  function _register(credentials) {
    return $http.post(ENV.api + '/auth/register', credentials);
  }

  function _renewToken(){
    return $http.get(ENV.api + '/auth/refresh');
  }

  return {
    insertExpense: _insertExpense,
    getCategories: _getCategories,
    login: _login,
    register: _register,
    renewToken: _renewToken
  };
}]);