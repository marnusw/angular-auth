/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.angular-auth.loginHandler', ['mw.angular-auth'])

/**
 * @ngdoc directive
 * @name mwLoginHandler
 *
 * @description
 * Listens for a `auth:loginRequired` event and opens a modal with the view template provided on the
 * `template-url` attribute. A subsequent `auth:loggedIn` event will close the modal automatically.
 * 
 * The login can be cancelled via the provided template by invoking the `$dismiss()` method on a 
 * cancel button. This will inform the {@link mw.angular-auth:AuthService authentication service}.
 */
.directive('mwLoginHandler', ['AuthService', '$injector', function(AuthService, $injector) {

    var Directive = {
            restrict: 'AE',
            scope: {
                templateUrl: '@'
            }
        };
        
    Directive.link = function(scope) {
        var modalOpts = {
            templateUrl: scope.templatePath || 'templates/angular-auth/login-handler.html',
            scope: scope,
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        };
        
        modalOpts.controller = function ($scope, $modalInstance) {
            $scope.$on('auth:loggedIn', function() {
                $modalInstance.close('Login successful');
            });
        };
        
        scope.$on('auth:loginRequired', function() {
            var modalInst = openModal(modalOpts);
            modalInst.result.catch(function(dismissReason) {
                AuthService.loginCancelled(dismissReason);
            });
        });
    };
    
    //////////////////////////////////////////////////
    
    // Since it might not be desirable to use 
    // bootstrap.ui a fallback is available.
    
    var $modal, // Optional dependency
        openModal; // Function

    if ($injector.has('$modal')) {
        $modal = $injector.get('$modal');
        openModal = $modal.open;
    } else {
        openModal = function() {
            throw new ReferenceError("A local modal directive hasn't been implemented yet, please include bootstrap.ui.");
        };
    }

    return Directive;
}]);
