reserveModule.factory('recordService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/appointment/list',
    create: '/user/web/user/save.json',
    update: '/user/web/user/update.json',
    remove: '/user/web/user/delete.json',
    toggle: '/user/web/user/toggle.json'
  }).methods({

  });
});