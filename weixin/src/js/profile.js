// 个人资料
$(function () {
  if (!$('body').is('.settings')) {
    return false;
  }

  var mobile = $('input[name="mobile"]').val().trim();

  // 绑定行为
  $('.settings .captcha .action').on('click', function () {
    var button = $(this);

    var newMobile = $('input[name="mobile"]').val().trim();

    if (newMobile === '') {
      return notice.warning("请输入合法的手机号");
    }

    // 验证码
    var element = $(this).addClass('timer');
    var remaining = 59;
    interval = setInterval(function () {
      element.text(remaining);
      remaining -= 1;
      if (remaining == -1) {
        clearInterval(interval);
        element.removeClass('timer').text('发送验证码');
      }
    }, 1000);
    element.text(remaining + 1);

    $.post('/wx/sendsms', {
      mobile: newMobile,
      type: 0
    }).then(function (res) {
      if (res.code === 200) {
        notice('验证码发送成功');
      }
      else {
        notice(res.data.message);
      }
    });
  });

  $('.settings input[name="mobile"]').on('input', function () {
    $('.settings .captcha').toggle(mobile !== $(this).val().trim());
  });

  $('.settings form').on('submit', function () {
    var form = $(this)[0];
    if (form.name.value.trim() === '') {
      notice('请输入您的名字');
      return false;
    }
    if (!/^\d{11}$/.test(form.mobile.value.trim())) {
      notice('请输入合法的手机号');
      return false;
    }
    if (form.mobile.value.trim() !== mobile && form.valiCode.value.trim().length !== 6) {
      notice('请输入验证码');
      return false;
    }

    $('footer button').prop('disabled', true).html('正在保存...');

    $.post('/wx/member/edit', $(form).serialize()).then(function (res) {
      if (res.code === 200) {
        location.href = '/wx/view/mineHome';
      }
      else {
        notice(res.data.message || '编辑个人资料失败');
        $('footer button').prop('disabled', false).html('保存');
      }
    });
    return false;
  });
});

// 添加车辆
$(function () {
  if (!$('body').is('.addcar')) {
    return false;
  }

  var type = null;
  var style = null;

  $('select[name="source"]').on('change', function () {
    type = null;
    style = null;
    $('.action.type span').html('尚未选择');
    $('.action.style span').html('尚未选择');
  });

  // 选择车型
  $('.action.type').on('click', function () {
    var item = $(this);
    chooseCarType($('select[name="source"]').val(), function (data) {
      if (type && type.id !== data.id) {
        style = null;
        $('.action.style span').html('尚未选择');
      }
      type = data;
      item.find('span').html(data.name);
    });
  });

  // 选择车款
  $('.action.style').on('click', function () {
    if (type === null) {
      return notice('请先选择车型');
    }
    var item = $(this);
    chooseCarStyle(type.id, function (data) {
      style = data;
      item.find('span').html(data.name);
    });
  });

  $('form').on('submit', function () {
    var form = $(this)[0];
    if (type === null) {
      return notice('请选择车型');
    }
    if (style === null) {
      return notice('请选择车款');
    }
    if (!form.carNumber.value) {
      return notice('请输入车牌号');
    }

    $('footer button').prop('disabled', true).html('正在提交');

    $.post('/wx/member/addCar', {
      typeName: type.name,
      modelName: style.name,
      carNumber: form.carNumber.value,
      vinNo: form.vinNo.value
    }).then(function (res) {
      if (res.code === 200) {
        location.href = '/wx/view/myCars';
      }
      else {
        notice(res.data.message || '添加车辆失败');
      }

      $('footer button').prop('disabled', false).html('提交');
    });

    return false;
  });

});