/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

/**
 * @ngdoc module
 * @name mw.angular-auth
 * @description
 *
 * # mw.angular-auth
 *
 * The `mw.angular-auth` module is an all-in-one solution for authentication and authorization in AngularJS apps.
 *
 * ## Dependencies
 * 
 * Requires the {@link https://github.com/gsklee/ngStorage `ngStorage`} module to be installed.
 */
angular.module('mw.angular-auth')
 
/**
 * @ngdoc provider
 * @name OAuthProvider
 * @kind function
 *
 * @description
 *
 * Used for configuring the AuthService during the config phase.
 */
.provider('AuthService', function AuthServiceProvider() {
    // Option defaults
    var Options = {
    };

    /**
     * @ngdoc method
     * @name OAuthProvider#setOptions
     *
     * @param {Object} options OAuth configuration options:
     * 
     * @description
     * Configure the AuthService provider during the config phase.
     */
    this.setOptions = function(options) {
        angular.extend(Options, options);
    };

    this.$get = [
      function() {

        /**
         * @ngdoc service
         * @name AuthService
         * 
         * @property {Object} options Object with all configuration options.
         *
         * @description
         */

        var AuthService = {
            options : Options
        };
        
        /**
         * @return {Object} self
         * 
         * @description
         */
        function init() {
            return AuthService;
        }

        /**
         * @ngdoc method
         * @name OAuth#getAccessToken
         * 
         * @param data An optional argument to pass on to $broadcast which may be useful for
         *             example if you need to pass through details of the user that was logged in
         * 
         * @return {string} The access token string if a token is available. (e.g. Bearer xxxxxxxxx)
         * 
         * @description
         * Call this function to indicate that authentication was successfull and trigger a
         * retry of all deferred requests.
         */
        AuthService.loginConfirmed = function(data, configUpdater) {
            var updater = configUpdater || function(config) {
                return config;
            };
            $rootScope.$broadcast('event:auth-loginConfirmed', data);
            httpBuffer.retryAll(updater);
        };
        
        /**
         * @param data an optional argument to pass on to $broadcast.
         * @param reason if provided, the requests are rejected; abandoned otherwise.
         * 
         * @description
         * Call this function to indicate that authentication should not proceed.
         * All deferred requests will be abandoned or rejected (if reason is provided).
         */
        AuthService.loginCancelled = function(data, reason) {
            httpBuffer.rejectAll(reason);
            $rootScope.$broadcast('event:auth-loginCancelled', data);
        };
        
        return init();
    }];
});
