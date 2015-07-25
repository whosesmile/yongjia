messageModule.factory('messageService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/message/list',
    create: '/web/message/add',
    update: '/web/message/update',
    remove: '/web/message/delete',
    toggle: '/web/message/toggle'
  }).methods({

  });
});