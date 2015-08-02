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

// 购车类别
app.filter('buyType', function () {
  var status = ['首次', '增购', '换购'];
  return function (input) {
    return status[input] || '未知';
  };
});

// 购车用途
app.filter('buyFor', function () {
  var status = ['家用', '商用', '其他'];
  return function (input) {
    return status[input] || '未知';
  };
});

// 购车支付方式
app.filter('paytype', function () {
  var status = ['全款', '贷款'];
  return function (input) {
    return status[input] || '未知';
  };
});