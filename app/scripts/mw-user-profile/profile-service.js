/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.user.profile')

.factory('ProfileService', ['$rootScope', '$http', '$q', 'AuthService', function($rootScope, $http, $q, AuthService) {

  var ProfileService = {},
      profile;

  ProfileService.registerEventHandlers = function() {
    $rootScope.$on('auth:loggedOut', function() {
      profile = null;
    });

    $rootScope.$on('auth:loggedIn', function() {
      ProfileService.find();
    });
  };

  ProfileService.find = function() {
    if (!profile) {
      if (!AuthService.options.profilePath || !AuthService.hasIdentity()) {
        return null;
      }
      var request = $http.get(AuthService.options.profilePath),
          dfrd = $q.defer();
      profile = {
        $promise: dfrd.promise,
        resolved: false
      };
      request.then(function(response) {
        angular.extend(profile, response.data);
        profile.resolved = true;
        dfrd.resolve(profile);
        // This is so listeners will detect the new roles, rather use an authStateChange type event.
        $rootScope.$broadcast('auth:loggedIn');
      });
    }
    return profile.$promise;
  };

  ProfileService.get = function(callback) {
    if (!profile) {
      ProfileService.find();
    }
    if (profile && callback) {
      profile.$promise.then(callback);
    }
    return profile;
  };

  ProfileService.getRoles = function() {
    var profile = ProfileService.get();
    if (!profile) {
      return false;
    }
    if (profile.roles) {
      return profile.roles;
    }
    var profile = ProfileService.get(),
        roles = [];
    profile.$promise.then(function(profile) {
      profile.roles && angular.extend(roles, profile.roles);
    });
    return roles;
  };

  return ProfileService;
}]);
