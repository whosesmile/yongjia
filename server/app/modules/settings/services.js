settingsModule.factory('cartypeService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/common/getCarType',
    create: '/web/car/addCarType',
    update: '/web/car/updateCarType',
    remove: '/web/car/deleteCarType',
    toggle: ''
  }).methods({

  });
});

settingsModule.factory('vehicleService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/car/carlist',
    create: '/web/car/importCarModel',
    update: '',
    remove: '',
    toggle: ''
  }).methods({

  });
});