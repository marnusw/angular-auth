/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile')

.directive('mwProfile', ['ProfileProvider', 'AuthService', function(ProfileProvider, AuthService) {

    var Directive = {
        restrict: 'AE',
        replace: true,
        scope: true,
        templateUrl: AuthService.options.profileTemplate || 'templates/user-profile/profile.html'
    };
    
    Directive.link = function($scope, element, attrs) {
        
        $scope.$watch(AuthService.status, function() {
            $scope.profile = ProfileProvider.get();
        });
        
    };

    return Directive;
}]);
