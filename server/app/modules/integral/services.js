messageModule.factory('pollService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/pool/list',
    create: '/web/pool/add',
    update: '/web/pool/update',
    remove: '/web/pool/delete',
    toggle: '/web/pool/toggle'
  }).methods({

  });
});

messageModule.factory('giftService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/gift/list',
    create: '/web/gift/add',
    update: '/web/gift/update',
    remove: '/web/gift/delete',
    toggle: '/web/gift/toggle'
  }).methods({

  });
});

messageModule.factory('exchangeService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/point/listExchange',
    create: '/web/point/add',
    update: '/web/point/update',
    remove: '/web/point/delete',
    toggle: '/web/point/toggle'
  }).methods({
    exchange: function (id) {
      return $http({
        url: '/web/point/exchange',
        method: 'post',
        data: {
          id: id
        }
      });
    }
  });
});

messageModule.factory('historyService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '1',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1'
  }).methods({

  });
});

messageModule.factory('projectService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/gift/list',
    create: '/web/gift/add',
    update: '/web/gift/update',
    remove: '/web/gift/delete',
    toggle: '/web/gift/toggle'
  }).methods({

  });
});