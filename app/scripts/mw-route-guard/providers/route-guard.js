/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.routeGuard')

/**
 * @ngdoc provider
 * @name RouteGuardProvider
 * @kind function
 *
 * @description
 *
 * Used to find the host portion of a provided request URL which will resolve to the host of the current 
 * location when a relative path is specified.
 */
.provider('RouteGuard', function RouteGuardProvider() {
    
    var allowAll = false,
        Rules = {};
    
    /**
     * @ngdoc method
     * @name RouteGuardProvider#addRule
     *
     * @param {string} route The route this rule applies to.
     * @param {string|array} roles Role(s) allowed to access.
     * @return {Object} self
     * 
     * @description
     * Add a rule to the route guard. Access to this route will only be allowed if the user has a role
     * that matches the role(s) provided.
     */
    this.addRule = function(route, roles) {
        Rules[route] = Array.isArray(roles) ? roles : [roles];
        return this;
    };
    
    /**
     * @ngdoc method
     * @name RouteGuardProvider#addRules
     *
     * @param {Object} rules An object containing rules.
     * @return {Object} self
     * 
     * @description
     * Add multiple rules to the route guard at once.
     */
    this.addRules = function(rules) {
        for (var r in rules) {
            Array.isArray(roles[r]) || (roles[r] = [roles[r]]);
        }
        angular.extend(Rules, rules);
        return this;
    };
    
    /**
     * @ngdoc method
     * @name RouteGuardProvider#allowAll
     * 
     * @return {Object} self
     * 
     * @description
     * Call this method to allow access to all routes apart from those with defined rules.
     */
    this.allowAll = function() {
        allowAll = true;
        return this;
    };
    /**
     * @ngdoc method
     * @name RouteGuardProvider#denyAll
     * 
     * @return {Object} self
     *
     * @param {boolean} allowAll
     * @description
     * Call this method to deny access to all routes apart from those with defined rules.
     */
    this.denyAll = function() {
        allowAll = false;
        return this;
    };
    
    this.$get = ['$location',
                 '$rootScope',
                 'AuthService', 
      function($location, $rootScope, AuthService) {

        /**
         * @ngdoc service
         * @name RouteGuard
         * @kind function
         *
         * @description
         *
         * Used to find the host portion of a provided request URL which will resolve to the host of the current 
         * location when a relative path is specified.
         */

        var RouteGuard = {};

        /**
         * @description
         * Registers event handlers on the root scope:
         * 
         *   - Sets the global event handler for detecting location changes so authorization can be checked.
         *   - Links to the AuthService loginConfirmed event to retry a previously unauthorized route.
         *   - Links to the AuthService loginCancelled event to clear a previously unauthorized route.
         */
        RouteGuard.registerEventHandlers = function() {
            if (rulesWereConfigured()) {
                $rootScope.$on('$locationChangeStart', function(event, newUrl){
                    var newPath = $location.path();
                    if(RouteGuard.requiresAuth(newPath)) {
                        if (AuthService.hasIdentity()) {
                            RouteGuard.isAllowedRoute(newPath) || event.preventDefault();
                        } else {
                            bufferRoute(newPath);
                            event.preventDefault();
                            AuthService.requestLogin();
                        }
                    }
                });

                $rootScope.$on('auth:loginConfirmed', retryBufferedRoute);
                $rootScope.$on('auth:loginCancelled', clearBufferedRoute());
            }
        };

        /**
         * @ngdoc method
         * @name RouteGuard#isAuthRoute
         *
         * @param {string} route The route to check.
         * 
         * @returns {boolean} Whether the route requires authorization.
         * 
         * @description
         * Is a given route registered as one that requires authorization?
         */
        RouteGuard.requiresAuth = function(route) {
            return !!Rules[route];
        };

        /**
         * @ngdoc method
         * @name RouteGuard#isAllowedRoute
         *
         * @param {string} route The route to check.
         * 
         * @returns {boolean} Whether the route requires authorization.
         * 
         * @description
         * Checks the roles that are allowed to access this route against every role assigned to the current
         * authenticated user. If a match is found access is allowed.
         */
        RouteGuard.isAllowedRoute = function(route) {
            var allowedRoles = Rules[route];
            if (!allowedRoles) {
                return allowAll;
            }
            
            var r, roles = AuthService.getUserRoles();
            for (r in roles) {
                if (allowedRoles.indexOf(roles[r]) !== -1) {
                    return true;
                }
            }
            return false;
        };

        /////////////////////////////////////////////////////

        /**
         * @return {boolean} Were any rules defined during the config phase?
         * 
         * @description Check whether any rules were defined during the config phase.
         */
        function rulesWereConfigured() {
            for (var r in Rules) {
               return true;
            }
            return false;
        }


        var routeBuffer;
        
        /**
         * @param {string} route The route to buffer.
         * 
         * @description Buffer a route so it can be retried later.
         */
        function bufferRoute(route) {
            routeBuffer = route;
        }

        /**
         * @description Check for a route in the route buffer and retry navigating to it if one is found.
         */
        function retryBufferedRoute() {
            if (routeBuffer) {
                $location.path(routeBuffer);
                routeBuffer = null;
            }
        }

        /**
         * @description Remove the buffered route if one exists.
         */
        function clearBufferedRoute() {
            routeBuffer = null;
        }

        return RouteGuard;
    }];
});
