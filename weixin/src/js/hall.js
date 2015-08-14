$(function () {
  if ($('body').is('.styles')) {
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
        $.get('/wx/car/hallList', {
          pageNo: ++page,
          pageSize: size
        }).then(function (res) {
          if (res.code === 200) {
            $('.panel').append(Template.compile('#hall', res.data));
            more = res.data.list.length >= size;
          }
          resolve(res);
        });
      });
    });
  }
});

$(function () {
  // 顶部轮播
  new Swipe($('.slider.swipe')[0], {
    startSlide: 0,
    speed: 300,
    auto: 4000,
    pagination: true
  });
});