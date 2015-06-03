'use strict';
angular.module('services')
.factory('AuthFctr', ['ENV', 'localStorageService', 'UtilsFctr', 'ApiFctr', function (ENV, localStorageService, UtilsFctr, ApiFctr) {

  function _logout(){
    localStorageService.remove('token');
    UtilsFctr.redirectState('app.home', true);
  }

  function _login(credentials){
    ApiFctr.login(credentials).then(function(response){
      localStorageService.set('token', response.data);
      UtilsFctr.redirectState('app.dashboard', true);
    }).catch(function(error){
      $ionicPopup.alert({
        title: 'Oops',
        template: data.error.message
      });
    });
  }
  
  function _register(credentials){
    ApiFctr.register(credentials).then(function(response){
      localStorageService.set('token', response.data);
      UtilsFctr.redirectState('app.dashboard', true);
    }).catch(function(error){
      console.log(error);
    });
  }

  function _renewToken(){
    return ApiFctr.renewToken().then(function(response){
      localStorageService.set('token', response.data);
      // UtilsFctr.redirectState('app.dashboard', true);
    }).catch(function(error){
      console.log(error);
      //_logout();
    });
  }

  function _check() {
    return localStorageService.get('token') ? true : false;
  }


  return {
    logout: _logout,
    login: _login,
    register: _register,
    check: _check,
    renewToken: _renewToken
  };
}]);