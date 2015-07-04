accountModule.factory('memberService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '1',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1',
  });
});

accountModule.factory('managerService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '1',
    create: '1',
    update: '1',
    remove: '1',
    toggle: '1',
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