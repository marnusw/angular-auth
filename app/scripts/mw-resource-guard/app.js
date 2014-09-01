/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.resourceGuard', [])

// Push the HTTP interceptor for cathcing 401 and 403 errors.
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('UnauthInterceptor');
}])

.run(['$rootScope', 'HttpBuffer', function($rootScope, HttpBuffer) {
    $rootScope.$on('auth:loginCancelled', HttpBuffer.rejectAll);
    $rootScope.$on('auth:loggedIn', function() {
        HttpBuffer.retryAll();
    });
}]);
