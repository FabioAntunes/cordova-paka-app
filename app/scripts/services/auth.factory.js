'use strict';
angular.module('services')
.factory('AuthFctr', ['ENV', 'DBFctr', 'UtilsFctr', 'ApiFctr', '$q', function (ENV, DBFctr, UtilsFctr, ApiFctr, $q) {
  
  function _logout(){
    UtilsFctr.redirectState('app.home', true);
  }

  function _login(credentials){
    DBFctr.login(credentials).then(function(result){
        UtilsFctr.redirectState('app.dashboard', true);
    }).catch(function(error){
      alert(error.message);
    });
  }
  
  function _register(credentials){
    ApiFctr.register(credentials).then(function(response){
       return DBFctr.addUser(user).then(function(result){
        
        UtilsFctr.redirectState('app.dashboard', true);
      });
    }).catch(function(error){
      alert(data.error.message);
    });
  }

  function _check() {
    return DBFctr.getAppUser();
  }


  return {
    logout: _logout,
    login: _login,
    register: _register,
    check: _check,
    userInfo: function(){
      if(user){
        return user;
      }else{
        return localStorageService.get('token');
      }
    }
  };
}]);