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
        templateUrl: getTemplate
    };
    
    function getTemplate(el, attrs) {
        return attrs.templateUrl || 'templates/user-profile/profile.html';
    }
    
    Directive.link = function($scope) {
        
        $scope.$watch(AuthService.status, function() {
            $scope.profile = ProfileProvider.get();
        });
        
    };

    return Directive;
}]);
