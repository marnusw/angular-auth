/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.routeGuard.authRoute')

/**
 * @ngdoc provider
 * @name AuthRouteProvider
 * @kind function
 *
 * @description
 * A proxy object for the {@link ngRoute:$routeProvider $routeProvider} and the 
 * {@link mw.routeGuard:RouteGuardProvider RouteGuardProvider} which allows configuration of routes
 * and roles allowed to access them in one go.
 * 
 * Add a `roles` property to the route definition to specify which user roles are allowed to access
 * that route, and use the `allowAll()` or `denyAll()` method to indicate how to handle routes 
 * without rules.
 */
.provider('AuthRoute', ['$routeProvider',
                        'RouteGuardProvider',
  function AuthRouteProvider($routeProvider, RouteGuardProvider) {
    
    /**
     * @ngdoc method
     * @name AuthRouteProvider#allowAll
     * 
     * @description
     * Call this method to allow access to all routes apart from those with defined rules.
     * 
     * @return {Object} self
     */
    this.allowAll = function() {
        RouteGuardProvider.allowAll();
        return this;
    };
    /**
     * @ngdoc method
     * @name AuthRouteProvider#denyAll
     *
     * @param {boolean} allowAll
     * @description
     * Call this method to deny access to all routes apart from those with defined rules.
     * 
     * @return {Object} self
     */
    this.denyAll = function() {
        RouteGuardProvider.denyAll();
        return this;
    };
    
    /**
     * @ngdoc method
     * @name AuthRouteProvider#when
     *
     * @param {string} path Route path (matched against `$location.path`). If `$location.path`
     *    contains redundant trailing slash or is missing one, the route will still match and the
     *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
     *    route definition.
     *
     *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
     *        to the next slash are matched and stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain named groups starting with a colon and ending with a star:
     *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
     *
     *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
     *    `/color/brown/largecode/code/with/slashes/edit` and extract:
     *
     *    * `color: brown`
     *    * `largecode: code/with/slashes`.
     *
     *
     * @param {Object} route Mapping information to be assigned to `$route.current` on route
     *    match.
     *
     *    Object properties:
     *
     *    - `roles` - `{Array}` - A list of roles that will have access to this route. If not specified
     *      access will be determined by the allowAll/denyAll setting on the 
     *      {@link mw.routeGuard:RouteGuardProvider RouteGuardProvider}. This setting can be changed by
     *      invoking `allowAll()` or `denyAll()` on this provider.
     *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
     *      newly created scope or the name of a {@link angular.Module#controller registered
     *      controller} if passed as a string.
     *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
     *      published to scope under the `controllerAs` name.
     *    - `template` – `{string=|function()=}` – html template as a string or a function that
     *      returns an html template as a string which should be used by {@link
     *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
     *      This property takes precedence over `templateUrl`.
     *
     *      If `template` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
     *      template that should be used by {@link ngRoute.directive:ngView ngView}.
     *
     *      If `templateUrl` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
     *      be injected into the controller. If any of these dependencies are promises, the router
     *      will wait for them all to be resolved or one to be rejected before the controller is
     *      instantiated.
     *      If all the promises are resolved successfully, the values of the resolved promises are
     *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
     *      fired. If any of the promises are rejected the
     *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
     *      is:
     *
     *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
     *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
     *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
     *        and the return value is treated as the dependency. If the result is a promise, it is
     *        resolved before its value is injected into the controller. Be aware that
     *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
     *        functions.  Use `$route.current.params` to access the new route parameters, instead.
     *
     *    - `redirectTo` – {(string|function())=} – value to update
     *      {@link ng.$location $location} path with and trigger route redirection.
     *
     *      If `redirectTo` is a function, it will be called with the following parameters:
     *
     *      - `{Object.<string>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route templateUrl.
     *      - `{string}` - current `$location.path()`
     *      - `{Object}` - current `$location.search()`
     *
     *      The custom `redirectTo` function is expected to return a string which will be used
     *      to update `$location.path()` and `$location.search()`.
     *
     *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
     *      or `$location.hash()` changes.
     *
     *      If the option is set to `false` and url in the browser changes, then
     *      `$routeUpdate` event is broadcasted on the root scope.
     *
     *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
     *
     *      If the option is set to `true`, then the particular route can be matched without being
     *      case sensitive
     *
     * @returns {Object} self
     *
     * @description
     * Adds a new route definition to the `$route` service.
     */
    this.when = function(path, route) {
        $routeProvider.when(path, route);
        route.roles && RouteGuardProvider.addRule(path, route.roles);
        return this;
    };
    
    /**
     * @ngdoc method
     * @name AuthRouteProvider#otherwise
     *
     * @description
     * Sets route definition that will be used on route change when no other route definition
     * is matched.
     *
     * @param {Object} params Mapping information to be assigned to `$route.current`.
     * @returns {Object} self
     */
    this.otherwise = function(params) {
        $routeProvider.otherwise(params);
        return this;
    };
    
    this.$get = function() {
        return {};
    };
}]);
