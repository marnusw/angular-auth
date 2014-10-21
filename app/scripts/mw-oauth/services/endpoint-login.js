/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
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
.factory('OAuthEndpointLogin', ['OAuth', '$http', '$q',
function (OAuth, $http, $q) {

  var options = OAuth.options,
      service = {};

  /**
   * @ngdoc method
   * @name OAuthEndpointLogin#login
   * 
   * @param {Object} credentials An object containing a username and password.
   * 
   * @return {$q.promise} A deferred of the request which resolves to an error message when applicable.
   * 
   * @description
   * Log in to the authorisation URL with provided credentials.
   */
  service.login = function (credentials) {
    var requestData = angular.extend(credentials, {
          grant_type: 'password',
          client_id: options.clientId,
          scope: options.scope
        }),
        request = $http.post(options.authPath, requestData, {ignoreResourceGuard: true}),
        result = $q.defer();

    request.then(function (successResponse) {
      result.resolve({
        host: OAuth.getRequestHost(options.authPath),
        tokenParams: successResponse.data,
        rememberMe: credentials.rememberMe
      });
    }, function (errorResponse) {
      result.reject((errorResponse.data && errorResponse.data.detail) || 'Invalid credentials');
    });

    return result.promise;
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
  service.refresh = function (refreshToken) {
    var request = $http.post(options.authPath, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: options.clientId,
      scope: options.scope
    });

    request.then(function (successResponse) {
      result.resolve({
        host: OAuth.getRequestHost(options.authPath),
        tokenParams: successResponse.data
      });
    }, function (errorResponse) {
      result.reject((errorResponse.data && errorResponse.data.detail) || 'Refresh failed');
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
  service.logout = function () {
    var host = OAuth.getRequestHost(options.logoutPath || options.authPath);
    if (options.logoutPath) {
      $http.post(options.logoutPath, {}, {
        headers: {Authorization: OAuth.getAccessToken(host)}
      });
    }
    return host;
  };

  return service;
}]);
