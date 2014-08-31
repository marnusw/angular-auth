/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.oauth', ['ngStorage']);
//angular.module('mw.oauth.profile', ['mw.oauth']);

// App configuration
angular.module('mw.oauth')

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('OAuthInterceptor');
}]);
