/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile', [])

.factory('ProfileProvider', function() {
    
    var ProfileService = {};
    var profile;

    ProfileService.find = function(uri) {
        var promise = $http.get(uri);
        promise.success(function(response) {
            profile = response;
        });
        return promise;
    };

    ProfileService.get = function(uri) {
        return profile;
    };

    ProfileService.set = function(resource) {
        profile = resource;
        return profile;
    };

    return ProfileService;
});
