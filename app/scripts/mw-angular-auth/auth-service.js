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
angular.module('mw.angular-auth', [])
 
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
            authAdapter: 'OAuthAdapter',
            profileProvider: 'ProfileService'
        },
        authAdapter,
        profileProviders;

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

    this.$get = ['$rootScope', '$injector', function($rootScope, $injector) {

        /**
         * @ngdoc service
         * @name AuthService
         * 
         * @property {Object} options Object with all configuration options.
         *
         * @description
         */

        var AuthService = {
            options : Options,
            status: 'loggedOut'
        };
        
        function registerEventHandlers() {
            $rootScope.$on('oauth:login', function() {
                $rootScope.$broadcast('auth:loggedIn');
                AuthService.status = 'loggedIn';
            });
            $rootScope.$on('oauth:logout', function() {
                $rootScope.$broadcast('auth:loggedOut');
                AuthService.status = 'loggedOut';
            });
            $rootScope.$on('oauth:expires-soon', function() {
                $rootScope.$broadcast('auth:expires-soon');
            });
        };
        
        function getAuthAdapter() {
            authAdapter = $injector.get(Options.authAdapter);
        };

        function getProfileProviders() {
            if (!profileProviders) {
                profileProviders = [];
                if (authAdapter.getRoles) {
                    profileProviders.push(authAdapter);
                }
                if ($injector.has(Options.profileProvider)) {
                    var provider = $injector.get(Options.profileProvider);
                    provider.getRoles && profileProviders.push(provider);
                }
            }
            return profileProviders;
        }

        registerEventHandlers();
        getAuthAdapter();

        /**
         * @ngdoc method
         * @name AuthService#getRoles
         * 
         * @returns {Array}
         */
        AuthService.getRoles = function() {
            var providers = getProfileProviders(),
                p, roles;
            for (p in providers) {
                roles = providers[p].getRoles();
                if (roles !== false) {
                    return roles;
                }
            }
            return ['guest'];
        };

        /**
         * @ngdoc method
         * @name AuthService#logout
         */
        AuthService.logout = function() {
            authAdapter.logout();
        };

        /**
         * @description
         * This function is used to indicate that authentication will not proceed which triggers a
         * `auth:loginCancelled` event with the optional reason.
         * 
         * @param reason an optional reason for cancelling the login.
         */
        AuthService.loginCancelled = function(reason) {
            $rootScope.$broadcast('auth:loginCancelled', reason);
        };
        
        return AuthService;
    }];
});
