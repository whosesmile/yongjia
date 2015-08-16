$(function () {
  $('footer button').on('click', function () {

    // 防止重复提交
    $('footer button').prop('disabled', true).html('正在提交');

    // 提交预约
    $.post('/wx/pCustomer/grab', {
      pCustomerId: $('.item:first').data('id')
    }).then(function (res) {
      if (res.code === 200) {
        Template.render('#success');
      }
      else {
        notice(res.data.message);
      }
      $('footer button').prop('disabled', false).html('抢客户');
    });

    return false;
  });
});