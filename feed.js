import Vue from 'vue'
import App from './AppFeed'
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
  createDomData(vueData.body);
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
      return {
      }
    },
    template: '<App/>',
    components: {App},
  });
}
window.pageInject = pageInject;//方便调试

function createDomData(rawHtml) {
  let main = document.createElement("div");
  main.innerHTML = rawHtml;
  let html = main.childNodes;
  let imgArr = [];
  for (let i = 0; i < html.length; i++) {
    let item = html[i];
    let child = item.children || null;
    let data = {
      type: 'blank'
    };
    if (item.nodeType === 1) {

      if (item.tagName === 'P') {
        if (child.length) {
          child = child[0];
          if (child.tagName === 'IMG') {//图片
            imgArr.push(child.getAttribute('orig-src'));
            let tips = '';
            if (child.nextElementSibling) {
              tips = child.nextElementSibling.innerText
            }
            let _width = parseInt(child.getAttribute('data-width') || 0);
            let _height = parseInt(child.getAttribute('data-height') || 0);
            let height = _width && _height ? _height / _width * pageParams.mainWidth : "";
            data = {
              type: 'img',
              dataSrc: child.getAttribute('data-src') || child.getAttribute('src'),
              origSrc: child.getAttribute('orig-src') || child.getAttribute('src'),
              dataHeight: height ? height + "px" : "",
              mode: pageParams.imgMode,
              src: "",
              imgIndex: parseInt(imgArr.length - 1),
              tips: tips
            }
            if (child.className === 'data-gif-src') {//gif
              let tips = '';
              if (child.nextElementSibling) {
                tips = child.nextElementSibling.innerText
              }
              data['type'] = 'gif';
              data['dataGifSrc'] = child.getAttribute('data-gif-src');
              data['mode'] = pageParams.imgMode;
              data['showReal'] = false;
              data['loaded'] = false;
              data['tips'] = tips
            }
          } else if (child.tagName === 'AUDIO') {//音乐
            data = {
              type: 'music',
              'artist': child.getAttribute('artist'),
              'src': child.getAttribute('src'),
              'title': child.getAttribute('title'),
            }
          } else {
            data.type = "text"
            data.con = item.innerHTML.toString();
          }
        } else {
          data.type = "text"
          data.con = item.innerHTML.toString();
        }
      } else if (item.className === 'product') {//商品推荐模块
        data = {
          type: 'product',
          id: item.getAttribute('rel'),
          title: '',
          price: '',
          old_price: '',
          ready: false
        }
      } else if (item.className === 'video') {//视频
        let tips = '';
        if (item.nextElementSibling.tagName === 'SPAN') {
          tips = item.nextElementSibling.innerText
        }
        data = {
          type: 'video',
          src: item.getAttribute('src'),
          mode: item.getAttribute('mode'),
          title: item.getAttribute('title'),
          thumb: item.getAttribute('thumb'),
          hash: item.getAttribute('hash'),
          site: item.getAttribute('site'),
          videoStyle: {},
          tips: tips
        }
      } else if (item.className === 'recommend') {//公众号
        data = {
          type: 'hao',
          id: item.getAttribute('rel'),
          ready: false
        }
      } else if (item.className === 'vote') {//投票
        data = {
          type: 'votes',
          id: item.getAttribute('rel'),
          ready: false
        }
      } else if (item.tagName === 'H2') {//副标题
        data = {
          type: 'subtitle',
          con: item.innerText
        }
      }
      pageParams.con.push(data);
      pageParams.imgArr = imgArr;

    }
  }
}

