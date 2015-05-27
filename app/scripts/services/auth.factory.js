'use strict';
angular.module('services')
.factory('AuthFctr', ['ENV', '$http', '$state', 'localStorageService', '$ionicHistory', function (ENV, $http, $state, localStorageService, $ionicHistory) {

  function _login(credentials) {
    return $http.post(ENV.api + '/auth/login', credentials).success(function(response){
      localStorageService.set('token', response);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    }).error(function(data, status, headers, config){
      return data;
    });
  }

  function _logout(){
    localStorageService.remove('token');
    $location.path('/');
  }

  function _register(credentials) {
    $http.post(ENV.api + '/auth/register', credentials).success(function(response){
      localStorageService.set('token', response);
      $location.path('/dashboard');
    }).error(function(data, status, headers, config){
      console.log(data);
      console.log(status);
      console.log(headers);
      console.log(config);
    });
  }

  function _check() {
    return localStorageService.get('token') ? true : false;
  }

  return {
    login: _login,
    logout: _logout,
    register: _register,
    check: _check
  };
}]);