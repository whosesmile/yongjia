/*global Modules:true*/

// define module
var reserveModule = Modules.register('reserveModule', ['app']);

// config routes
reserveModule.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('reserve', {
      url: '/reserve',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('reserve.record', {
      url: '/record',
      templateUrl: "modules/reserve/templates/record.html",
      controller: 'recordController'
    });
});