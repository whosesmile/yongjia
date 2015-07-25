// 状态
app.filter('messageStatus', function () {
  var status = ['启用', '停用'];
  return function (input) {
    return status[input];
  };
});