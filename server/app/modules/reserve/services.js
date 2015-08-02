reserveModule.factory('recordService', function (serviceGenerator, $http) {
  return serviceGenerator().actions({
    query: '/web/appointment/list'
  }).methods({
    setStatus: function (id, status, arriveTime) {
      return $http({
        url: '/web/appointment/setStatus',
        method: 'post',
        data: {
          id: id,
          status: status,
          arriveTime: arriveTime
        }
      });
    },

    addAppointment: function (data) {
      return $http({
        url: '/web/appointment/add',
        method: 'post',
        data: data
      });
    }
  });
});