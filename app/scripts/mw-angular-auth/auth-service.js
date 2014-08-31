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
        profileProvider;

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

    this.$get = ['$rootScope', '$injector', Options.authAdapter, function($rootScope, $injector, AuthAdapter) {

        if ($injector.has(Options.profileProvider)) {
            profileProvider = $injector.get(Options.profileProvider);
        }

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
        },
        identity;
        
        /**
         * @ngdoc method
         * @name AuthService#hasIdentity
         * 
         * @returns {Boolean} 
         */
        AuthService.hasIdentity = function() {
            return !!identity;
        };
        
        /**
         * @ngdoc method
         * @name AuthService#getIdentity
         * 
         * @returns {Object} A User instance.
         */
        AuthService.getIdentity = function() {
            return identity;
        };
        
        /**
         * @ngdoc method
         * @name AuthService#getRoles
         * 
         * @returns {Array}
         */
        AuthService.getRoles = function() {
            var roles;
            if (identity && identity.roles) {
                return identity.roles;
            } else if (AuthAdapter.getRoles) {
                roles = AuthAdapter.getRoles();
                if (roles !== false) {
                    return roles;
                }
            } else if (profileProvider && profileProvider.getRoles) {
                roles = profileProvider.getRoles();
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
            AuthAdapter.logout();
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
