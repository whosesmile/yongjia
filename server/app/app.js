var dependencies = ['ui.router', 'ui.bootstrap', 'angular-growl', 'ui.tinymce', 'angularFileUpload', 'ui.bootstrap.datetimepicker', 'angular-echarts','acute.select','ui.sortable'];

// 嗅探检查是否引用了必要的依赖
function sniffer(list) {
  var name = null;
  for (var i = list.length - 1; i >= 0; i--) {
    name = list[i];
    try {
      if (!angular.module(name)) {
        throw name;
      }
    }
    catch (e) {
      list.splice(i, 1);
    }
  }
  return list;
}

var app = angular.module('app', sniffer(dependencies).concat(['templates']));

// 定义Module需使用此方法 因为一个应用可能会打包多个模块
// 注意：如果多模块整合可能会出现重名问题，后定义的服务会覆盖前面的
var Modules = {
  modules: [],

  register: function (name, requires, configFn) {
    this.modules.push(name);
    return angular.module(name, requires, configFn);
  },

  generator: function (name) {
    var module = angular.module(name);
    var service = name.replace(/Module$/, '') + 'Service';

    module.factory(service, function (serviceGenerator) {
      return serviceGenerator();
    });
  }
};

// bootstrap
angular.element(document).ready(function () {
  angular.bootstrap(document, Modules.modules);
});