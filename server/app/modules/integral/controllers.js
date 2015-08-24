integralModule.controller('pollController', function ($scope, $state, $modal, growl, pollService, controllerGenerator, $q) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, pollService, {
    title: '积分池',
    property: 'name',
    createTemplate: 'modules/integral/templates/partial/integral-form.html',
    updateTemplate: 'modules/integral/templates/partial/integral-form.html',
    autoload: true
  });

  $scope.append = function (item) {
    $modal.open({
      templateUrl: 'modules/integral/templates/partial/integral-append.html',
      controller: ['$scope',
        function (scope) {
          scope.title = '追加积分';
          scope.entity = {
            id: item.id
          };
          scope.confirm = function () {
            pollService.append(scope.entity).then(function (res) {
              $scope.query();
              growl.addSuccessMessage('追加积分成功！');
              scope.$close();
            }, function (rej) {
              growl.addErrorMessage(rej.message || scope.title + '失败！');
              return $q.reject(rej);
            });
          };
        }
      ]
    });
  };

});

integralModule.controller('signinController', function ($scope, $state, $modal, growl, signinService) {

  $scope.scores = [];

  var date = new Date();
  var year = date.getFullYear();
  var dayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var range = function (limit) {
    var days = [];
    for (var i = 1; i <= limit; i++) {
      days.push(i);
    }
    return days;
  };

  // 未来5年
  $scope.years = [year, year + 1, year + 2, year + 3, year + 4];
  $scope.monthes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  $scope.year = date.getFullYear();
  $scope.month = date.getMonth();
  $scope.days = range(dayOfMonth[date.getMonth()]);

  $scope.$watch('year+month', function (year) {
    var year = $scope.year;
    var month = $scope.month;
    $scope.days = range(dayOfMonth[month]);
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      $scope.days = range(29);
    }

    // 签到服务
    signinService.getConfig(year + '-' + (month + 1)).then(function (data) {
      $scope.config = data.list;
    });
  });

  $scope.setConfig = function (e, times) {
    var point = e.target.value || 0;
    signinService.setConfig($scope.year + '-' + ($scope.month + 1), times, point).then(function (data) {
      $scope.config[times - 1].point = point;
      e.target.value = point;
      growl.addSuccessMessage('签到积分设置成功');
    }, function (rej) {
      e.target.value = $scope.config[times - 1].point;
      growl.addErrorMessage(rej.message || '签到积分设置失败');
    });
  };

});

integralModule.controller('giftController', function ($scope, $state, $modal, growl, giftService, controllerGenerator, $q, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, giftService, {
    title: '礼品',
    modalsize: 'lg',
    property: 'name',
    createTemplate: 'modules/integral/templates/partial/gift-form.html',
    updateTemplate: 'modules/integral/templates/partial/gift-form.html',
    detailsTemplate: 'modules/integral/templates/partial/gift-details.html',
    autoload: true,
    dynamicMerge: function (type, scope) {
      if (type === 'create' || type === 'update') {
        if (type === 'update') {
          giftService.details(scope.entity).then(function (data) {
            scope.entity = data.entity;
          });
        }
        scope.upload = function ($files) {
          return commonService.upload($files).then(function (url) {
            scope.entity.pic = url;
          });
        };
      }
    }
  });

  $scope.params = {};

  $scope.searchParams = function () {
    return $scope.params;
  };
});

integralModule.controller('exchangeController', function ($scope, $state, $modal, growl, exchangeService, controllerGenerator, $q, dialog, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, exchangeService, {
    title: '兑换',
    property: 'name',
    createTemplate: '',
    updateTemplate: '',
    autoload: true
  });

  $scope.exchange = function (item) {
    $modal.open({
      templateUrl: 'modules/integral/templates/partial/exchange-form.html',
      controller: ['$scope',
        function (scope) {
          scope.title = '兑换礼品';
          scope.entity = {
            action: '礼品'
          };

          scope.chooseMember = function () {
            commonService.selectItems({
              title: '选择客户',
              template: 'config/templates/member.partial.html',
              url: '/web/wxuser/list?isMember=1',
              single: true
            }).then(function (member) {
              scope.entity.memberId = member.id;
              scope.entity.memberName = member.name || member.nickname;
            });
          };

          scope.chooseGift = function () {
            commonService.selectItems({
              title: '选择礼品',
              template: 'config/templates/gift.partial.html',
              url: '/web/gift/list?status=0',
              single: true
            }).then(function (gift) {
              scope.entity.actionContent = gift.name;
              scope.entity.point = gift.point;
            });
          };

          scope.confirm = function () {
            scope.entity.processing = true;
            exchangeService.exchange(scope.entity).then(function (data) {
              scope.$close();
              $scope.pageNo = 1;
              $scope.query();
              growl.addSuccessMessage(scope.title + '成功！');
            }, function (rej) {
              growl.addErrorMessage(rej.message || scope.title + '失败！');
            }).finally(function () {
              scope.entity.processing = false;
            });
          };
        }
      ]
    });
  };
});

integralModule.controller('historyController', function ($scope, $state, $modal, growl, historyService, controllerGenerator, $q, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, historyService, {
    title: '车型参数',
    property: 'name',
    createTemplate: '',
    updateTemplate: '',
    autoload: true
  });

  // 为客户修改积分
  $scope.change = function () {
    $modal.open({
      templateUrl: 'modules/integral/templates/partial/change-form.html',
      controller: ['$scope',
        function (scope) {
          scope.title = '修改客户积分';
          scope.entity = {
            action: '预约'
          };

          scope.chooseMember = function () {
            commonService.selectItems({
              title: '选择客户',
              template: 'config/templates/member.partial.html',
              url: '/web/wxuser/list?isMember=1',
              single: true
            }).then(function (member) {
              scope.entity.memberId = member.id;
              scope.entity.memberName = member.name || member.nickname;
            });
          };

          scope.confirm = function () {
            scope.entity.processing = true;
            historyService.addPoint(scope.entity).then(function (data) {
              scope.$close();
              $scope.pageNo = 1;
              $scope.query();
              growl.addSuccessMessage(scope.title + '成功！');
            }, function (rej) {
              growl.addErrorMessage(rej.message || scope.title + '失败！');
            }).finally(function () {
              scope.entity.processing = false;
            });
          };
        }
      ]
    });
  };
});