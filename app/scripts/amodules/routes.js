'use strict';
angular.module('routes', [])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.wizard', {
    url: '/wizard',
    views: {
      'menuContent': {
        templateUrl: 'templates/wizard.html'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'LoginCtrl'
      }
    }
  })
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })
    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'LoginCtrl'
        }
      }
    })
  .state('app.categories', {
    url: '/categories/:idCategory',
    views: {
      'menuContent': {
        templateUrl: 'templates/category.html',
        controller: 'CategoryCtrl'
      }
    }
  })
  .state('app.categories.expenses', {
    url: '/expenses/:idExpense',
    views: {
      'menuContent': {
        templateUrl: 'templates/expenses.html',
        controller: 'ExpenseCtrl'
      }
    }
  })
  .state('app.categorieslist', {
    url: '/categorieslist',
    views: {
      'menuContent': {
        templateUrl: 'templates/categories.html',
        controller: 'CategoryCtrl'
      }
    }
  })
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

  $httpProvider.interceptors.push(['$q', 'DBFctr', '$injector', function ($q, DBFctr, $injector) {
    function getToken(config){
      return  DBFctr.getAppUser().then(function(user){
        if (user) {
          config.headers.Authorization = 'Bearer ' + user.token;
        }
        return config
      }).catch(function(){
        return config;
      });
    }
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        return getToken(config);
      },
      'responseError': function (response) {
        // if(response.status === 401){
        //   var AuthFctr = $injector.get('AuthFctr');
        //   return AuthFctr.renewToken().then(function(){
        //     var $http = $injector.get('$http');
        //     return $http(getToken(response.config));
        //   }).catch(function(){
        //     return $q.reject(response);
        //   });
        // }
        if (response.status === 403 || response.status === 400) {
            DBFctr.logoutAppUser();
            $injector.get('UtilsFctr').redirectState('app.home', true);
            // return;
            console.log(response);
        }
        return $q.reject(response);
      }
    };
  }]);
});