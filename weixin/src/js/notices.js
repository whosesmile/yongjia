$(function () {
  if ($('body').is('.notices')) {
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
        $.get('/wx/message/list', {
          pageNo: ++page,
          pageSize: size
        }).then(function (res) {
          if (res.code === 200) {
            $('.panel').append(Template.compile('#notice', res.data));
            more = res.data.list.length >= size;
          }
          resolve(res);
        });
      });
    });
  }
});