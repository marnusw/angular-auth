/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
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
    
    var Rules = {};
    
    /**
     * @ngdoc method
     * @name RouteGuardProvider#addRule
     *
     * @param {string} route The route this rule applies to.
     * @param {string} role Role allowed to access.
     * @description
     * Add a rule to the route guard.
     */
    this.addRule = function(route, role) {
        Rules[route] = role;
        return this;
    };
    
    /**
     * @ngdoc method
     * @name RouteGuardProvider#addRules
     *
     * @param {Object} rules An object containing rules.
     * @description
     * Add multiple rules to the route guard at once.
     */
    this.addRules = function(rules) {
        angular.extend(Rules, rules);
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
        function registerEventHandlers() {
            if (rulesWereConfigured()) {
                $rootScope.$on('$locationChangeStart', function(event, newUrl){
                    if(RouteGuard.isAuthRoute(newUrl)) {
                        if (!AuthService.hasIdentity()) {
                            bufferRoute(newUrl);
                            AuthService.requestLogin();
                        } else {
                            if (!RouteGuard.isAllowedRoute(newUrl)) {
                                event.preventDefault();
                            }
                        }
                    }
                });

                $rootScope.$on('auth:loginConfirmed', retryBufferedRoute);
                $rootScope.$on('auth:loginCancelled', clearBufferedRoute());
            }
        }

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
        RouteGuard.isAuthRoute = function(route) {
            return !!Rules[route];
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
        RouteGuard.isAuthRoute = function(route) {

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
