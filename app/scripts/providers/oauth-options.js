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
 */
angular.module('mw.oauth')

/**
 * @ngdoc provider
 * @name OAuthOptionsProvider
 * @kind function
 *
 * @description
 *
 * Used for configuring the OAuth module.
 */
.provider('OAuthOptions', function OAuthOptionsProvider() {
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
     * @name OAuthOptionsProvider#setOptions
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

    this.$get = function() {

        /**
         * @ngdoc service
         * @name OAuthOptions
         * @property {Object} options Object with all oauth configuration options.
         *
         * @description
         * `oauthOptions` is used to retrieve module configuration options when instantiating other services.
         */
        var oauthOptions = {
                options: opts
            };

        if (!opts.clientId) {
            throw new TypeError("Setting the 'clientId' on the OAuthOptionsProvider is required.");
        }

        return oauthOptions;

        /////////////////////////////////////////////////////

    };
});
