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
.directive('mwIfAllowedResource', ['ResourceGuard', '$animate', function(RouteGuard, $animate) {
    return function(scope, element, attrs) {

        var href = attrs.href;
        if (!href) {
            var children = element.children();
            href = children.length && children[0].href;
        }
        var path = href && href.substr(href.indexOf('#') + 1);
        
        function showIfAllowed() {
            var allowed = !path || RouteGuard.isAllowedRoute(path);
            $animate[allowed ? 'removeClass' : 'addClass'](element, 'ng-hide');
        }
        
        scope.$on('auth:loggedOut', function() {
            $animate.addClass(element, 'ng-hide');
        });
        
        scope.$on('auth:loggedIn', showIfAllowed);
        showIfAllowed();
        
    };
}]);
