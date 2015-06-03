'use strict';
angular.module('directives')
.directive('repeatLast', ['$timeout', function($timeout) {
  return function(scope) {
    if (scope.$last){
      // iteration is complete, do whatever post-processing
      // is necessary
      $timeout(function(){
      	scope.hasFinished = true;
      }, 1000);
    }else{
      scope.hasFinished = false;
    }
  };
}]);