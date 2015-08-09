$(function () {
  if (!$('body').is('.settings')) {
    return false;
  }
  var mobile = $('input[name="mobile"]').val().trim();

  $('.settings .captcha .action').on('click', function () {
    var button = $(this);
    var mobile = $('input[name="mobile"]').val().trim();
    if (/^\d{11}$/.test(mobile)) {
      $.post('/wx/sendsms', {
        mobile: mobile,
        type: 0
      }).then(function (res) {
        if (res.code === 200) {
          notice('验证码发送成功');
        }
        else {
          notice('验证码发送失败');
        }
      });
    }
    else {
      notice('请输入合法的手机号');
    }
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