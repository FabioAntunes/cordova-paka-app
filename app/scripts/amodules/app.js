'use strict';
angular.module('starter', ['ionic', 'controllers', 'services', 'routes', 'config', 'ngCordova','ngResource','directives', 'ion-autocomplete'])
.run(['$state', '$rootScope', 'DBFctr', '$ionicPlatform', 'AuthFctr', function($state, $rootScope, DBFctr, $ionicPlatform, AuthFctr) {
  DBFctr.initDB();
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      
    AuthFctr.check().then(function(user){
      if (!user && !~toState.name.indexOf('app.home') && !~toState.name.indexOf('app.login') && !~toState.name.indexOf('app.register')) {
        // If logged out and transitioning to a logged in page:
        e.preventDefault();
        $state.go('app.home');
      }else if(user && (~toState.name.indexOf('app.home') || ~toState.name.indexOf('app.login') || ~toState.name.indexOf('app.register'))){
        e.preventDefault();
        $state.go('app.dashboard');
      }

    }).catch(function(){
      if (!~toState.name.indexOf('app.home') && !~toState.name.indexOf('app.login') && !~toState.name.indexOf('app.register')) {
        // If logged out and transitioning to a logged in page:
        e.preventDefault();
        $state.go('app.home');
      }
    });

  });
}]);
