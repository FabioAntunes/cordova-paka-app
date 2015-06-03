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
  .state('app.expenses', {
    url: '/expenses',
    views: {
      'menuContent': {
        templateUrl: 'templates/expenses.html',
        controller: 'PlaylistsCtrl'
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
  .state('app.categorieslist', {
    url: '/categories/list',
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
  $urlRouterProvider.otherwise('/app/dashboard');

  $httpProvider.interceptors.push(['$q', 'localStorageService', '$injector', function ($q, localStorageService, $injector) {
    function getToken(config){
      if (localStorageService.get('token')) {
        config.headers.Authorization = 'Bearer ' + localStorageService.get('token');
      }

      return config;
    }
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        return getToken(config);
      },
      'responseError': function (response) {
        if(response.status === 401){
          var AuthFctr = $injector.get('AuthFctr');
          return AuthFctr.renewToken().then(function(){
            var $http = $injector.get('$http');
            return $http(getToken(response.config));
          }).catch(function(){
            return $q.reject(response);
          });
        }
        if (response.status === 403 || response.status === 400) {
            localStorageService.remove('token');
            $injector.get('UtilsFctr').redirectState('app.home', true);
            // return;
            console.log(response);
        }
        return $q.reject(response);
      }
    };
  }]);
})
.run(['$state', '$rootScope', 'AuthFctr',function($state, $rootScope, AuthFctr) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      
        if (!AuthFctr.check() && !~toState.name.indexOf('app.home') && !~toState.name.indexOf('app.login') && !~toState.name.indexOf('app.register')) {
          // If logged out and transitioning to a logged in page:
          e.preventDefault();
          $state.go('app.home');
        }
    });
}]);