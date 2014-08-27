/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.routeGuard', [])

// Instantiate the RouteGuard service 
.run(['RouteGuard', function(RouteGuard) {
    RouteGuard.registerEventHandlers();
}]);
