'use strict';
angular.module('starter', ['ionic', 'controllers', 'services', 'routes', 'config', 'ngCordova','ngResource','directives', 'ion-autocomplete'])

.run(function($ionicPlatform, DBFctr) {
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

    DBFctr.initDB();
  });
});
