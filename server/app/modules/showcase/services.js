showcaseModule.factory('goodsService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/car/carHalllist',
    create: '/web/car/addCarHall',
    update: '/web/car/updateCarHall',
    remove: '/web/car/deleteHalllist',
    toggle: '/web/car/toggleCarHall',
    details: '/web/car/getCarHallDetail',
  }).methods({
    getCarType: function () {
      return $http({
        url: '/common/getCarType'
      });
    },
    getCarModel: function (id) {
      return $http({
        url: '/common/getCarModel',
        params: {
          id: id
        }
      });
    }
  });
});