app.controller('loginController', function ($window, $scope, $state, growl, commonService) {
  $scope.remember = false;
  $scope.login = function (name, pwd) {
    $scope.processing = true;

    $scope.$emit('$initialize');
    $state.go('welcome');
    // commonService.login($scope.name, $scope.pwd, $scope.remember).then(function (res) {
    //   $scope.$emit('$initialize');
    //   $state.go('welcome');
    // }, function (rej) {
    //   $scope.error = true;
    //   $scope.message = rej.message;
    // })['finally'](function () {
    //   $scope.processing = false;
    // });
  };

  if (!(/chrome/i.test($window.navigator.userAgent))) {
    growl.addErrorMessage("为了更好的体验，建议您使用谷歌Chrome浏览器登录")
  }
});

app.controller('logoutController', function ($scope, $state, growl, commonService) {
  commonService.logout().then(function (res) {
    $state.go('login');
  }, function (rej) {
    growl.addErrorMessage(rej.message || '服务器异常，请刷新当前页');
  });
});

app.controller('profileController', function ($rootScope, $scope, $state, growl, commonService) {
  $scope.changePwd = function () {
    $scope.processing = true;
    var id = $rootScope.member.id;
    commonService.changePwd($scope.password, $scope.newpassword, id).then(function (res) {
      growl.addSuccessMessage('修改密码成功');
      $state.go('welcome');
    }, function (rej) {
      growl.addErrorMessage(rej.message || '修改密码失败');
    })['finally'](function () {
      $scope.processing = false;
    });
  };
});

app.controller('noauthController', function ($scope, $state, growl, commonService) {

});