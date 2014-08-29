/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.routeGuard', []);
angular.module('mw.routeGuard.authRoute', ['mw.routeGuard', 'ngRoute']);


angular.module('mw.routeGuard', [])

// Instantiate the RouteGuard service and register the event handler from the moment the application starts.
.run(['RouteGuard', function(RouteGuard) {
    RouteGuard.registerEventHandlers();
}]);
