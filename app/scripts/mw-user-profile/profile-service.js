/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile')

.factory('ProfileService', ['$rootScope', '$http', 'AuthService', function($rootScope, $http, AuthService) {
    
    var ProfileService = {},
        profile,
        promise;

    ProfileService.registerEventHandlers = function() {
        $rootScope.$on('auth:loggedOut', function() {
            profile = null;
        });

        $rootScope.$on('auth:loggedIn', function() {
            if (!profile) {
                ProfileService.find();
            }
        });
    };

    ProfileService.find = function() {
        if (!AuthService.options.profilePath) {
            return null;
        }
        promise = $http.get(AuthService.options.profilePath);
        profile = {};
        promise.success(function(response) {
            angular.extend(profile, response);
            promise = null;
            $rootScope.$broadcast('auth:loggedIn');
        });
        return promise;
    };

    ProfileService.get = function() {
        return profile;
    };

    ProfileService.getRoles = function() {
        if (profile && profile.roles) {
            return profile.roles;
        } else if (promise) {
            var roles = [];
            promise.then(function() {
                profile.roles && angular.extend(roles, profile.roles);
            });
            return roles;
        }
        return false;
    };

    return ProfileService;
}]);
