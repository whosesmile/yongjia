accountModule.controller('managerController', function ($scope, $state, $modal, growl, managerService, controllerGenerator, $q, dialog) {
  controllerGenerator($scope, managerService, {
    title: '平台用户',
    property: 'name',
    createTemplate: 'modules/account/templates/partial/user-form.html',
    updateTemplate: 'modules/account/templates/partial/user-form.html',
    autoload: true
  });

  $scope.params = {};

  $scope.searchParams = function () {
    return $scope.params;
  };

  $scope.resetPwd = function (item) {
    dialog.confirm('<h4>你确定要重置“' + item.name + '”的密码吗？</h4>', function () {
      managerService.resetPwd(item.id).then(function () {
        growl.addSuccessMessage('重置密码成功');
      });
    });
  };
});

accountModule.controller('memberController', function ($scope, $state, $modal, growl, memberService, controllerGenerator, $q) {
  controllerGenerator($scope, memberService, {
    title: '微信用户',
    property: 'name',
    autoload: true
  });

  $scope.params = {};

  $scope.searchParams = function () {
    return $scope.params;
  };

  // 查看用户车辆
  $scope.getMemberCar = function (member) {
    memberService.getMemberCar(member.id).then(function (data) {
      $modal.open({
        templateUrl: 'modules/account/templates/partial/membercars.html',
        controller: ['$scope',
          function (scope) {
            scope.list = data.entity;
          }
        ]
      });
    });
  };

  // 验证用户车辆
  $scope.checkMemberCar = function (member) {
    memberService.getMemberCar(member.id).then(function (data) {
      $modal.open({
        templateUrl: 'modules/account/templates/partial/verifycar.html',
        controller: ['$scope',
          function (scope) {
            scope.list = data.list.filter(function (item) {
              return item.status === 0;
            });

            var count = scope.list.length;

            scope.confirm = function (item) {
              memberService.passMemberCar(item.id).then(function (data) {
                $scope.query();
                growl.addSuccessMessage('已经通过验证');
                if (--count === 0) {
                  scope.$dismiss();
                }
              });
            };

            scope.failure = function (item) {
              memberService.nopassMemberCar(item.id).then(function (data) {
                $scope.query();
                growl.addSuccessMessage('已经否决验证');
                if (--count === 0) {
                  scope.$dismiss();
                }
              });
            };
          }
        ]
      });
    });
  };
});

accountModule.controller('visitorController', function ($scope, $state, $modal, growl, visitorService, controllerGenerator, $q) {
  controllerGenerator($scope, visitorService, {
    title: '潜客用户',
    autoload: true
  });

  $scope.params = {};

  $scope.searchParams = function () {
    return $scope.params;
  };
});