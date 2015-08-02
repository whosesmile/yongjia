showcaseModule.controller('goodsController', function ($scope, $state, $modal, growl, goodsService, controllerGenerator, $q, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, goodsService, {
    title: '展厅',
    modalsize: 'lg',
    property: 'name',
    createTemplate: 'modules/showcase/templates/partial/goods-form.html',
    updateTemplate: 'modules/showcase/templates/partial/goods-form.html',
    autoload: true,
    dynamicMerge: function (type, scope) {
      if (type === 'create' || type === 'update') {

        scope.entity.carHallPics = [];
        scope.entity.carModelIds = [];

        if (type === 'update') {
          goodsService.details({
            id: scope.entity.id
          }).then(function (data) {
            scope.entity = data.entity;
          });
        }

        goodsService.getCarType().then(function (data) {
          scope.list = data.list;
        });

        scope.$watch('entity.typeId', function (id) {
          if (id) {
            goodsService.getCarModel(id).then(function (data) {
              scope.carModels = data.list;
            });

            // scope.list.forEach(function (item) {
            //   if (item.id === scope.entity.typeId) {
            //     scope.entity.typeName = item.carTypeName;
            //   }
            // });
          }
        });

        scope.upload = function ($files) {
          if ($files && $files.length) {
            return commonService.upload($files).then(function (url) {
              scope.entity.img = url;
            });
          }
        };

        scope.uploadLibrary = function ($files, index) {
          if ($files && $files.length) {
            return commonService.upload($files).then(function (url) {
              scope.entity.carHallPics[index] = url;
            });
          }
        };

        scope.removeLibrary = function (index) {
          delete scope.entity.carHallPics[index];
        };

        scope.contains = function (item) {
          var exist = false;
          scope.entity.carModelIds.forEach(function (id) {
            if (item.id === id) {
              exist = true;
            }
          });
          return exist;
        };

        scope.toggleCarModel = function (item) {
          console.log(scope.entity.carModelIds)
          if (scope.contains(item)) {
            scope.entity.carModelIds.splice(scope.entity.carModelIds.indexOf(item.id), 1);
          }
          else {
            scope.entity.carModelIds.push(item.id);
          }
          console.log(scope.entity.carModelIds)
        };

      }
    }
  });
});