/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

// App modules
angular.module('mw.oauth', ['ngStorage']);
angular.module('mw.oauth.profile', ['mw.oauth']);

// App configuration
angular.module('mw.oauth')

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('OAuthInterceptor');
}]);
