showcaseModule.factory('goodsService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/car/carHalllist',
    create: '/web/car/addCarHall',
    update: '/web/car/updateCarHall',
    remove: '/web/car/deleteHalllist',
    toggle: '/web/car/toggleCarHall'
  }).methods({
    getCarType: function () {
      return $http({
        url: '/web/car/getCarType'
      });
    }
  });
});