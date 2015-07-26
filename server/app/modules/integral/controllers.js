integralModule.controller('pollController', function ($scope, $state, $modal, growl, pollService, controllerGenerator, $q) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, pollService, {
    title: '积分池',
    property: 'name',
    createTemplate: 'modules/integral/templates/partial/integral-form.html',
    updateTemplate: 'modules/integral/templates/partial/integral-form.html',
    autoload: true
  });

});

integralModule.controller('giftController', function ($scope, $state, $modal, growl, giftService, controllerGenerator, $q, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, giftService, {
    title: '礼品',
    modalsize: 'lg',
    property: 'name',
    createTemplate: 'modules/integral/templates/partial/gift-form.html',
    updateTemplate: 'modules/integral/templates/partial/gift-form.html',
    autoload: true,
    dynamicMerge: function (type, scope) {
      if (type === 'create' || type === 'update') {
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
    dialog.confirm('<h4>确定兑换吗？</h4>', function () {
      exchangeService.exchange(item.id).then(function () {
        growl.addSuccessMessage('兑换成功');
      });
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
});

integralModule.controller('projectController', function ($scope, $state, $modal, growl, projectService, controllerGenerator, $q) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, projectService, {
    title: '车型参数',
    property: 'name',
    createTemplate: '',
    updateTemplate: '',
    autoload: true
  });
});