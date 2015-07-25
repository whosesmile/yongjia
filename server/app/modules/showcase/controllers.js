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
        scope.upload = function ($files) {
          return commonService.upload($files).then(function (url) {
            scope.entity.img = url;
          });
        };
      }
    }
  });
});