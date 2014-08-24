/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

.factory('OAuthInterceptor', ['OAuthAccessToken', function(OAuthAccessToken) {

    var service = {};

    service.request = function(config) {
        var token = OAuthAccessToken.get();
        if (token) {
            handleExpiration();
            addAuthHeader();
        }
        return config;
    };

    var addAuthHeader = function(config, token) {
        if (!token.host || token.host === getRequestHost(config.url)) {
            config.headers.Authorization = 'Bearer ' + token.access_token;
        }
    };

    var handleExpiration = function(token) {
        if (token.expires_at && new Date(token.expires_at) < new Date()) {
            OAuthAccessToken.handleExpiry();
        }
    };

    return service;
}]);
