/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
'use strict';

angular.module('mw.resourceGuard')

/**
 * @ngdoc service
 * @name UnauthInterceptor
 *
 * @description
 * 
 * 
 * @todo
 * Incorporate:
 * https://github.com/it-crowd/angular-http-auth/blob/a713fe40a60db1ddc84d22b95495bdb1c7a63e8a/src/http-auth-interceptor.js
 * https://github.com/christianrondeau/angular-http-auth/blob/61ba732dbc20313a96ed0fe5a5cdd219228d8c39/src/http-auth-interceptor.js
 */
.factory('UnauthInterceptor', ['$rootScope', '$q', 'HttpBuffer', function($rootScope, $q, HttpBuffer) {
    return {
        responseError: function(rejection) {
            if (rejection.status === 401 && !rejection.config.ignoreResourceGuard) {
                var deferred = $q.defer();
                HttpBuffer.append(rejection.config, deferred);
                $rootScope.$broadcast('auth:loginRequired', rejection);
                return deferred.promise;
            }
            if (rejection.status === 403) {
                $rootScope.$broadcast('auth:resourceUnauthorized', rejection);
            }
            // otherwise, default behaviour
            return $q.reject(rejection);
        }
    };
}]);
