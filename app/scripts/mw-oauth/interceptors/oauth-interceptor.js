/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

.factory('OAuthInterceptor', ['OAuth', 'OAuthRequestHost', function(OAuth, OAuthRequestHost) {

    var service = {};

    service.request = function(config) {
        var host = OAuthRequestHost.getHost(config.url);
        config.headers.Authorization = OAuth.getAccessToken(host);
        return config;
    };

    return service;
}]);
