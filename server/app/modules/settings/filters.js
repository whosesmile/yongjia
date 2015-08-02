// 状态
app.filter('vehicleStatus', function () {
  var status = ['启用', '停用'];
  return function (input) {
    return status[input];
  };
});