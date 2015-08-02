reserveModule.controller('recordController', function ($scope, $state, $modal, growl, recordService, controllerGenerator, $q, dialog, memberService, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, recordService, {
    title: '预约',
    property: 'name',
    createTemplate: 'modules/settings/templates/partial/create-user-form.html',
    updateTemplate: 'modules/settings/templates/partial/update-user-form.html',
    autoload: true
  });

  // 新增预约
  $scope.addRecord = function () {
    $modal.open({
      templateUrl: 'modules/reserve/templates/partial/reserve-form.html',
      controller: ['$scope',
        function (scope) {
          scope.title = '新增预约';

          scope.entity = {};

          scope.types = [{
            id: 1,
            name: '维修'
          }, {
            id: 2,
            name: '保养'
          }, {
            id: 3,
            name: '看车'
          }, {
            id: 4,
            name: '年审'
          }, {
            id: 5,
            name: '其他'
          }];

          scope.$watch('entity.memberId', function () {
            memberService.getMemberCar(scope.entity.memberId).then(function (data) {
              scope.memberCars = [];
              if (scope.entity.memberId) {
                scope.memberCars = data.list.filter(function (item) {
                  return item.status === 1;
                });
              }
            });
          });

          scope.chooseMember = function () {
            commonService.selectItems({
              title: '选择客户',
              template: 'config/templates/member.partial.html',
              url: '/web/wxuser/list',
              single: true
            }).then(function (member) {
              scope.entity.memberId = member.id;
              scope.entity.memberName = member.name || member.nickname;
            });
          };

          scope.confirm = function () {
            recordService.addAppointment(scope.entity).then(function (data) {
              scope.$close();
              $scope.pageNo = 1;
              $scope.query();
              growl.addSuccessMessage('为客户预约成功！');
            }, function () {
              growl.addSuccessMessage('为客户预约失败！');
            });
          };
        }
      ]
    });
  };

  $scope.cancel = function (item) {
    dialog.confirm('<h4>确认要取消这条预约吗？</h4>', function () {
      recordService.setStatus(item.id, 3).then(function () {
        growl.addSuccessMessage('取消预约成功！');
        $scope.query();
      }, function () {
        growl.addErrorMessage('取消预约失败！');
      });
    });
  };

  $scope.finish = function (item) {
    dialog.confirm('<h4>确认要完成这条预约吗？</h4>', function () {
      recordService.setStatus(item.id, 2).then(function () {
        growl.addSuccessMessage('完成预约成功！');
        $scope.query();
      }, function () {
        growl.addErrorMessage('完成预约失败！');
      });
    });
  };

  $scope.confirm = function (item) {
    $modal.open({
      templateUrl: 'modules/reserve/templates/partial/confirm-form.html',
      controller: ['$scope',
        function (scope) {
          scope.title = '确认预约';
          scope.confirm = function () {
            recordService.setStatus(item.id, 1, scope.entity.arriveTime).then(function () {
              growl.addSuccessMessage('确认预约成功！');
              scope.$close();
              $scope.query();
            }, function () {
              growl.addErrorMessage('确认预约失败！');
            });
          };
        }
      ]
    });
  };

});