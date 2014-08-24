/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

.factory('OAuthEndpointLogin', function(OAuthOptions, OAuthRequestHost) {

    var service = {},
        options = OAuthOptions.options;
    
    /**
     * @ngdoc method
     * @name OAuthEndpointLogin#login
     * 
     * @param {string} username 
     * @param {string} password 
     * 
     * @return {$q.promise} A deferred of the request which resolves to an error message when applicable.
     * 
     * @description
     * Log in to the authorisation URL with provided credentials.
     */
    service.login = function(username, password) {
        var request = $http.post(options.authPath, {
            grant_type : 'password',
            username   : username,
            password   : password,
            client_id  : options.clientId
        });
        
        request.then(function(successResponse) {
            AccessToken.set(OAuthRequestHost.getHost(options.authPath), successResponse.data);
        }, function(errorResponse) {
            return (errorResponse.data && errorResponse.data.detail) || 'Invalid credentials';
        });
        
        return request;
    };

    /**
     * @ngdoc method
     * @name OAuthEndpointLogin#refresh
     * 
     * @param {string} refreshToken 
     * 
     * @return {$q.promise} A deferred of the request which resolves to an error message when applicable.
     * 
     * @description
     * Log in to the authorisation URL with provided credentials.
     */
    service.refresh = function(refreshToken) {
        var request = $http.post(options.authPath, {
            grant_type    : 'refresh_token',
            refresh_token : refreshToken,
            client_id     : options.clientId
        });
        
        request.then(function(successResponse) {
            AccessToken.set(OAuthRequestHost.getHost(options.authPath), successResponse.data);
        }, function(errorResponse) {
            return (errorResponse.data && errorResponse.data.detail) || 'Invalid credentials';
        });
        
        return request;
    };

    /**
     * @ngdoc method
     * @name OAuthEndpointLogin#logout
     * 
     * @description
     * Posts to the logout path if specified to delete the access token on the server.
     */
    service.logout = function() {
        options.logoutPath && $http.post(options.logoutPath);
    };

    return service;
});
