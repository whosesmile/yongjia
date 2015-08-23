// 绑定行为
$('.settings .captcha .action').on('click', function () {
  var button = $(this);
  var mobile = $('input[name="mobile"]').val().trim();
  if (mobile === '') {
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
});