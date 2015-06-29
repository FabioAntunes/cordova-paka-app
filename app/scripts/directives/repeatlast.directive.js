'use strict';
angular.module('directives')
.directive('repeatLast', ['$timeout', function($timeout) {
  return function(scope) {
    if (scope.$last){
      // iteration is complete, do whatever post-processing
      // is necessary
      $timeout(function(){
      	scope.data.hasFinished = true;
      }, 1000);
    }else{
      scope.data.hasFinished = false;
    }
  };
}]);