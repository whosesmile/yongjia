accountModule.controller('memberController', function ($scope, $state, $modal, growl, memberService, controllerGenerator, $q) {
  controllerGenerator($scope, memberService, {
    title: '微信用户',
    property: 'name',
    createTemplate: 'modules/account/templates/partial/create-user-form.html',
    updateTemplate: 'modules/account/templates/partial/update-user-form.html',
    autoload: true
  });
});

accountModule.controller('managerController', function ($scope, $state, $modal, growl, managerService, controllerGenerator, $q) {
  controllerGenerator($scope, managerService, {
    title: '管理员',
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

accountModule.controller('sellerController', function ($scope, $state, $modal, growl, sellerService, controllerGenerator, $q) {
  controllerGenerator($scope, sellerService, {
    title: '销售顾问',
    property: 'name',
    createTemplate: 'modules/account/templates/partial/create-user-form.html',
    updateTemplate: 'modules/account/templates/partial/update-user-form.html',
    autoload: true
  });
});