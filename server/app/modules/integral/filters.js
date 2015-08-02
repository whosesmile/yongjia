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

// 是否车主
app.filter('isCarOwner', function () {
  var binds = ['', '否', '是'];
  return function (input) {
    return input ? binds[input] : '';
  };
});