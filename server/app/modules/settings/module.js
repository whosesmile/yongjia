/*global Modules:true*/

// define module
var settingsModule = Modules.register('settingsModule', ['app']);

// config routes
settingsModule.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('settings', {
      url: '/settings',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('settings.cartype', {
      url: '/cartype',
      templateUrl: "modules/settings/templates/cartype.html",
      controller: 'cartypeController'
    })
    .state('settings.vehicle', {
      url: '/vehicle',
      templateUrl: "modules/settings/templates/vehicle.html",
      controller: 'vehicleController'
    });
});