'use strict';
angular.module('directives')
.directive('searchChange', function() {
  return function(scope, element) {
    element.bind('keyup', function() {
      if(element[0].value.length && !scope.popover.isShown()){
        scope.popover.show(element);
      }else if(element[0].value.length<1 && scope.popover.isShown()){
        scope.popover.hide();
      }
    });
  };
});