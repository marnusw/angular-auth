/**
 * @license Angular Auth module for AngularJS
 * (c) 2014 Marnus Weststrate (https://github.com/marnusw)
 * License: MIT
 */
'use strict';

angular.module('mw.resourceGuard')

/**
 * @ngdoc provider
 * @name ResourceGuardProvider
 * @kind function
 *
 * @description
 *
 * 
 */
.provider('ResourceGuard', function ResourceGuardProvider() {

  var Rules = {},
      allowByDefault;

  /**
   * @ngdoc method
   * @name ResourceGuardProvider#addRule
   *
   * @param {string} resource The resource this rule applies to.
   * @param {string|array} actions The action(s) that are allowed.
   * @param {string|array} roles Role(s) allowed to perform the actions.
   * @return {Object} self
   * 
   * @description
   * Add a rule to the resource guard. An action on this resource will only be allowed if the user has a role
   * that matches the role(s) provided.
   */
  this.addRule = function(resource, actions, roles) {
    actions = Array.isArray(actions) ? actions : [actions];
    Rules[resource] || (Rules[resource] = {});
    for (var a in actions) {
      Rules[resource][actions[a]] = Array.isArray(roles) ? roles : [roles];
    }
    return this;
  };

  /**
   * @ngdoc method
   * @name ResourceGuardProvider#addRules
   *
   * @param {Object} rules An object containing rules.
   * @return {Object} self
   * 
   * @description
   * Add multiple rules to the resource guard at once.
   */
//  this.addRules = function(rules) {
//    for (var r in rules) {
//      Array.isArray(roles[r]) || (roles[r] = [roles[r]]);
//    }
//    angular.extend(Rules, rules);
//    return this;
//  };

  /**
   * @ngdoc method
   * @name ResourceGuardProvider#allowAll
   * 
   * @description
   * Call this method to allow access to all resources apart from those with defined rules.
   * 
   * @return {Object} self
   */
  this.allowAll = function() {
    allowByDefault = true;
    return this;
  };
  /**
   * @ngdoc method
   * @name ResourceGuardProvider#denyAll
   *
   * @description
   * Call this method to deny access to all resources apart from those with defined rules.
   * 
   * @return {Object} self
   */
  this.denyAll = function() {
    allowByDefault = false;
    return this;
  };

  this.$get = ['AuthService', function(AuthService) {

    /**
     * @ngdoc service
     * @name ResourceGuard
     * @kind function
     *
     * @description
     *
     * Used to find the host portion of a provided request URL which will resolve to the host of the current 
     * location when a relative path is specified.
     */
    var ResourceGuard = {};

    /**
     * @ngdoc method
     * @name ResourceGuard#requiresAuth
     *
     * @param {string} resource The resource to check.
     * 
     * @returns {boolean} Whether the resource requires authorization.
     * 
     * @description
     * Is a given resource registered as one that requires authorization?
     */
    ResourceGuard.requiresAuth = function(resource) {
      return !!Rules[resource];
    };

    /**
     * @ngdoc method
     * @name ResourceGuard#isAllowedAction
     *
     * @param {string} resource The resource to check.
     * @param {string} action The action the user wishes to perform on the resource.
     * 
     * @returns {boolean} Whether the user may access the resource.
     * 
     * @description
     * Checks the roles that are allowed to operate on this resource against every role assigned to the current
     * authenticated user. If a match is found for the desired action access is allowed.
     */
    ResourceGuard.isAllowedAction = function(resource, action) {
      var allowedRoles = Rules[resource] && Rules[resource][action];
      if (!allowedRoles) {
        return allowByDefault;
      }

      var r, roles = AuthService.getRoles();
      for (r in roles) {
        if (allowedRoles.indexOf(roles[r]) !== -1) {
          return true;
        }
      }
      return false;
    };

    return ResourceGuard;
  }];
});
