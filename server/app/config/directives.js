/* 页面模板 */
app.directive('csLayout', function ($rootScope, EXCLUDES) {
  return {
    restrict: 'A',
    replace: false,
    transclude: true,
    templateUrl: 'config/templates/layout.partial.html',
    link: function (scope, element, attrs) {
      var hyphenate = function (name) {
        return name.replace(/[._]/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
      };

      $rootScope.$on('$stateChangeStart', function (e, state, params, source, srouceParams) {
        $rootScope.$loaded = true;

        $rootScope.$layout = EXCLUDES.indexOf(state.name) === -1;
        element.attr('class', hyphenate(state.name)).toggleClass('layout', $rootScope.$layout).removeAttr('style');

        // 更换图纸 目前有15张
        // if (state.name === 'login') {
        //   var num = Math.ceil(Math.random(0, 1) * 15);
        //   element.attr('style', 'background-image:url(' + $rootScope.shost + '/public/wallpaper/' + num + '.jpg)');
        // }

        // 开始初始化
        if ($rootScope.$layout && !$rootScope.member) {
          $rootScope.$emit('$initialize');
        }
      });

    }
  };
});

/* 左侧菜单 */
app.directive('csMenubar', function ($rootScope, $state, menubar, commonService) {
  return {
    restrict: 'A',
    replace: false,
    scope: {},
    templateUrl: 'config/templates/menubar.partial.html',
    link: function (scope, element, attrs) {
      scope.menubar = menubar;

      scope.toggleGroup = function (menus) {
        angular.forEach(scope.menubar, function (group) {
          if (group !== menus) {
            group.active = false;
          }
        });
        menus.active = !menus.active;
      };

      scope.toggleMenu = function (menu) {
        angular.forEach(scope.menubar, function (group) {
          group.menus.forEach(function (item) {
            if (item !== menu) {
              item.active = false;
            }
          });
        });
        menu.active = !menu.active;
      };
    }
  };
});

/**
 * 动画效果
 */
app.directive('csAnimate', function () {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {
      var actions = ['swing', 'pulse', 'flip', 'tada', 'bounce', 'bounceIn'];
      var animate = actions[Math.floor(actions.length * Math.random(0, 1))];
      $(element).addClass('animated').addClass(animate);
    }
  };
});

// 图片错误处理
app.directive('csError', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.addClass('loadimg');

      element.on('error', function () {
        element.attr('src', attrs.csError);
      });
      element.on('load', function () {
        element.removeClass('loadimg');
      });
    }
  };
});

/**
 * 自动聚焦...
 */
app.directive('csFocus', function ($timeout) {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element) {
      var times = 0;
      (function focus() {
        if (element.is(':visible')) {
          element.focus();
        }
        else if (times++ < 1) {
          $timeout(focus, 200);
        }
      }());
    }
  };
});

/**
 * 防止自动完成不触发form验证
 */
app.directive("csAutofill", function ($timeout) {
  return {
    require: '^ngModel',
    link: function (scope, element, attrs, ngModel) {
      var times = 0;
      var timer = null;
      var origin = element.val();

      (function fill() {
        if (element.val() !== origin) {
          ngModel.$setViewValue(element.val());
          element.focus();
        }
        else if (times++ < 3) {
          $timeout.cancel(timer);
          timer = $timeout(fill, 200);
        }
      }());

      scope.$on('$destroy', function () {
        $timeout.cancel(timer);
      });
    }
  };
});

// 多选checkbox 填值进入Array
app.directive('csCheckbox', function () {
  return {
    restrict: 'A',
    replace: false,
    scope: {
      list: '=',
      fill: '=',
      label: '@',
      value: '@'
    },
    templateUrl: 'config/templates/checkbox.partial.html',
    link: function (scope, element, attrs) {
      scope.fill = scope.fill || [];
      scope.toggleValue = function (value) {
        var index = scope.fill.indexOf(value);
        if (index > -1) {
          scope.fill.splice(index, 1);
        }
        else {
          scope.fill.push(value);
        }
      };
    }
  };
});