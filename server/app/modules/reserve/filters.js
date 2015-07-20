// 类别：1维修，2保养，3看车，4年审，5其他
// 预约类型
app.filter('reserveType', function () {
  var types = [null, '维修', '保养', '看车', '年审', '其他'];
  return function (input) {
    return types[input] || '其他';
  };
});