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
        },
        active;
        
    Directive.link = function(scope, element) {
        var modalOpts = {
            templateUrl: scope.templateUrl || 'templates/angular-auth/login-handler.html',
            scope: scope,
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        },
        modalInst;
        
        modalOpts.controller = function ($scope) {
            $scope.$on('auth:loggedIn', function() {
                modalInst && modalInst.close();
            });
        };
        
        scope.$on('auth:loginRequired', function() {
            if (!active) {
                active = true;
                element.hide();
                modalInst = openModal(modalOpts);
                modalInst.result.catch(function(dismissReason) {
                    AuthService.loginCancelled(dismissReason);
                });
                modalInst.result.finally(function() {
                    active = false;
                    modalInst = null;
                    element.show();
                });
            }
        });
    };
    
    //////////////////////////////////////////////////
    
    // Since it might not be desirable to use 
    // bootstrap.ui a fallback is available.
    
    var $modal,    // Optional dependency
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
