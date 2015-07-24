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

// 微信用户关注状态
app.filter('memberFollow', function () {
  var status = ['已取消', '关注中'];
  return function (input) {
    return status[input];
  };
});

// 微信用户绑定状态
app.filter('memberBind', function () {
  var binds = ['', '会员', '车主'];
  return function (input, status) {
    return input ? binds[status] : '非会员';
  };
});

// 微信用户绑定状态
app.filter('memberCarStatus', function () {
  var status = ['待验证', '已验证', '未通过'];
  return function (input) {
    return status[input] || '未知状态';
  };
});