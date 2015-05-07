'use strict';
angular.module('routes', [])
.config(function($stateProvider, $urlRouterProvider) {
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

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
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

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/expenses');
})
.run(['$state', '$rootScope', function($state, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      
        if (toState.name !== 'app.login' && true) {
          // If logged out and transitioning to a logged in page:
          e.preventDefault();
          $state.go('app.login');
        }
    });
}]);