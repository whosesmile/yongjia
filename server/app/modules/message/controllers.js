messageModule.controller('messageController', function ($scope, $state, $modal, growl, messageService, controllerGenerator, $q, commonService) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, messageService, {
    title: '资讯',
    modalsize: 'lg',
    property: 'name',
    createTemplate: 'modules/message/templates/partial/message-form.html',
    updateTemplate: 'modules/message/templates/partial/message-form.html',
    autoload: true,
    dynamicMerge: function (type, scope) {
      if (type === 'create' || type === 'update') {
        if (type === 'create') {
          scope.entity.posMessage = 0;
          scope.entity.posManager = 0;
        }
        scope.upload = function ($files) {
          return commonService.upload($files).then(function (url) {
            scope.entity.pic = url;
          });
        };
      }
    }
  });

});