/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.angular-auth.loginLink', ['mw.angular-auth'])

/**
 * @ngdoc directive
 * @name mwLoginLink
 *
 * @description
 * A link which displays text based on the login status on the Authentication Service.
 * 
 * If an `href` attribute is specified clicking the link will navigate to the target path. 
 * When it is omitted an `auth:loginRequired' event is fired without navigation.
 */
.directive('mwLoginLink', ['$rootScope', 'AuthService', function($rootScope, AuthService) {

  var directive = {
    restrict: 'AE',
    replace: true,
    scope: {
      href           : '@',
      loggedOutText  : '@', // Default: Log in
      loggedInText   : '@'  // Default: Log out
    },
    template: '<a href="{{href}}" ng-click="click($event)">{{auth.status === "loggedIn" ? (loggedInText || "Log out") : (loggedOutText || "Log in")}}</a>',
    link: function($scope) {
      $scope.auth = AuthService;

      $scope.click = function(event) {
        AuthService.logout();
        if ($scope.href == '' || $scope.href == '/') {
          $rootScope.$broadcast('auth:loginRequired');
          event.preventDefault();
        }
      };
    }
  };

  return directive;
}]);
