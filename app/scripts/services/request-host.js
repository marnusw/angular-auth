/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

angular.module('mw.oauth')

/**
 * @ngdoc service
 * @name OAuthRequestHost
 * @kind function
 *
 * @description
 *
 * Used to find the host portion of a provided request URL which will resolve to the host of the current 
 * location when a relative path is specified.
 */
.factory('OAuthRequestHost', ['$location', function($location) {

    var service = {};
    
    /**
     * @ngdoc method
     * @name OAuthRequestHost#getHost
     *
     * @param {string} url The request URL to process.
     * 
     * @returns {string} The host portion of the URL.
     * 
     * @description
     * Get the host portion of a request URI. If the URI is omitted or a relative URI is provided the 
     * host portion of the current location is returned.
     */
    service.getHost = function(url) {
        var matches = (url || '').match(/^(?:[a-z]+:)?\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        return matches ? matches[1] : $location.host();
    };
    
    return service;
}]);
