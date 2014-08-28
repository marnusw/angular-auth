/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
'use strict';

angular.module('mw.resourceGuard', [])

// Push the HTTP interceptor for cathcing 401 and 403 errors.
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('UnauthInterceptor');
}]);
