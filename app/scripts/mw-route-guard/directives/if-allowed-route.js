/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.routeGuard')

/**
 * @ngdoc directive
 * @name mwIfAllowedRoute
 *
 * @description
 *
 */
.directive('mwIfAllowedRoute', [function() {

    var definition = {
        restrict: 'A'
    };
    
    definition.link = function($scope, element, attrs) {
        
        // 1. Check the href attribute for the path
        // 2. Get the current user from the AuthService
        // 3. Hide the element if not logged in or unauthorised
        
    };

    return definition;
}]);
