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
            loginHref  : '@',
            logoutHref : '@'
        },
        template: '<span>'
                +   '<a ng-show="oauth.status !== \'loggedIn\'" href="{{logoutHref}}">Log in</a>'
                +   '<a ng-show="oauth.status === \'loggedIn\'" ng-click="logout()">Log out</a>'
                + '</span>'
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
