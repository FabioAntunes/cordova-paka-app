'use strict';
angular.module('controllers', ['LocalStorageModule'])
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'yOLO', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
});