/*global Modules:true*/

// define module
var integralModule = Modules.register('integralModule', ['app']);

// config routes
integralModule.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('integral', {
      url: '/integral',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('integral.poll', {
      url: '/poll',
      templateUrl: "modules/integral/templates/poll.html",
      controller: 'pollController'
    })
    .state('integral.gift', {
      url: '/gift',
      templateUrl: "modules/integral/templates/gift.html",
      controller: 'giftController'
    })
    .state('integral.exchange', {
      url: '/exchange',
      templateUrl: "modules/integral/templates/exchange.html",
      controller: 'exchangeController'
    })
    .state('integral.history', {
      url: '/history',
      templateUrl: "modules/integral/templates/history.html",
      controller: 'historyController'
    });
});