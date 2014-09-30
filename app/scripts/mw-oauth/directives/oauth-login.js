/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

.directive('mwOauthLogin', ['OAuth', 'OAuthEndpointLogin', '$compile', '$http',
  function(OAuth, OAuthEndpointLogin, $compile, $http) {

    var Directive = {
        restrict: 'AE',
        replace: true,
        scope: true
    };
    
    Directive.link = function($scope, element, attrs) {

        $scope.registerUrl = attrs.registerUrl || OAuth.options.registerUrl;
        $scope.credentials = {};
        $scope.oauth = OAuth;

        $scope.login = function() {
            if (!$scope.credentials.username || !$scope.credentials.password) {
                $scope.errorMsg = 'Please provide a username and password';
            } else {
                delete $scope.errorMsg;
                OAuthEndpointLogin.login($scope.credentials)
                .then(function(response) {
                    $scope.credentials = {};
                    OAuth.setToken(response.host, response.tokenParams, response.rememberMe);
                }, function(reason) {
                    $scope.errorMsg = reason;
                    $scope.credentials.password = '';
                });
            }
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

    return Directive;
}]);
