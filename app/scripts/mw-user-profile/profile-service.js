/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile', ['mw.angular-auth'])

.factory('ProfileProvider', ['$rootScope', 'AuthService', function($rootScope, AuthService) {
    
    var ProfileProvider = {},
        profile,
        promise;

    $rootScope.$on('auth:loggedOut', function() {
        profile = null;
    });

    $rootScope.$on('auth:loggedIn', function() {
        ProfileProvider.find();
    });

    ProfileProvider.find = function() {
        if (!AuthService.options.profilePath) {
            return null;
        }
        promise = $http.get(AuthService.options.profilePath);
        profile = {};
        promise.success(function(response) {
            angular.extend(profile, response.data);
            promise = null;
        });
        return promise;
    };

    ProfileProvider.get = function() {
        return profile;
    };

    ProfileProvider.getRoles = function() {
        if (profile && profile.getRoles) {
            return profile.getRoles();
        } else if (promise) {
            var roles = [];
            promise.then(function() {
                angular.extend(roles, profile.getRoles ? profile.getRoles() : []);
            });
            return roles;
        }
        return false;
    };

    return ProfileProvider;
}]);
