$(function () {

  var carType = null;
  var carModel = null;
  var color = null;

  // 选择车型
  $('.plan .item.choose').on('click', function () {
    var item = $(this);

    // 将颜色分割成数组
    function getColors(colors) {
      var list = [];
      colors.split(',').forEach(function (item) {
        list.push({
          id: item,
          name: item,
        });
      });
      return list;
    }

    var widget = null;

    widget = Template.render('#commonSelect', {
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
        carType = $.extend({}, data);
        chooseCarStyle(data.id, function (data) {
          carModel = $.extend({}, data);
          widget = Template.render('#commonSelect', {
            key: 'name',
            value: 'name',
            list: getColors(carType.colors)
          });

          widget.on('click', '.item', function () {
            var data = $(this).data();
            color = $.extend({}, data);
            item.find('span').html(carModel.name + ' ' + color.name);
            Template.remove();
          });
        }, true);
      }, true);
    });
  });

  // 提交购车计划
  $('.plan form').on('submit', function () {
    var form = $(this)[0];
    if (form.connectMobile.value === '') {
      notice('请填写联系方式');
      return false;
    }
    if (color === null) {
      notice('请先选择车型');
      return false;
    }
    if (form.buyBudget.value === '') {
      notice('请填写您的购车预算');
      return false;
    }
    if (form.buyDate.value === '') {
      notice('请填写您的购车时间');
      return false;
    }

    // 防止重复提交
    $('footer button').prop('disabled', true).html('正在提交');

    // 提交预约
    $.post('/wx/pCustomer/add', {
      carType: carType.name,
      carModel: carModel.name,
      carColor: color.name,
      connectMobile: form.connectMobile.value,
      buyType: form.buyType.value,
      buyFor: form.buyFor.value,
      buyBudget: form.buyBudget.value,
      buyDate: new Date(form.buyDate.value).getTime(),
      payType: form.payType.value,
    }).then(function (res) {
      if (res.code === 200) {
        location.href = '/wx/view/buycarHome';
      }
      else {
        notice(res.data.message);
      }
      $('footer button').prop('disabled', false).html('提交');
    });
  });
});