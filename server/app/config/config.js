/* global serialize:true */

// 关闭HTML安全验证
app.config(['$sceProvider',
  function ($sceProvider) {
    $sceProvider.enabled(false);
  }
]);

// 配置ui-datepicker
app.config(function (datepickerConfig, datepickerPopupConfig) {
  datepickerConfig.showWeeks = false;
  datepickerPopupConfig.showButtonBar = false;
});

// 复写ui-pagination
app.config(function ($provide) {
  $provide.decorator('paginationDirective', function ($delegate) {
    $delegate[0].templateUrl = 'config/templates/pagination.partial.html';
    return $delegate;
  });
});

// 配置angular-growl
app.config(function (growlProvider) {
  growlProvider.onlyUniqueMessages(true);
  growlProvider.globalTimeToLive(4000);
  growlProvider.globalEnableHtml(false); // ngSanitize
});

// 配置ui-bootstrap
app.config(function (paginationConfig) {
  paginationConfig.directionLinks = true;
  paginationConfig.boundaryLinks = true;
  paginationConfig.maxSize = 10;
  paginationConfig.firstText = '首页';
  paginationConfig.lastText = '尾页';
  paginationConfig.previousText = '上一页';
  paginationConfig.nextText = '下一页';
});

// 配置tinymce, 由于ng对外没有提供已注册的module列表，访问未注册的模块会抛异常
try {
  if (angular.module('ui.tinymce')) {
    app.run(function (uiTinymceConfig) {
      angular.extend(uiTinymceConfig, {
        menubar: false,
        statusbar: false,
        paste_text_sticky_default: true,
        paste_text_sticky: true,
        plugins: 'upload2 textcolor link fullscreen',
        toolbar: "bold underline strikethrough | alignleft aligncenter alignright bullist numlist | blockquote link upload removeformat | fullscreen",
        toolbar_items_size: 'small',
        relative_urls: false,
        height: 300,
        language_url: "http://front.qdingnet.com/public/tinymce-i18n/langs/zh_CN.js",
        fontsize_formats: "10px 12px 14px 18px 24px 36px",
        style_formats: [{
          title: 'H1',
          block: 'h1'
        }, {
          title: 'H2',
          block: 'h2'
        }, {
          title: 'H3',
          block: 'h3'
        }, {
          title: 'H4',
          block: 'h4'
        }]
      });
    });
  }
}
catch (e) {}

// HTTP拦截器
app.config(function ($httpProvider) {
  // POST method use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // Override transformRequest to serialize form data like jquery
  $httpProvider.defaults.transformRequest = [

    function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? serialize(data) : data;
    }
  ];

  // Add interceptor
  $httpProvider.interceptors.push(function ($q, $injector, growl, $rootScope) {
    return {
      request: function (config) {
        // REST 风格路由重写
        var rules = config.url.match(/:(\w+)/g);
        if (rules !== null) {
          angular.forEach(rules, function (rule) {
            var name = rule.substring(1);
            if (config.params && config.params.hasOwnProperty(name)) {
              config.url = config.url.replace(rule, config.params[name]);
              delete config.params[name];
            }
            else if (config.data && config.data.hasOwnProperty(name)) {
              config.url = config.url.replace(rule, config.data[name]);
              delete config.data[name];
            }
          });
        }
        return $q.when(config);
      },
      response: function (response) {
        if (angular.isObject(response.data)) {
          var res = response.data;
          // 兼容旧数据格式 {code:0, message: '', data: {...}} --> {code:200, data: {message: '', ...}}
          res.data = res.data || {};
          res.data.message = res.data.message || res.message;

          // 约定的未登录状态码
          if (res.code === 401) {
            $rootScope.member = null;
            $rootScope.$emit('loginRequired');
            return $q.reject({
              message: '会话过期，请重新登录！'
            });
          }
          // 约定的没权限
          if (res.code === 403) {
            $injector.get('$state').go('noauth');
            return $q.reject({
              message: '你无权进行相关操作'
            });
          }

          // 默认自动拆包
          if (response.config.autoparse !== false) {
            return [0, 200].indexOf(res.code) !== -1 ? $q.when(res.data) : $q.reject(res.data);
          }

          return $q.when(response.data);
        }
        return $q.when(response);
      },
      requestError: function (rejection) {
        return $q.reject(rejection);
      },
      responseError: function (rejection) {
        return $q.reject(rejection);
      }
    };
  });
});

// 通用路由
app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/welcome");

  $stateProvider
    .state('welcome', {
      url: "/welcome",
      templateUrl: "config/templates/welcome.html"
    })
    .state('login', {
      url: '/login',
      templateUrl: "config/templates/login.html",
      controller: 'loginController'
    })
    .state('logout', {
      url: '/logout',
      template: '<div class="center-block alert alert-info text-center" style="width:300px;">正在登出...</div>',
      controller: 'logoutController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: "config/templates/profile.html",
      controller: 'profileController'
    });

});

app.constant('EXCLUDES', ['login', 'logout']);

// 获取静态域名
app.run(function ($rootScope) {
  var temp = document.createElement('a');
  temp.setAttribute('href', document.querySelector('link[rel="stylesheet"]').getAttribute('href'));
  $rootScope.shost = temp.protocol + '//' + temp.host;
  $rootScope.roles = [{
    id: 1,
    name: '管理员'
  }, {
    id: 2,
    name: '主管'
  }, {
    id: 3,
    name: '客服'
  }, {
    id: 4,
    name: '销售'
  }];
});

// 重定向到登录
app.run(function ($rootScope, $state, $modalStack, EXCLUDES) {
  $rootScope.next = location.pathname + '#/welcome';

  $rootScope.$on('loginRequired', function () {
    // 关闭所有弹窗
    $modalStack.dismissAll();

    // 记录当前state以便登陆后跳转回来
    $rootScope.next = location.pathname + location.hash;
    // 防止重复跳转到登陆登出页面
    if (EXCLUDES.indexOf($state.current.name) !== -1) {
      $rootScope.next = location.pathname + '#/welcome';
    }

    $state.go('login');
  });
});

app.value('menubar', [

  {
    "name": "系统参数",
    "menus": [{
      "sref": "#/settings/vehicle",
      "name": "车型参数",
    }]
  },

  {
    "name": "用户管理",
    "menus": [{
      "sref": "#/account/manager",
      "name": "平台用户",
    }, {
      "sref": "#/account/member",
      "name": "微信用户",
    }, {
      "sref": "#/account/visitor",
      "name": "潜客记录",
    }, ]
  },

  {
    "name": "积分管理",
    "menus": [{
      "sref": "#/integral/poll",
      "name": "积分池",
    }, {
      "sref": "#/integral/project",
      "name": "积分项目",
    }, {
      "sref": "#/integral/gift",
      "name": "礼品管理",
    }, {
      "sref": "#/integral/exchange",
      "name": "兑换记录",
    }, {
      "sref": "#/integral/history",
      "name": "积分记录",
    }, ]
  },

  {
    "name": "预约服务",
    "menus": [{
      "sref": "#/reserve/record",
      "name": "预约记录",
    }]
  }, {
    "name": "展厅设置",
    "menus": [{
      "sref": "#/showcase/goods",
      "name": "展厅设置",
    }]
  }, {
    "name": "消息管理",
    "menus": [{
      "sref": "#/message/message",
      "name": "资讯管理",
    }]
  },

]);

// 加载当前登录用户
app.run(function ($rootScope, $state, commonService, growl, EXCLUDES, menubar, $timeout) {
  $rootScope.$on('$initialize', function () {
    if (EXCLUDES.indexOf($state.current.name) !== -1) {
      location.href = $rootScope.next;
    }

    commonService.loadUser().then(function (res) {
      $rootScope.member = res.entity;
    }, function (rej) {
      $rootScope.$emit('loginRequired');
      $state.go('login');
    });

    // 展开激活的分组
    $timeout(function () {
      var href = $state.href($state.current.name, $state.current.params);
      menubar.forEach(function (group) {
        group.menus = group.menus || [];
        group.menus.forEach(function (item) {
          item.sref = item.sref || '';
          if (href === item.sref.substring(item.sref.indexOf('#'))) {
            group.active = item.active = true;
          }
        });
      });
    }, 0);

  });
});

app.value('province', [{
  id: 1,
  name: '安徽'
}, {
  id: 2,
  name: '澳门'
}, {
  id: 3,
  name: '北京'
}, {
  id: 4,
  name: '重庆'
}, {
  id: 5,
  name: '福建'
}, {
  id: 6,
  name: '甘肃'
}, {
  id: 7,
  name: '广东'
}, {
  id: 8,
  name: '广西'
}, {
  id: 9,
  name: '贵州'
}, {
  id: 10,
  name: '海南'
}, {
  id: 11,
  name: '河北'
}, {
  id: 12,
  name: '黑龙江'
}, {
  id: 13,
  name: '河南'
}, {
  id: 14,
  name: '湖北'
}, {
  id: 15,
  name: '湖南'
}, {
  id: 16,
  name: '江苏'
}, {
  id: 17,
  name: '江西'
}, {
  id: 18,
  name: '吉林'
}, {
  id: 19,
  name: '辽宁'
}, {
  id: 20,
  name: '内蒙古'
}, {
  id: 21,
  name: '宁夏'
}, {
  id: 22,
  name: '青海'
}, {
  id: 23,
  name: '山东'
}, {
  id: 24,
  name: '上海'
}, {
  id: 25,
  name: '山西'
}, {
  id: 26,
  name: '陕西'
}, {
  id: 27,
  name: '四川'
}, {
  id: 28,
  name: '台湾'
}, {
  id: 29,
  name: '天津'
}, {
  id: 30,
  name: '香港'
}, {
  id: 31,
  name: '新疆'
}, {
  id: 32,
  name: '西藏'
}, {
  id: 33,
  name: '云南'
}, {
  id: 34,
  name: '浙江'
}]);