(function (global) {
  // 连接服务器
  function connect(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge);
    }
    else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        callback(WebViewJavascriptBridge);
      }, false);
    }
  }

  // 初始化并获取句柄
  connect(function (bridge) {
    bridge.init(function (message, responseCallback) {
      // TODO?
    });

    // 可以添加客户端方法
    bridge.registerHandler("webviewCallback", function (data) {
      // alert(JSON.stringify(data));
      location.reload();
    });
  });

  // 代理服务端行为
  global.webviewBridge = {

    // 邻聚
    neighbour: function () {
      window.WebViewJavascriptBridge.callHandler(
        'jsHandleService', {
          "id": "37",
          "content": "NEIGHBOUR_TOGETHER",
          "imageUrl": "",
          "name": "邻聚",
          "desc": "邻里结伴",
          "type": 2
        },
        function (responseData) {}
      );
    },

    // 商品详情
    goodsDetail: function (id) {
      window.WebViewJavascriptBridge.callHandler(
        'jsShowGoodsDetail', {
          "id": id
        },
        function (responseData) {}
      );
    },

    // 活动商品列表
    activityList: function () {
      window.WebViewJavascriptBridge.callHandler(
        'jsShowGoodsActivityList', {
          "id": "963",
          "title": "首页活动"
        },
        function (responseData) {}
      );
    },

    // 推荐商品列表
    recommendList: function () {
      window.WebViewJavascriptBridge.callHandler(
        'jsShowGoodsRecommendList', {
          id: "220",
          title: "天天精品"
        },
        function (responseData) {}
      );
    },

    // 洗衣价目表
    laudryPrices: function () {
      window.WebViewJavascriptBridge.callHandler(
        'jsShowLaundryPriceList', {},
        function (responseData) {}
      );
    },

    // 洗衣订单
    landryOrders: function () {
      window.WebViewJavascriptBridge.callHandler(
        'jsShowLaundryOrderList', {},
        function (responseData) {}
      );
    },

    // 支付接口
    payment: function (orderId, shouldPay, payBusinessType) {
      window.WebViewJavascriptBridge.callHandler(
        'jsShowQDPay', {
          orderId: orderId,
          shouldPay: shouldPay,
          payBusinessType: payBusinessType
        }, function (responseData) {}
      );
    }
  };
})(window);