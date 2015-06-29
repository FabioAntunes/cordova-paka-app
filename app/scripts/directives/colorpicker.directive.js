'use strict';
angular.module('directives')
.directive('colorPicker2', function() {

  return {
    link: function(scope, elm, attrs) {

      function openColorPicker(){
        document.querySelector('#color-picker').focus();
        document.querySelector('#color-picker').touch();
      }
      elm.on('touch', function() {
        openColorPicker();
      });

      elm.on('focus', function() {
        openColorPicker();
      });
    }
  };
});