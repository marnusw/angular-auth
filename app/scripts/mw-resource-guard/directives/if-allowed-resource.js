/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.resourceGuard')

/**
 * @ngdoc directive
 * @name mwIfAllowedResource
 *
 * @description
 * Hides the element if access to the resource it contains is not authorized for the current user.
 */
.directive('mwIfAllowedResource', ['ResourceGuard', '$animate', function(ResourceGuard, $animate) {
    
  var Directive = {
    restrict: 'AE',
    scope: {
        type:   '@mwResource',
        action: '@mwAction'
    }
  };

  Directive.link = function(scope, element) {

    function showIfAllowed() {
      var allowed = ResourceGuard.isAllowedAction(scope.type, scope.action);
      $animate[allowed ? 'removeClass' : 'addClass'](element, 'ng-hide');
    }

    scope.$on('auth:loggedOut', function() {
      $animate.addClass(element, 'ng-hide');
    });

    scope.$on('auth:loggedIn', showIfAllowed);
    showIfAllowed();

  };

  return Directive;
}]);
