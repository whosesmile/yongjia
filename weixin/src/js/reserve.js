// 预约类型
swig.setFilter('reserveType', function (input) {
  var types = [null, '预约维修', '预约保养', '预约看车', '预约年审', '其他'];
  return types[input];
});
// 预约状态
swig.setFilter('reserveStatus', function (input) {
  var types = ['待确认', '已确认', '已完成', '已取消'];
  return types[input];
});
// 预约状态
swig.setFilter('isTestDrive', function (input) {
  return input === 1 ? '是' : '否';
});

//  开关预约内容
$(function () {
  $(document).on('click', '.reserve .item', function () {
    $(this).toggleClass('active').siblings().removeClass('active');
  });
});

// 加载更多预约
$(function () {
  if ($('body').is('.reserve')) {
    // 加载更多分页
    var page = 1;
    var size = 20;
    var more = true; // 是否有更多数据

    // 第一个回调
    listenScroll(function () {
      return new Promise(function (resolve, reject) {
        if (more === false) {
          return resolve(null);
        }
        $.get('/wx/appointment/list', {
          pageNo: ++page,
          pageSize: size
        }).then(function (res) {
          if (res.code === 200) {
            $('.list').append(Template.compile('#reserve', res.data));
            more = res.data.list.length >= size;
          }
          resolve(res);
        });
      });
    });
  }
});

// 预约维修
$(function () {
  $('.repair form').on('submit', function (e) {
    var form = $(this)[0];
    if (form.date.value === '') {
      notice('请选择预约日期');
      return false;
    }
    if (form.time.value === '') {
      notice('请选择预约时间');
      return false;
    }
    if (form.carType.value === '') {
      notice('请选择您需要维修的车辆');
      return false;
    }
    if (form.problemDesc.value === '') {
      notice('请简答描述车辆的问题');
      return false;
    }
    if (form.connectPhone.value === '') {
      notice('请输入您的联系电话');
      return false;
    }

    // 防止重复提交
    $('footer button').prop('disabled', true).html('正在提交');

    // 提交预约
    $.post('/wx/appointment/add', {
      type: 1,
      appointTime: new Date(form.date.value + ' ' + form.time.value).getTime(),
      carType: form.carType.value,
      problemDesc: form.problemDesc.value,
      connectPhone: form.connectPhone.value,
    }).then(function (res) {
      if (res.code === 200) {
        Template.render('#success');
      }
      else {
        notice(res.data.message);
      }
      $('footer button').prop('disabled', false).html('提交');
    });

    return false;
  });
});

// 预约保养 预约年审
$(function () {
  $('.baoyang form, .nianshen form').on('submit', function (e) {
    var form = $(this)[0];
    if (form.date.value === '') {
      notice('请选择预约日期');
      return false;
    }
    if (form.time.value === '') {
      notice('请选择预约时间');
      return false;
    }
    if (form.carType.value === '') {
      notice('请选择您需要预约的车辆');
      return false;
    }
    if (form.kilo.value === '') {
      notice('请输入行驶公里数');
      return false;
    }
    if (form.connectPhone.value === '') {
      notice('请输入您的联系电话');
      return false;
    }

    // 防止重复提交
    $('footer button').prop('disabled', true).html('正在提交');

    // 提交预约
    $.post('/wx/appointment/add', {
      type: $('body').is('.nianshen') ? 4 : 2,
      appointTime: new Date(form.date.value + ' ' + form.time.value).getTime(),
      carType: form.carType.value,
      kilo: form.kilo.value,
      connectPhone: form.connectPhone.value,
    }).then(function (res) {
      if (res.code === 200) {
        Template.render('#success');
      }
      else {
        notice(res.data.message);
      }
      $('footer button').prop('disabled', false).html('提交');
    });

    return false;
  });
});

// 其他
$(function () {
  $('.other form').on('submit', function (e) {
    var form = $(this)[0];
    if (form.date.value === '') {
      notice('请选择预约日期');
      return false;
    }
    if (form.time.value === '') {
      notice('请选择预约时间');
      return false;
    }
    if (form.appointContent.value === '') {
      notice('请输入预约内容');
      return false;
    }
    if (form.connectPhone.value === '') {
      notice('请输入您的联系电话');
      return false;
    }

    // 防止重复提交
    $('footer button').prop('disabled', true).html('正在提交');

    // 提交预约
    $.post('/wx/appointment/add', {
      type: 5,
      appointTime: new Date(form.date.value + ' ' + form.time.value).getTime(),
      appointContent: form.appointContent.value,
      connectPhone: form.connectPhone.value,
    }).then(function (res) {
      if (res.code === 200) {
        Template.render('#success');
      }
      else {
        notice(res.data.message);
      }
      $('footer button').prop('disabled', false).html('提交');
    });

    return false;
  });
});

// 预约看车
$(function () {

  var carType = location.search.replace('?', '').split('&').filter(function (item) {
    return item !== '';
  }).map(function (item) {
    var duple = item.split('=');
    return {
      id: null,
      name: decodeURIComponent(duple[1])
    };
  })[0];

  if (!$('body').is('.kanche')) {
    return false;
  }

  if (carType) {
    $('.item.choose').html(carType.name);
  }

  $('.item.choose').on('click', function () {
    var item = $(this);
    var widget = Template.render('#commonSelect', {
      key: 'id',
      value: 'name',
      list: [{
        id: 0,
        name: '国产'
      }, {
        id: 1,
        name: '进口'
      }]
    });

    widget.on('click', '.item', function () {
      var data = $(this).data();
      chooseCarType(data.id, function (data) {
        carType = data;
        $('.item.choose').html(data.name);
      });
    });
  });

  // 预约看车
  $('.kanche form').on('submit', function (e) {
    var form = $(this)[0];
    if (form.date.value === '') {
      notice('请选择预约日期');
      return false;
    }
    if (form.time.value === '') {
      notice('请选择预约时间');
      return false;
    }
    if (carType === null) {
      notice('请选择您需要预约的车辆');
      return false;
    }
    if (form.connectPhone.value === '') {
      notice('请输入您的联系电话');
      return false;
    }

    // 防止重复提交
    $('footer button').prop('disabled', true).html('正在提交');

    // 提交预约
    $.post('/wx/appointment/add', {
      type: 3,
      appointTime: new Date(form.date.value + ' ' + form.time.value).getTime(),
      carType: carType.name,
      isTestDrive: form.isTestDrive.value,
      connectPhone: form.connectPhone.value,
    }).then(function (res) {
      if (res.code === 200) {
        Template.render('#success');
      }
      else {
        notice(res.data.message);
      }
      $('footer button').prop('disabled', false).html('提交');
    });

    return false;
  });

});