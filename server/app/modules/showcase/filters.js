// 来源
app.filter('goodsFrom', function () {
  var status = ['国产', '进口'];
  return function (input) {
    return status[input];
  };
});

// 状态
app.filter('goodsStatus', function () {
  var status = ['启用', '停用'];
  return function (input) {
    return status[input];
  };
});