/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile', ['mw.angular-auth'])

// Instantiate the RouteGuard service and register the event handler from the moment the application starts.
.run(['ProfileService', function(ProfileService) {
    ProfileService.registerEventHandlers();
}]);
