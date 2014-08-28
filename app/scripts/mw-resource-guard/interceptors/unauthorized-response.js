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
 */
.factory('UnauthInterceptor', ['$rootScope', '$q', 'HttpBuffer', function($rootScope, $q, HttpBuffer) {
    return {
        responseError: function(rejection) {
            if (rejection.status === 401 && !rejection.config.ignoreAuthModule) {
                var deferred = $q.defer();
                httpBuffer.append(rejection.config, deferred);
                $rootScope.$broadcast('event:auth-loginRequired', rejection);
                return deferred.promise;
            }
            // otherwise, default behaviour
            return $q.reject(rejection);
        }
    };
}]);
