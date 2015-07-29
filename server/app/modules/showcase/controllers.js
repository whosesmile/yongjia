showcaseModule.controller('goodsController', function ($scope, $state, $modal, growl, goodsService, controllerGenerator, $q, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, goodsService, {
    title: '展厅',
    property: 'name',
    createTemplate: 'modules/showcase/templates/partial/goods-form.html',
    updateTemplate: 'modules/showcase/templates/partial/goods-form.html',
    autoload: true,
    dynamicMerge: function (type, scope) {
      if (type === 'create' || type === 'update') {

        goodsService.getCarType().then(function (data) {
          scope.list = data.list;
        });

        scope.$watch('entity.typeId', function () {
          scope.typeName = '';
          if (scope.list) {
            scope.list.forEach(function (item) {
              if (item.id === scope.entity.typeId) {
                scope.entity.typeName = item.carTypeName;
              }
            });
          }
        });

        scope.upload = function ($files) {
          return commonService.upload($files).then(function (url) {
            scope.entity.img = url;
          });
        };
      }
    }
  });
});