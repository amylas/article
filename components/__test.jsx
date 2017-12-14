//本地调试工具，测试用
window.WebViewJavascriptBridge = {
  callHandler: function (method, params, callback) {
    if (method === "htmlRequest") {
      ajax(params, callback);
    } else if (method === "adRequest") {
      ajax(params, callback);
    } else if (method === "downloadImage") {
      callback(params.src)
    }
  },
  registerHandler: function (str) {
  }
}
var newsData = {
  code: 0,
  message: 'ok',
  data: {
    "article_id": "186945",
    "title": "文章到底3",
    "time": "07-05 16:05",
    "writer": "我是鲨鱼",
    "writer_url": "dfdsfds",//added
    "editor_word": "相信我说等我是编辑",
    "body": '<p><img data-src="http://test1-img1.dongqiudi.net/www/M00/0E/1D/480x-/-/-/ChOOullE442ALzzFAAArYR_fuxA779.jpg" data-width="180" data-height="180" orig-src="http://test1-img1.dongqiudi.net/www/M00/0E/1D/ChOOullE442ALzzFAAArYR_fuxA779.jpg"></p>'
    + '<p><img data-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/200x-/-/-/ChOOullkZLmAPUPVACjMKOcqlB4609.gif" data-gif-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/ChOOullkZLmAPUPVACjMKOcqlB4609.gif" orig-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/ChOOullkZLmAPUPVACjMKOcqlB4609.gif" class="data-gif-src"></p>'
    + "<p>jsjsj<\/p><p>\u5feb\u4e0a\u8bfe\u4e0a\u8bfe<\/p><p>\u8bb0\u5f97\u8bb0\u5f97\u5c31<\/p><p>\u8bb0\u5f97\u8bb0\u5f97\u5c31<div class=\"video\" mode=\"browser\" site=\"qiniu\" src=\"http:\/\/www.fullmatchesandshows.com\/2017\/04\/25\/revista-de-la-liga-25th-april-2017\/\" title=\"\" thumb=\"\" archive_id=\"30232\"  hash=\"586891eabeb3a3e08b17fda6a45e76fb\"><\/div><\/p>"
    + '<p><img data-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/200x-/-/-/ChOOullkZPeAGE_yAMnRYu55tXg944.gif" data-width="300" data-height="468" data-gif-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/ChOOullkZPeAGE_yAMnRYu55tXg944.gif" orig-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/ChOOullkZPeAGE_yAMnRYu55tXg944.gif" class="data-gif-src"></p>'
    + '<p><img index="6" data-src="http://test1-img1.dongqiudi.com/www/M00/0F/08/720x-/-/-/ChOOullkZguAEgx-AABSLY0aZOU136.jpg" class="imgs" src="http://test1-img1.dongqiudi.com/www/M00/0F/08/720x-/-/-/ChOOullkZguAEgx-AABSLY0aZOU136.jpg"></p>'
    + '<div class="video" mode="player" site="af" src="https://s3.dongqiudi.com/resource/ebac6351746093dcbc532a0fcc5088b0.mp4" title="" thumb="https://r1.ykimg.com/054101015950BCEBADC95BA0B20B9CC7" archive_id="46004" hash="01114f2caea2eeb5fbf5bdb1dda1996d"></div>'
    + '<p><div id="vote_4" class="vote" rel="244"></div></p>'
    + '<div class="product" rel="10353903">商品货号：10353903</div><div class="product" rel="AF4685">商品货号：AF4685</div>'
    + '<div class="recommend" rel="1791833">公众号ID：1791833</div><div class="recommend" rel="1791834">公众号ID：1791834</div>',
    "infos": {
      "channels": [{
        id: 475,
        tag: "广州恒大淘宝",
        href: ""
      },
        {
          id: 1517,
          tag: "北京中赫国安",
          href: ""
        },
        {
          id: 8736,
          tag: "郜林",
          href: ""
        }],
      "column": {
        "id": 4,
        "name": "中超最佳阵容",
        "intro": "这一轮我们是最善良的星",
        "href": "allfootball:\/\/\/columns\/4"
      }

    },
    account: {
      'id': "34324",
      'name': "懂球号名字",
      'icon': "http://test1-img1.dongqiudi.net/www/M00/0E/97/180x135/crop/-/ChOOullUwpuAQu22AABc9U7SCvs699.jpg",
      'intro': "let me know you对方的身份",
      'addV': 1
    },
    visit_total: 100,
    'photo_copyright': 'eerewrew',
    'source': 'rewrew',
    'luck_max': 333,
    'dqd_ads': {
      'android_href': "https://m.dongqiudi.com/redirect?ref=zc_yytj&url=" + encodeURIComponent("http://down.159cai.com/159jingcai/159jczq.apk"),
      'ios_href': "https://itunes.apple.com/cn/app/159jing-cai-zu-qiu-jing-cai-ban/id1113427309?mt=8"
    }
  }
};

var topData = {
  code: 0,
  message: 'ok',
  data: {
    article_id: 187056,//TODO
    mini_top_content: {
      content: "外链测试",
      images: [
        {
          "url": "/www/M00/0F/23/ChOOullnIQSAfpP8ABsDSxKHd6E869.gif",
          "size": 1770315,
          "width": 276,
          "height": 300,
          "mime": "image/gif",
          "water_url": "http://test1-img1.dongqiudi.net/www/M00/0F/23/ChOOullnIQSAfpP8ABsDSxKHd6E869.gif",
          "dataSrc": "http://test1-img1.dongqiudi.net/www/M00/0F/23/276x276/crop/-/ChOOullnIQSAfpP8ABsDSxKHd6E869.gif?imageView2/1/format/jpg",
          "origSrc": "http://test1-img1.dongqiudi.net/www/M00/0F/23/ChOOullnIQSAfpP8ABsDSxKHd6E869.gif",
          "type": "gif"
        },
        {
          "url": "/www/M00/0F/23/ChOOullnIQSAR67PAABQehdhwVg87.jpeg",
          "size": 20602,
          "width": 500,
          "height": 421,
          "mime": "image/jpeg",
          "water_url": "http://test1-img1.dongqiudi.net/www/M00/0F/23/ChOOullnIQSAR67PAABQehdhwVg87.jpeg?watermark/3/text/QOWTiOWTiDAxMA==/fontsize/330/font/5b6u6L2v6ZuF6buR/fill/I0ZGRkZGRg==/dx/28/dy/10/image/aHR0cDovL2ltZzEuZG9uZ3FpdWRpLmNvbS9mYXN0ZGZzMS9NMDAvOTQvNUMvbzRZQkFGbGNvem1BQXM5eUFBQUhFSHZzMzZVNzA3LnBuZz9pbWFnZVZpZXcyLzAvdy8xNQ==/dy/13/dx/10",
          "dataSrc": "http://test1-img1.dongqiudi.net/www/M00/0F/23/280x280/crop/-/ChOOullnIQSAR67PAABQehdhwVg87.jpeg?imageView2/1/format/jpg",
          "origSrc": "http://test1-img1.dongqiudi.net/www/M00/0F/23/ChOOullnIQSAR67PAABQehdhwVg87.jpeg?watermark/3/text/QOWTiOWTiDAxMA==/fontsize/330/font/5b6u6L2v6ZuF6buR/fill/I0ZGRkZGRg==/dx/28/dy/10/image/aHR0cDovL2ltZzEuZG9uZ3FpdWRpLmNvbS9mYXN0ZGZzMS9NMDAvOTQvNUMvbzRZQkFGbGNvem1BQXM5eUFBQUhFSHZzMzZVNzA3LnBuZz9pbWFnZVZpZXcyLzAvdy8xNQ==/dy/13/dx/10",
          "type": "img"
        },
        {
          "url": "/www/M00/0F/23/ChOOullnIQSAChKsABiREbtVkK0066.gif",
          "size": 1610001,
          "width": 276,
          "height": 300,
          "mime": "image/gif",
          "water_url": "http://test1-img1.dongqiudi.net/www/M00/0F/23/ChOOullnIQSAChKsABiREbtVkK0066.gif",
          "dataSrc": "http://test1-img1.dongqiudi.net/www/M00/0F/23/276x276/crop/-/ChOOullnIQSAChKsABiREbtVkK0066.gif?imageView2/1/format/jpg",
          "origSrc": "http://test1-img1.dongqiudi.net/www/M00/0F/23/ChOOullnIQSAChKsABiREbtVkK0066.gif",
          "type": "gif"
        }
      ],
      videos: [
        {
          url: "http://27.221.31.209/6573B4E8E604E8446C04E848D4/030008010059572D9090DC019C3C1C6CD225EF-4E05-282E-EC5D-D6201486F5BA.mp4?ccode=0401&duration=70&expire=18000&psid=be406167fce10a025f06da3fb5e721a8&ups_client_netip=118.190.132.52&ups_ts=1499683119&ups_userid=&utid=L0fqEVJl%2BVgCAXa%2BhDRdEFke&vid=XMjg2MDk2NDgyMA%3D%3D&vkey=A0323c95198cdcb183493a78cdcdc9ebf",
          duration: 21,
          width: 0,
          height: 0,
          size: 0,
          source: "http://v.youku.com/v_show/id_XMjg2MDk2NDgyMA==.html",
          mime: "",
          image: "https://r1.ykimg.com/0541040859572D9400000160240DF15C",
          mode: "player",
          hash_id: "f6f87adca5c5d87fa1a68ef8800365eb",
          site: "qiniu",
          model: "player"
        }
      ],
      publish_time: "07-01 18:48"
    },
    praise_total: '2200',
    author: {
      name: "赵剑测试",
      level: "official",
      medal_url: "http://img1.dongqiudi.com/fastdfs1/M00/63/B3/o4YBAFj5pYKAetOzAAAGhNXa-yY637.png",
      user_id: 2821317,
      avatar: "http://test1-img1.dongqiudi.com/www/M00/0E/89/ChOOullTY5eAaYmMAAAKI132D10715.jpg",
      medal_desc: "测试用"
    },
    "infos": {
      "channels": [
        {
          "id": 1103,
          "tag": "曼城",
          "href": "dongdong:///team/676"
        }
      ],
      "column": ""
    },
    visit_total: 48
  }
};

var pageData = {
  content: newsData,
  config: {
    _server: 'test1-',
    _img: 'loading',
    _font: 'm',
    version: '545'//TODO
  },
  info: {
    "platform": "iOS",
    "version": "1.8.1",
    "username": ""
  }
};
pageInject(pageData);

function ajax(options, callback) {
  var xhr = new XMLHttpRequest;

  xhr.open(options.method.toUpperCase(), options.url, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(options.param));

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var message = xhr.responseText;
      if (options.url.indexOf('dab') > -1) {

      } else {
        var data = JSON.parse(xhr.responseText);
        callback(data);
      }

    } else {
    }
  };
}


