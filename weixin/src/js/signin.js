$(function () {
  $('footer button').on('click', function () {
    var button = $(this);
    var originText = button.html();
    button.prop('disabled', true).html('正在处理...');
    $.post('/wx/member/sign').then(function (res) {
      if (res.code === 200) {
        location.reload();
      }
      else {
        notice(res.data.message || '签到失败');
        button.prop('disabled', false).html(originText);
      }
    });
  });
});