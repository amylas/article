import Vue from 'vue'
import App from './AppTop'
import VueBus from 'vue-bus'
Vue.use(VueBus);

connectWebViewJavascriptBridge(function (bridge) {
  bridge.init(function (message, responseCallback) {
  });

  bridge.registerHandler('pageInject', pageInject);

  bridge.registerHandler('userLoginned', function (data) {
    pageParams.username = data.username;
    console.log(data.username);
  });
});

function pageInject(data) {
  vueData = data.content.data;

  let config = data.config;
  pageParams.fontSize = config._font;
  pageParams.imgMode = config._img === "off" ? "off" : "loading";
  pageParams.dayMode = config._day;

  let info = data.info;
  pageParams.version = info.version;
  pageParams.platform = info.platform.toLowerCase();
  pageParams.mainWidth = (document.body.clientWidth || window.screen.width) - 30;
  pageParams.username = data.info.username;

  if (!vueData || !vueData.article_id) {
    location.replace(`https://${config._server}n.dongqiudi.com/v1/404`);
    return;
  }
  Vue.mixin({
    data(){
      return {
        article_id: vueData.article_id,
        prefix: config._server || "",
        version: config.version
      }
    },
    created: function () {
    },
    methods: {}
  });

  let vue = new Vue({
    el: '#app',
    data () {
      return {}
    },
    template: '<App/>',
    components: {App},
  });
}

window.pageInject = pageInject;//方便调试
