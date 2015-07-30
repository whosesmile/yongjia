// 状态
app.filter('giftStatus', function () {
  var status = ['启用', '停用'];
  return function (input) {
    return status[input];
  };
});

// 状态
app.filter('integralStatus', function () {
  var status = ['已过期', '已生效', '未生效'];
  return function (input) {
    return status[input];
  };
});