// 角色
app.filter('memberRole', function () {
  var roles = [null, '管理员', '主管', '客服', '销售'];
  return function (input) {
    return roles[input];
  };
});

// 状态
app.filter('memberStatus', function () {
  var status = ['启用', '停用'];
  return function (input) {
    return status[input];
  };
});