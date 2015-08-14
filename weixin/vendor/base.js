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

// 需要注册会员
$(document).on('click', '.login-required', function () {
  Template.render('#loginRequired');
});

// 需要成为车主
$(document).on('click', '.owner-required', function () {
  Template.render('#ownerRequired');
});

// 监听滚动回调
(function (global) {

  var fns = [];

  // 给文档绑定滚动事件
  var addLisener = function () {
    // 滚动临界点
    var cordon = 200;
    // 防止重复请求
    var loading = false;
    var element = document.documentElement;
    $(document).on('scroll', function (e) {
      if (!loading) {
        var range = Math.max(element.scrollHeight - element.offsetHeight, 0);
        var distance = range - document.body.scrollTop;
        if (range !== 0 && distance <= cordon) {
          loading = true;
          fireCallback().then(function (data) {
            loading = false;
            return data
          });
        }
      }
    });

    addLisener = $.noop;
  };

  // 调用注册回调
  var fireCallback = function () {
    return new Promise(function (resolve, reject) {
      var num = fns.length;
      var list = [];
      fns.forEach(function (fn) {
        fn().then(function (res) {
          list.push(res);
          --num;
          if (num === 0) {
            resolve(list);
          }
        });
      });
    });

  };

  // 添加滚动事件
  global.listenScroll = function (fn) {
    if (typeof fn === 'function' && fns.indexOf(fn) === -1) {
      fns.push(fn);
      addLisener();
    }
  };

})(window);

// 通用组件 选择车型
(function (global) {

  // 选择来源
  var chooseSource = function (callback) {
    var widget = Template.render('#commonSelect', {
      title: '进口/国产',
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
      chooseCarType($(this).data().id, callback);
    });
  };

  // 选择车型
  global.chooseCarType = function (data, callback) {
    $.get('/common/getCarType', {
      importFlag: typeof data === 'object' ? data.id : data
    }).then(function (res) {
      if (res.code !== 200) {
        return notice(res.data.message || '加载数据失败');
      }

      var widget = Template.render('#commonSelect', {
        title: '选择车型',
        key: 'id',
        value: 'carTypeName',
        list: res.data.list
      });

      widget.on('click', '.item', function () {
        Template.remove();
        if (callback) {
          callback($(this).data());
        }
      });
    });
  };

  // 选择款式
  global.chooseCarStyle = function (data, callback) {
    $.get('/common/getCarModel', {
      id: typeof data === 'object' ? data.id : data
    }).then(function (res) {
      if (res.code !== 200) {
        return notice(res.data.message || '加载数据失败');
      }

      var widget = Template.render('#commonSelect', {
        title: '选择款式',
        key: 'id',
        value: 'carModelName',
        list: res.data.list
      });

      widget.on('click', '.item', function () {
        Template.remove();
        if (callback) {
          callback($(this).data());
        }
      });
    });
  };

  global.chooseVehicle = function (options) {
    if (options.typeId !== undefined) {
      chooseCarStyle(options.typeId, options.callback);
    }
    else if (options.sourceId !== undefined) {
      chooseCarType(options.sourceId, function (id) {
        chooseCarStyle(id, options.callback);
      });
    }
    else {
      chooseSource(options.callback, function (id) {
        chooseCarType(options.sourceId, function (id) {
          chooseCarStyle(id, options.callback);
        });
      });
    }
  };
})(window);