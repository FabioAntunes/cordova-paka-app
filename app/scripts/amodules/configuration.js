'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',api:'http://192.168.1.65:8000/api/v2',apiDB:'http://192.168.1.65:8000/api/sync',db:'http://192.168.1.65:5984'})

;