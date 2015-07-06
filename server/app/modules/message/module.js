/*global Modules:true*/

// define module
var messageModule = Modules.register('messageModule', ['app']);

// config routes
messageModule.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('message', {
      url: '/message',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('message.message', {
      url: '/message',
      templateUrl: "modules/message/templates/message.html",
      controller: 'messageController'
    });
});