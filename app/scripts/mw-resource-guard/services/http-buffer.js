/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
'use strict';

angular.module('mw.resourceGuard')

/**
 * @ngdoc service
 * @name HttpBuffer
 *
 * @description
 * Buffers $http requests so they can be retried later.
 */
.factory('HttpBuffer', ['$http', function($http) {
    /** Holds all the requests, so they can be re-requested in future. */
    var buffer = [];

    function retryHttpRequest(config, deferred) {
        function successCallback(response) {
            deferred.resolve(response);
        }
        function errorCallback(response) {
            deferred.reject(response);
        }
        $http(config).then(successCallback, errorCallback);
    }

    return {
        /**
         * Appends HTTP request configuration object with deferred response attached to buffer.
         */
        append: function(config, deferred) {
            buffer.push({
                config: config,
                deferred: deferred
            });
        },
        /**
         * Abandon or reject (if reason provided) all the buffered requests.
         */
        rejectAll: function(reason) {
            for (var i = 0; i < buffer.length; ++i) {
                buffer[i].deferred.reject(reason);
            }
            buffer = [];
        },
        /**
         * Retries all the buffered requests clears the buffer.
         */
        retryAll: function(updater) {
            for (var i = 0; i < buffer.length; ++i) {
                retryHttpRequest(updater ? updater(buffer[i].config) : buffer[i].config, buffer[i].deferred);
            }
            buffer = [];
        }
    };
}]);