settingsModule.factory('vehicleService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/car/carlist',
    create: '',
    update: '',
    remove: '',
    toggle: '/web/car/toggle'
  }).methods({

  });
});