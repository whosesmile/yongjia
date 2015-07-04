settingsModule.controller('vehicleController', function ($scope, $state, $modal, growl, vehicleService, controllerGenerator, $q) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, vehicleService, {
    title: '车型参数',
    property: 'name',
    createTemplate: 'modules/settings/templates/partial/create-user-form.html',
    updateTemplate: 'modules/settings/templates/partial/update-user-form.html',
    autoload: true
  });
});