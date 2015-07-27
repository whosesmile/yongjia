// 通用
app.factory('commonService', function ($q, $http, $injector, $modal, growl) {
  return {
    login: function (account, pwd) {
      return $http({
        url: '/web/login',
        method: 'post',
        data: {
          account: account,
          pwd: pwd
        }
      });
    },

    logout: function () {
      return $http({
        url: '/web/logout'
      });
    },

    loadUser: function () {
      return $http({
        url: '/web/getCurrentUser'
      });
    },

    changePwd: function (oldPwd, newPwd) {
      return $http({
        url: '/web/modifyPwd',
        method: 'post',
        data: {
          oldpwd: oldPwd,
          newpwd: newPwd
        }
      });
    },

    // 仅支持上传单一文件
    upload: function ($files) {
      var deferred = $q.defer();
      var file = $files[0];
      $injector.get('$upload').upload({
        url: '/web/uploadPic',
        method: 'POST',
        file: file
      }).then(function (res) {
        deferred.resolve(res.entity);
        growl.addSuccessMessage('上传成功');
      }, function (rej) {
        growl.addErrorMessage(rej.message || '上传失败');
        deferred.reject(rej);
      }, function (e) {
        growl.addInfoMessage('正在上传：' + parseInt(100 * e.loaded / e.total, 10));
      });
      return deferred.promise;
    }

  };
});

// 通用服务生成器 默认包含5种操作：CREATE UPDATE REMOVE TOGGLE QUERY
app.factory('serviceGenerator', function ($http) {

  return function () {

    var mapper = {};

    // 代理CRUDT操作
    var proxy = function (name, params, data, method) {
      // var name = proxy.caller.toString().match(/^function\s*([^\s(]+)/)[1];
      var url = mapper[name];
      if (!url) {
        throw new Error('<< ' + name + ' method action not config >>');
      }
      return $http({
        url: url,
        params: params || null,
        data: data || null,
        method: method ? method : ((name === 'query' || name === 'details') ? 'get' : 'post')
      });
    };

    var identity = function (data) {
      return angular.isObject(data) ? data.id : data;
    };

    // 封装好增删改查
    var service = {

      query: function (params) {
        return proxy('query', params, null);
      },

      details: function (params) {
        return proxy('details', params, null);
      },

      create: function (data) {
        return proxy('create', null, data);
      },
      update: function (data) {
        return proxy('update', null, data);
      },

      remove: function (data) {
        return proxy('remove', null, {
          id: identity(data)
        });
      },

      toggle: function (data) {
        return proxy('toggle', null, {
          id: identity(data),
          status: data.status === 0 ? 1 : 0
        });
      },

      get: function (url, params) {
        return $http({
          url: url,
          params: params
        });
      },

      post: function (url, data) {
        return $http({
          url: url,
          data: data,
          method: 'post'
        });
      },

      // 配置增删改查的地址
      actions: function () {
        angular.extend(mapper, arguments[0]);
        angular.forEach(arguments[0], function (config, name) {
          if (typeof config !== 'string') {
            service[name] = function () {
              if (config.method && config.method.toLowerCase() === 'get') {
                return $http({
                  url: config.url,
                  params: arguments[0]
                });
              }
              return $http({
                url: config.url,
                data: arguments[0],
                method: 'post'
              });
            };
          }
        });
        return this;
      },

      // 配置其他方法
      methods: function () {
        angular.forEach(arguments[0], function (fn, name) {
          service[name] = fn.bind(service);
        });
        return this;
      }

    };

    return service;
  };

});

// 通用处理生成器 默认包含5种操作：CREATE UPDATE REMOVE TOGGLE QUERY
app.factory('controllerGenerator', function ($q, $rootScope, $modal, growl) {

  return function ($scope, service, config) {

    /** 
     * config should have:
     * title: '某某操作'
     * property: 用于提示文案的实体的主键名称，默认为 name
     * createTemplate: '创建实体的模板地址'
     * updateTemplate: '编辑实体的模板地址'
     */

    $scope.pageNo = 1;
    $scope.pageSize = 20;
    $scope.totalCount = 0;

    $scope.query = function query(arg) {
      // 删除之后到达阈值后会做静默翻页 防止页面出现空页面
      if (arg !== true) {
        $scope.list = [];
        $scope.loading = true;
      }
      // 添加额外参数 注：如果arg是boolean 此处不会影响
      var params = angular.extend({
        pageNo: $scope.pageNo,
        pageSize: $scope.pageSize,
      }, arg, $scope.searchParams && $scope.searchParams());

      return service.query(params).then(function (res) {
        $scope.list = res.list;
        $scope.pageNo = res.pageNo;
        $scope.pageSize = res.pageSize;
        $scope.totalCount = res.totalCount;
        return $q.when(res);
      }, function (rej) {
        growl.addErrorMessage(rej.message || '服务器异常，请稍后再试！');
        return $q.reject(rej);
      })['finally'](function () {
        $scope.loading = false;
      });
    };

    $scope.details = function details(entity) {
      $modal.open({
        size: config.modalsize || 'normal',
        templateUrl: config.detailsTemplate,
        controller: ['$scope',
          function (scope) {
            scope.title = '查看' + (config.title ? config.title : '');
            scope.action = 'details';

            var params = angular.extend({
              id: entity.id
            });
            service.details(params).then(function (res) {
              scope.entity = $.extend({}, entity, res.entity);
            }, function (rej) {
              growl.addErrorMessage(rej.message || scope.title + '失败！');
              return $q.reject(rej);
            });

            // 动态修改弹窗上下文
            if (config.dynamicMerge) {
              config.dynamicMerge('details', scope);
            }
          }
        ]
      });

    };

    $scope.create = function create() {
      $modal.open({
        size: config.modalsize || 'normal',
        templateUrl: config.createTemplate,
        controller: ['$scope',
          function (scope) {
            scope.title = '添加' + config.title;
            scope.action = 'create'; // 区分创建 以便模板可以标识
            scope.entity = {};

            scope.confirm = function () {
              scope.entity.processing = true;

              service.create(scope.entity).then(function (res) {
                $scope.pageNo = 1;
                $scope.query();
                growl.addSuccessMessage(scope.title + '成功！');
                scope.$close();
                return $q.when(res);
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + '失败！');
                return $q.reject(rej);
              })['finally'](function () {
                scope.entity.processing = false;
              });
            };

            // 动态修改弹窗上下文
            if (config.dynamicMerge) {
              config.dynamicMerge('create', scope);
            }
          }
        ]
      });
    };

    $scope.update = function update(entity) {
      $modal.open({
        size: config.modalsize || 'normal',
        templateUrl: config.updateTemplate || config.modifyTemplate,
        controller: ['$scope',
          function (scope) {
            scope.title = '编辑' + config.title;
            scope.action = 'update'; // 区分创建 以便模板可以标识
            scope.entity = angular.copy(entity);

            scope.confirm = function () {
              scope.entity.processing = true;

              service.update(scope.entity).then(function (res) {
                delete scope.entity.processing;
                angular.extend(entity, res.entity || scope.entity);
                growl.addSuccessMessage(scope.title + '成功!');
                scope.$close();
                return $q.when(res);

              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + '失败！');
                return $q.reject(rej);
              })['finally'](function () {
                scope.entity.processing = false;
              });
            };

            // 动态修改弹窗上下文
            if (config.dynamicMerge) {
              config.dynamicMerge('update', scope);
            }
          }
        ]
      });
    };

    $scope.remove = function remove(entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '删除' + config.title;
            scope.entity = entity;
            scope.message = '<h5>您确定要删除' + config.title + ' ( <span class="text-warning">' + entity[config.property || 'name'] + '</span> ) 吗？</h5>';
            scope.confirm = function () {
              scope.entity.processing = true;

              service.remove(entity).then(function (res) {
                $scope.totalCount -= 1;
                $scope.list.splice($scope.list.indexOf(entity), 1);

                // 阈值为 2/3，小于会自动reload当前页
                if ($scope.list.length < ($scope.size || 20) * 2 / 3) {
                  $scope.query(true);
                }
                growl.addSuccessMessage(scope.title + '成功!');
                return $q.when(res);
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + '失败！');
              })['finally'](function () {
                scope.entity.processing = false;
              });
              scope.$close();
            };

            // 动态修改弹窗上下文
            if (config.dynamicMerge) {
              config.dynamicMerge('remove', scope);
            }
          }
        ]
      });
    };

    $scope.toggle = function toggle(entity) {
      entity.toggling = true;

      service.toggle(entity).then(function (res) {
        entity.status = entity.status === 0 ? 1 : 0;
        growl.addSuccessMessage('操作成功!');
        return $q.when(res);
      }, function (rej) {
        growl.addErrorMessage(rej.message || '操作失败！');
        return $q.reject(rej);
      })['finally'](function () {
        entity.toggling = false;
      });
    };

    $scope['delete'] = function (entity) {
      return $scope.remove(entity);
    };

    $scope.modify = function (entity) {
      return $scope.update(entity);
    };

    if (config.autoload) {
      $scope.query(config.params);
    }

    return $scope;

  };

});

app.factory('dialog', function ($modal) {

  return {

    alert: function (message, fn) {
      $modal.open({
        templateUrl: 'config/templates/bootbox.partial.html',
        controller: function ($scope) {
          $scope.type = 'alert';
          $scope.message = message;

          $scope.confirm = function () {
            $scope.$close();
            return fn && fn();
          };
        }
      });
    },

    confirm: function (message, fn) {
      $modal.open({
        templateUrl: 'config/templates/bootbox.partial.html',
        controller: function ($scope) {
          $scope.type = 'confirm';
          $scope.message = message;

          $scope.confirm = function () {
            $scope.$close();
            return fn && fn();
          };
        }
      });
    }

  };
});