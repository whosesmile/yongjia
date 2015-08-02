// 类别：1维修，2保养，3看车，4年审，5其他
app.filter('reserveType', function () {
  var types = [null, '维修', '保养', '看车', '年审', '其他'];
  return function (input) {
    return types[input] || '其他';
  };
});

// 0 待确认，1 待实施，2已完成，3 已取消
app.filter('reserveStatus', function () {
  var types = ['待确认', '待实施', '已完成', '已取消'];
  return function (input) {
    return types[input] || '其他';
  };
});