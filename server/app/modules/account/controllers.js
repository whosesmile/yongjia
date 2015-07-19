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
    createTemplate: 'modules/account/templates/partial/create-user-form.html',
    updateTemplate: 'modules/account/templates/partial/update-user-form.html',
    autoload: true
  });
});

accountModule.controller('visitorController', function ($scope, $state, $modal, growl, visitorService, controllerGenerator, $q) {
  controllerGenerator($scope, visitorService, {
    title: '潜客用户',
    property: 'name',
    createTemplate: 'modules/account/templates/partial/create-user-form.html',
    updateTemplate: 'modules/account/templates/partial/update-user-form.html',
    autoload: true
  });
});