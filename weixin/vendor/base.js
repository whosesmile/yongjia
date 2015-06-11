// tap event
$(function () {
  FastClick.attach(document.body);
});

// 截取字符串
swig.setFilter('substring', function (input, i, j) {
  return String(input).substring(i, j);
});

swig.setFilter('currency', function (input, size, symbol) {
  return input === undefined ? '' : (symbol || '￥') + Number(input).toFixed(size === undefined ? 2 : size);
});

// 根据屏幕宽度适配字体大小
$(window).on('resize', function () {
  var width = Math.min(document.documentElement.clientWidth, 750);
  $('html').css('font-size', (width / 750 * 32.8125) + 'px').css('visibility', 'visible');
}).triggerHandler('resize');

// 加载完成后重新计算一次
$(function () {
  $(window).triggerHandler('resize');
});

// IOS键盘隐藏时 触发重绘机制
$(function () {
  $(document).on('blur', 'textarea,input[type="text"],input[type="password"],input[type="tel"],input[type="email"],input[type="number"]', function () {
    window.scrollTo(0, window.scrollY + 1);
    setTimeout(function () {
      window.scrollTo(0, window.scrollY - 1);
    }, 20);
  });
});

// 通知
(function () {
  var timer = null;
  var lasted = 4000;
  var instance = null;

  var notice = window.notice = function (message, type) {
    if (instance === null) {
      instance = $('<div class="js-notice" />').appendTo('body');
    }
    type = type || 'normal';
    instance.removeClass('overdue').html('<span class="' + type + '">' + message + '</span>');
    clearTimeout(timer);
    timer = setTimeout(function () {
      instance.addClass('overdue');
    }, lasted);
  };

  // 添加快捷方式
  ['message', 'success', 'warning', 'failure'].forEach(function (name) {
    notice[name] = function (message) {
      notice(message, name);
    };
  });
})();

// 下拉菜单
$(function () {
  $('.dropdown .toggle').on('click', function (e) {
    $(this).parents('.dropdown').eq(0).find('.menubar').toggle();
    e.stopPropagation();
  });
  $('.dropdown .menubar').on('click', function (e) {
    setTimeout(function () {
      $(this).hide();
    }.bind(this), 0);
    e.stopPropagation();
  });
  $(document).on('click', function () {
    $('.dropdown .menubar').hide();
  });
});

// Template
(function () {

  // 缓存
  var templateCache = {};

  // 当前激活的实例
  var instance = null;

  var Template = window.Template = {

    compile: function (tplId, context) {
      var template = templateCache[tplId] || swig.compile($(tplId).html());
      return template(context).toString();
    },

    render: function (tplId, context) {
      this.remove();
      instance = $(this.compile(tplId, context));
      $('body').append(instance);
      return instance;
    },

    hide: function () {
      if (instance) {
        instance.hide();
      }
    },

    remove: function () {
      if (instance) {
        instance.remove();
        instance = null;
      }
    }
  };

})();

// 点击空白 关闭遮罩
$(document).on('click', '.masklayer', function (e) {
  var target = $(e.target);
  if (target.is('.masklayer')) {
    $(this).hide();
    Template.hide();
  }
});

// 点击触发元素 关闭遮罩
$(document).on('click', '.masklayer [data-dismiss],.masklayer .cancel', function (e) {
  var target = $(e.target);
  if (target.is('[data-dismiss]') || target.is('.cancel')) {
    $(this).parents('.masklayer').hide();
    Template.hide();
  }
});