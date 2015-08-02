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

integralModule.controller('exchangeController', function ($scope, $state, $modal, growl, exchangeService, controllerGenerator, $q, dialog) {
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

          scope.confirm = function () {
            exchangeService.exchange(scope.entity).then(function (data) {
              scope.$close();
              $scope.pageNo = 1;
              $scope.query();
              growl.addSuccessMessage(scope.title + '成功！');
            }, function (rej) {
              growl.addErrorMessage(rej.message || scope.title + '失败！');
            });
          };
        }
      ]
    });
  };
});

integralModule.controller('historyController', function ($scope, $state, $modal, growl, historyService, controllerGenerator, $q) {
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
          scope.confirm = function () {
            historyService.addPoint(scope.entity).then(function (data) {
              scope.$close();
              $scope.pageNo = 1;
              $scope.query();
              growl.addSuccessMessage(scope.title + '成功！');
            }, function (rej) {
              growl.addErrorMessage(rej.message || scope.title + '失败！');
            });
          };
        }
      ]
    });
  };
});