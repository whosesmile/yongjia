messageModule.factory('pollService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/pool/list',
    create: '/web/pool/add',
    update: '/web/pool/update',
    remove: '/web/pool/delete',
    toggle: '/web/pool/toggle'
  }).methods({
    append: function (data) {
      return $http({
        url: '/web/pool/charge',
        method: 'post',
        data: data
      });
    }
  });
});

messageModule.factory('giftService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/gift/list',
    create: '/web/gift/add',
    update: '/web/gift/update',
    remove: '/web/gift/delete',
    toggle: '/web/gift/toggle',
    details: '/web/gift/get'
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
    query: '/web/point/listPoint',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1'
  }).methods({
    addPoint: function (data) {
      return $http({
        url: '/web/point/addPoint',
        method: 'post',
        data: data
      });
    }
  });
});