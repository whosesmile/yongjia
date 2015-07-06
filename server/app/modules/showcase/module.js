/*global Modules:true*/

// define module
var showcaseModule = Modules.register('showcaseModule', ['app']);

// config routes
showcaseModule.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('showcase', {
      url: '/showcase',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('showcase.goods', {
      url: '/goods',
      templateUrl: "modules/showcase/templates/goods.html",
      controller: 'goodsController'
    });
});