/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

.directive('mwOauthLogin', ['OAuth', 'OAuthEndpointLogin', '$compile', '$http',
  function(OAuth, OAuthEndpointLogin, $compile, $http) {

    var definition = {
        restrict: 'AE',
        replace: true,
        scope: true
    };
    
    definition.link = function($scope, element, attrs) {

        $scope.registerUrl = attrs.registerUrl || OAuth.options.registerUrl;
        $scope.credentials = {};
        $scope.oauth = OAuth;

        $scope.login = function() {
            delete $scope.errorMsg;
            OAuthEndpointLogin.login($scope.credentials)
            .then(function(response) {
                $scope.credentials = {};
                OAuth.setToken(response.host, response.tokenParams);
            }, function(reason) {
                $scope.errorMsg = reason;
                $scope.credentials.password = '';
            });
        };

        $scope.logout = function() {
            var host = OAuthEndpointLogin.logout();
            OAuth.destroyToken(host);
        };
        
        $http.get(attrs.loginTemplate || OAuth.options.loginTemplate).success(function(html) {
            element.html(html);
            $compile(element.contents())($scope);
        });
    };

    return definition;
}]);
