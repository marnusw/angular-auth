/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

/**
 * @ngdoc service
 * @name OAuthEndpointLogin
 * @kind function
 *
 * @description
 */
.factory('OAuthAdapter', ['OAuth', 'OAuthEndpointLogin',
  function(OAuth, OAuthEndpointLogin) {

    var OAuthAdapter = {};
    
    OAuthAdapter.isLoggedIn = function() {
        return OAuth.status == 'loggedIn';
    };
    
    OAuthAdapter.getRoles = function() {
        var roles = OAuth.getScope();
        return roles && roles.length ? roles : false;
    };
    
    OAuthAdapter.logout = function() {
        var host = OAuthEndpointLogin.logout();
        OAuth.destroyToken(host);
    };
    
    return OAuthAdapter;
}]);
