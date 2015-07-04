/*global Modules:true*/

// define module
var accountModule = Modules.register('accountModule', ['app']);

// config routes
accountModule.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('account', {
      url: '/account',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('account.member', {
      url: '/member',
      templateUrl: "modules/account/templates/member.html",
      controller: 'memberController'
    })
    .state('account.manager', {
      url: '/manager',
      templateUrl: "modules/account/templates/manager.html",
      controller: 'managerController'
    })
    .state('account.seller', {
      url: '/seller',
      templateUrl: "modules/account/templates/seller.html",
      controller: 'sellerController'
    })
    .state('account.visitor', {
      url: '/visitor',
      templateUrl: "modules/account/templates/visitor.html",
      controller: 'visitorController'
    });
});