// 顶部轮播
$(function () {
  new Swipe($('.slider.swipe')[0], {
    startSlide: 0,
    speed: 300,
    auto: 4000,
    pagination: true
  });
});

$(function () {
  $('.item.reserve').on('click', function () {
    Template.render('#reserve');
  });
});