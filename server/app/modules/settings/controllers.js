settingsModule.controller('cartypeController', function ($scope, $state, $modal, growl, cartypeService, controllerGenerator, $q) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, cartypeService, {
    title: '车型',
    property: 'name',
    createTemplate: 'modules/settings/templates/partial/cartype-form.html',
    updateTemplate: 'modules/settings/templates/partial/cartype-form.html',
    autoload: true
  });
});

settingsModule.controller('vehicleController', function ($scope, $state, $modal, growl, cartypeService, vehicleService, controllerGenerator, commonService, $q) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, vehicleService, {
    title: '车型参数',
    property: 'name',
    createTemplate: 'modules/settings/templates/partial/vehicle-form.html',
    updateTemplate: 'modules/settings/templates/partial/vehicle-form.html',
    autoload: true,
    dynamicMerge: function (type, scope) {
      if (type === 'create' || type === 'update') {
        cartypeService.query().then(function (data) {
          scope.list = data.list;
        });

        scope.uploadFile = function ($files) {
          if ($files && $files.length) {
            return commonService.uploadFile($files).then(function (data) {
              scope.entity.paramsStr = JSON.stringify(data.list);
            });
          }
        };

        scope.$watch('cartype', function (item) {
          if (item) {
            scope.entity.typeId = item.id;
            scope.entity.typeNmae = item.carTypeName;
          }
        });
      }
    }
  });
});