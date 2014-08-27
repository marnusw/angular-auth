/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

.directive('mwOauthLoginLink', ['OAuth', 'OAuthEndpointLogin', function(OAuth, OAuthEndpointLogin) {

    var definition = {
        restrict: 'AE',
        replace: true,
        scope: {
            href  : '@'
        },
        template: '<a href="{{href}}" ng-click="logout()">{{oauth.status === "loggedIn" ? "Log out" : "Log in"}}</a>'
    };
    
    definition.link = function($scope) {
        $scope.oauth = OAuth;
        
        $scope.logout = function() {
            var host = OAuthEndpointLogin.logout();
            OAuth.destroyToken(host);
        };
    };

    return definition;
}]);
