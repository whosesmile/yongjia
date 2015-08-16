$(function () {
  $('.login form').on('submit', function () {
    var form = $(this)[0];

    if (form.account.value === '') {
      notice('请输入您的账户');
      return false;
    }
    if (form.pwd.value === '') {
      notice('请输入您的密码');
      return false;
    }

    // 防止重复提交
    $('.submit.button').prop('disabled', true).html('正在登录');

    // 提交预约
    $.post('/wx/saler/login', {
      account: form.account.value,
      pwd: form.pwd.value,
    }).then(function (res) {
      if (res.code === 200) {
        location.href = '/wx/view/mineHome';
      }
      else {
        notice(res.data.message);
      }
      $('.submit.button').prop('disabled', false).html('登录');
    });

    return false;
  });
});