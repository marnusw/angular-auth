/**
 * @license Marnus Weststrate - 2014
 * https://github.com/marnusw
 * License: MIT
 */
'use strict';

/**
 * @ngdoc module
 * @name oauth-mw
 * @description
 *
 * # mw.oauth
 *
 * The `mw.oauth` module provides behind the scenes authentication for services interfacing with web services
 * requiring OAUTH2 authentication.
 *
 * ## Dependencies
 * 
 * Requires the {@link https://github.com/gsklee/ngStorage `ngStorage`} module to be installed.
 */
angular.module('mw.oauth')

/**
 * @ngdoc provider
 * @name OAuthProvider
 * @kind function
 *
 * @description
 *
 * Used for configuring the OAuth module during the config phase.
 */
.provider('OAuth', function OAuthProvider() {
    // Option defaults
    var opts = {
        authPath         : '/oauth',
        loginTemplate    : 'views/templates/login-form.html',
        authorizePath    : '/oauth/authorize',
        redirectTemplate : 'views/templates/redirect-link.html',
        text             : 'Sign In'
    };

    /**
     * @ngdoc method
     * @name OAuthProvider#setOptions
     *
     * @param {Object} options OAuth configuration options:
     * 
     * Options that are always required/applicable:
     * 
     *  - clientId:      (required) OAuth client id.
     *  - logoutPath:    (optional) a path to post to so the token is destroyed on the server. (e.g `/oauth/logout`)
     *  - profilePath:   (optional) user profile path. (e.g `/users/me`, default: none)
     *  - scope:         (optional) scope indicating a list of permissions. (default: none)
     *  - state:         (optional) An arbitrary unique string created by your app to guard against 
     *                              Cross-site Request Forgery. (default: none)
     *  
     * Options for configuring username/password authentication via the `mw-oauth-login` directive:
     * 
     *  - authPath:      (optional) the path to post the username/password data to for a token. (default: `/oauth`)
     *  - loginTemplate: (optional) a login form template for the `mw-oauth-login` directive to render. This can
     *                              also be specified as an attribute on the directive.
     *                              (default: `views/templates/login-form.html`)
     *  - registerUrl:   (optional) a link to the registration page is shown on the default login form when this 
     *                              URL is specified. This can also be specified as an attribute on the directive.
     *                              (default: none)
     * 
     * Options for configuring a redirected implicit grant via the `mw-oauth-redirect` directive:
     * 
     *  - site:             (required) the oauth server host. (e.g. `http://oauth.example.com`)
     *  - redirectUri:      (required) client redirect uri back to the application.
     *  - redirectTemplate: (optional) template to render. (default: `views/templates/redirect-link.html`)
     *  - text:             (optional) login text to display on the redirect template. (default: "Sign in")
     *  - authorizePath:    (optional) authorization url. (default: `/oauth/authorize`)
     *
     * @description
     * Configure the OAuth service provider during the config phase.
     */
    this.setOptions = function(options) {
        angular.extend(opts, options);
    };

  this.$get = ['$rootScope',
               '$location',
               '$sessionStorage',
               '$timeout',
               'OAuthRequestHost',
      function($rootScope, $location, $sessionStorage, $timeout, OAuthRequestHost) {

        /**
         * @ngdoc service
         * @name OAuth
         * 
         * @property {Object} options Object with all oauth configuration options.
         *
         * @property {Object} status The current OAuth status:
         * 
         *   - init: The initial state when the service is instantiated.
         *   - loggedOut: The session was ended or never started and no access token is available.
         *   - expired: There is an access token but it has expired.
         *   - loggedIn: The session is open and a valid access token is present which can be used with requests.
         *
         * @description
         * `OAuth` is used to retrieve module configuration options when instantiating other services.
         * 
         * Requires the {@link https://github.com/gsklee/ngStorage `ngStorage`} module to be installed.
         */

        /**
         * @ngdoc event
         * @name OAuth#oauth:login
         * @eventType broadcast on root scope
         * @description
         * Broadcasted whenever new token parameters are set. This can be when a successful username/password
         * post completes, upon return from a redirect, or when the service is initialised and tokens are found
         * in session storage.
         *
         * @param {string} host The host name associated with the login.
         * @param {string} access_token The obtained access token.
         */
        
        /**
         * @ngdoc event
         * @name OAuth#oauth:logout
         * @eventType broadcast on root scope
         * @description
         * Broadcasted whenever a token is actively destroyed to signal the user logging out. This implies that
         * there is no longer any token associated with a particular host.
         *
         * @param {string} host The host name logged out from.
         */
        
        /**
         * @ngdoc event
         * @name OAuth#oauth:expires-soon
         * @eventType broadcast on root scope
         * @description
         * Broadcasted whenever a token will expire within a given number of seconds so refresh action might be taken.
         *
         * @param {string} host The host name associated with the expiring token.
         * @param {string} remaining The seconds remaining before expiry.
         */
        
        /**
         * @ngdoc event
         * @name OAuth#oauth:expired
         * @eventType broadcast on root scope
         * @description
         * Broadcasted whenever a token expires.
         *
         * @param {string} host The host name associated with the expired token.
         */
        
        var OAuth = {
            options : opts,
            status  : 'init'
        };
        
        if (!opts.clientId) {
            throw new TypeError("Setting the 'clientId' on the OAuthProvider is required.");
        }

        var tokens;

        /**
         * @return {Object} self
         * 
         * @description
         * Initialises the OAuth service by setting the access token(s). If there is a tokens object on the session
         * storage this is used as a starting point. Then the URI fragment is checked for a new token after a 
         * redirect which is added to the tokens object. 
         */
        function init() {
            if (!$sessionStorage.oauth_tokens) {
                $sessionStorage.oauth_tokens = tokens = {};
            } else {
                tokens = $sessionStorage.oauth_tokens;
                // Trigger the login or expired event on all host tokens.
                for (var host in tokens) {
                    OAuth.hasExpired(host) ? OAuth.expireToken(host) : OAuth.setToken(host, tokens[host]);
                }
            }
            
            var uriParams = getTokenFromUri();
            if (uriParams && uriParams.access_token) {
                var host = OAuthRequestHost.getHost(opts.site);
                OAuth.setToken(host, uriParams);
            }
            
            return OAuth;
        }

        /**
         * @ngdoc method
         * @name OAuth#getAccessToken
         * 
         * @param {string} host The host name to get the access token for.
         * 
         * @return {string} The access token string if a token is available. (e.g. Bearer xxxxxxxxx)
         * 
         * @description
         * Retrieves the access token string for the provided host name.
         */
        OAuth.getAccessToken = function(host) {
            return tokens[host] ? (tokens[host].token_type || 'Bearer ') + tokens[host].access_token : null;
        };
        
        /**
         * @ngdoc method
         * @name OAuth#getScope
         * 
         * @param {string} host The host name to get the scope for.
         * 
         * @return {Array} An array of allowed actions/roles associated with the user.
         * 
         * @description
         * Retrieves the scope/permissions associated with a given host for the current user.
         */
        OAuth.getScope = function(host) {
            return tokens[host] && tokens[host].scope;
        };

        /**
         * @ngdoc method
         * @name OAuth#getRefreshToken
         * 
         * @param {string} host The host name to get the refresh token for.
         * 
         * @return {string} The refresh token string if one is available.
         * 
         * @description
         * Retrieves the refresh token string for the provided host name if the current access token hasn't expired yet.
         */
        OAuth.getRefreshToken = function(host) {
            return tokens[host] && !OAuth.hasExpired(host) ? tokens[host].refresh_token : null;
        };

        /**
         * @ngdoc method
         * @name OAuth#hasExpired
         * 
         * @param {string} host The host name to test for.
         * 
         * @return {boolean}
         * 
         * @description
         * Tells whether the access token has expired.
         */
        OAuth.hasExpired = function(host) {
            return (tokens[host] && tokens[host].expires_at && tokens[host].expires_at < new Date);
        };

        /**
         * @ngdoc method
         * @name OAuth#setToken
         * 
         * @param {string} host The host name to get the token for. The current location is used if omitted.
         * @param {string} tokenParams The OAuth token parameters to set:
         * 
         *   - access_token: The token to use on the Authorization hearder with requests.
         *   - expires_in: Seconds until the token expires.
         *   - refresh_token: A token that can be used to get a refreshed access token before this one expires.
         *   - scope: (optional) A space separated access control list.
         *   - token_type: (optional) The token type prepended to the access token in the header. (default: Bearer)
         * 
         * @description
         * Sets and returns the access token. It tries (in order) the following strategies:
         * - checks for token parameters passed to this method
         */
        OAuth.setToken = function(host, tokenParams) {
            tokens[host] && cancelExpireTimeouts(tokens[host]);
            tokens[host] = processRawParams(host, tokenParams);
            OAuth.status = 'loggedIn';
            setExpireTimeouts(tokenParams);
            $rootScope.$broadcast('oauth:login', host, tokenParams.access_token);
        };

        /**
         * @ngdoc method
         * @name OAuth#destroyToken
         * 
         * @param {string} host The host for which the token is destroyed.
         * 
         * @description
         * Destroys the token associated with the host.
         */
        OAuth.destroyToken = function(host) {
            tokens[host] && cancelExpireTimeouts(tokens[host]);
            OAuth.status = 'loggedOut';
            delete tokens[host];
            $rootScope.$broadcast('oauth:logout', host);
        };

        /**
         * @ngdoc method
         * @name OAuth#expireToken
         * 
         * @param {string} host The host for which the token is expired.
         * 
         * @description
         * Switch to the expired state when a token expires.
         */
        OAuth.expireToken = function(host) {
            OAuth.status = 'expired';
            $rootScope.$broadcast('oauth:expired', host);
        };

        /**
         * @ngdoc method
         * @name OAuth#expiresSoon
         * 
         * @param {string} host The host for which the token will expire soon.
         * @param {string} remaining The number of seconds before the token will expire.
         * 
         * @description
         * Notify of an iminent token expiry.
         */
        OAuth.expiresSoon = function(host, remaining) {
            $rootScope.$broadcast('oauth:expires-soon', host, remaining);
        };

        /////////////////////////////////////////////////////

        /**
         * @return {Object} The OAuth token paramters object if a token is available on the fragment URI or null.
         *
         * @description
         * Parse the fragment URI and return an object containing token parameters if present on the URI.
         */
        function getTokenFromUri() {
            var params = $location.search();
            $location.search('access_token', null);
            $location.search('error', null);
            
            return params.access_token || params.error ? params : null;
        }

        /**
         * @param {string} host The host associated with the token.
         * @param {Object} tokenParams The raw token parameters to process.
         * 
         * @returns {Object} The processed token parameters
         * 
         * @description
         * Set the access token expiration date/time and add the host to the parameters. The scope is also
         * converted from a space separated list to an array if applicable. A spaces is appended to the 
         * token type for easy joining to the access token.
         */
        function processRawParams(host, tokenParams) {
            var expires_at = tokenParams.expires_at = new Date;
            expires_at.setSeconds(expires_at.getSeconds() + parseInt(tokenParams.expires_in) - 60); // 60 seconds less to secure browser and response latency
            tokenParams.host = host;
            tokenParams.token_type += ' ';
            if (tokenParams.scope) {
                tokenParams.scope = tokenParams.scope.split(' ');
            }
            return tokenParams;
        };
        
        /**
         * @param {Object} tokenParams The token parameters to set timeouts on.
         * 
         * @description
         * Set timeouts to trigger events when the token has expired or will soon.
         */
        function setExpireTimeouts(tokenParams) {
            var remainingSeconds = tokenParams.expires_at - new Date,
                _tokenParams = tokenParams;
            
            tokenParams.expiresSoonTimeout = $timeout(function() {
                OAuth.expiresSoon(_tokenParams.host, 60);
            }, remainingSeconds - 60);
            
            tokenParams.expiredTimeout = $timeout(function() {
                OAuth.expireToken(_tokenParams.host);
            }, remainingSeconds);
        }
        
        /**
         * @param {Object} tokenParams The token parameters with timeouts to cancel.
         * 
         * @description
         * Cancels the timeouts which are fired when the token expires.
         */
        function cancelExpireTimeouts(tokenParams) {
            $timeout.cancel(tokenParams.expiresSoonTimeout);
            $timeout.cancel(tokenParams.expiredTimeout);
        };
        
        return init();
    }];
});
