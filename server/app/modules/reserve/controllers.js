reserveModule.controller('recordController', function ($scope, $state, $modal, growl, recordService, controllerGenerator, $q, dialog) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, recordService, {
    title: '预约',
    property: 'name',
    createTemplate: 'modules/settings/templates/partial/create-user-form.html',
    updateTemplate: 'modules/settings/templates/partial/update-user-form.html',
    autoload: true
  });

  $scope.cancel = function (item) {
    dialog.confirm('<h4>确认要取消这条预约吗？</h4>', function () {
      recordService.setStatus(item.id, 3).then(function () {
        growl.addSuccessMessage('取消预约成功！');
        item.status = 3;
      }, function () {
        growl.addErrorMessage('取消预约失败！');
      });
    });
  };

  $scope.finish = function (item) {
    dialog.confirm('<h4>确认要完成这条预约吗？</h4>', function () {
      recordService.setStatus(item.id, 2).then(function () {
        growl.addSuccessMessage('完成预约成功！');
        item.status = 2;
      }, function () {
        growl.addErrorMessage('完成预约失败！');
      });
    });
  };

  $scope.confirm = function (item) {
    $modal.open({
      templateUrl: 'modules/reserve/templates/partial/reserve-form.html',
      controller: ['$scope',
        function (scope) {
          scope.title = '确认预约';
          scope.confirm = function () {
            recordService.setStatus(item.id, 1, scope.entity.arriveTime).then(function () {
              growl.addSuccessMessage('确认预约成功！');
              scope.$close();
              item.status = 1;
            }, function () {
              growl.addErrorMessage('确认预约失败！');
            });
          };
        }
      ]
    });
  };

});