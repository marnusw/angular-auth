/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile')

.directive('mwProfile', ['ProfileProvider', function(ProfileProvider) {

    var Directive = {
        restrict: 'AE',
        replace: true,
        scope: true
    };
    
    Directive.link = function($scope, element, attrs) {
        
    };

    return Directive;
}]);
