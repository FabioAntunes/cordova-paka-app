'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',api:'http://fabioantunes.me:8000/api/v2',apiDB:'http://fabioantunes.me:8000/api/sync',db:'http://fabioantunes.me:5984'})

;