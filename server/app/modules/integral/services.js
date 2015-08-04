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

messageModule.factory('signinService', function ($http) {
  return {
    getConfig: function (month) {
      return $http({
        url: '/web/pool/getSignConfig',
        method: 'get',
        params: {
          month: month
        }
      });
    },

    setConfig: function (month, times, point) {
      return $http({
        url: '/web/pool/setSignConfig',
        method: 'post',
        data: {
          month: month,
          times: times,
          point: point
        }
      });
    }
  };
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
    exchange: function (data) {
      return $http({
        url: '/web/point/addExchange',
        method: 'post',
        data: data
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