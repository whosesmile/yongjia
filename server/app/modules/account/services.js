accountModule.factory('managerService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/user/list',
    create: '/web/user/add',
    update: '/web/user/update',
    toggle: '/web/user/toggle',
  }).methods({
    resetPwd: function (id) {
      return $http({
        url: '/web/user/resetPwd',
        method: 'post',
        data: {
          id: id
        }
      });
    }
  });
});

accountModule.factory('memberService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/wxuser/list',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1',
  }).methods({
    getMemberCar: function (id) {
      return $http({
        url: '/web/wxuser/getMemberCar',
        params: {
          memberId: id
        }
      });
    },
    passMemberCar: function (id) {
      return $http({
        url: '/web/wxuser/passMemberCar',
        params: {
          memberCarId: id
        }
      });
    },
    nopassMemberCar: function (id) {
      return $http({
        url: '/web/wxuser/nopassMemberCar',
        params: {
          memberCarId: id
        }
      });
    },
  });

});

accountModule.factory('visitorService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '1',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1',
  });
});

accountModule.factory('sellerService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '1',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1',
  });
});