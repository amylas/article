<template>
  <article>
    <div class="con">
      <template v-for="(item,i) in con">
        <template v-if="item.type == 'text'">
          <p v-html="item.con"></p>
        </template>

        <template v-if="item.type == 'img'">
          <div class="img-container" :class="item.mode" v-on:click="showImg(item,$event)"
               :style="item.dataHeight? 'height:' + item.dataHeight : ''">
            <img class="imgs" :class="item.mode" v-show="item.mode === 'on'" :src="item.src" @load="imgLoaded(item)">
          </div>
          <span class="tips" v-if="item.tips">{{item.tips}}</span>
        </template>

        <template v-if="item.type == 'gif'">
          <div class="img-container" :class="item.mode" v-on:click="showGifImg(item,$event)"
               :style="item.dataHeight? 'height:' + item.dataHeight : ''">

            <img class="data-gif-src" :class="item.mode" :src="item.src"
                 v-show="item.mode === 'on' || item.mode === 'gifLoading' || item.mode === 'gifError' || item.mode === 'gif'"
                 @load="gifLoaded(item)">

            <div class="media-loading" v-if="item.mode === 'gifLoading'"></div>
            <div class="media-label" v-if="item.mode === 'on'"></div>
            <div class="media-error" v-if="item.mode === 'gifError'"></div>
          </div>
          <span class="tips" v-if="item.tips">{{item.tips}}</span>
        </template>

        <template v-if="item.type == 'product'">
          <a v-if="item.ready" :rel="item.id" class="product_box" v-bind:href="item.link">
            <img :src='item.img'/>
            <h3>{{item.title}}</h3>
            <p>
              <span>{{item.price}}</span>&nbsp;<em v-if="item.price!==item.old_price">{{item.old_price}}</em>
            </p>
            <a class="pro_go">立即购买</a>
          </a>
        </template>
        <template v-if="item.type == 'hao'">
          <div class="reco_box" v-if="item.ready">
            <a :href="'dongdong:///feed/column/'+item.id">
              <img :src='item.icon'/>
              <div class="con">
                <p>
                  <strong>{{item.name}}</strong>
                  <span>
                    {{item.intro}}
                  </span>
                </p>
              </div>
              <div class="btn_con"><a class="pro_go">+ 关注</a></div>
            </a>
          </div>
        </template>
        <template v-if="item.type == 'music'">
          <div class="audio">
            <audio preload="off" :src="item.src">&nbsp;</audio>
            <div class="main playing">
              <h3>{{item.title}}</h3>
              <p>{{item.artist}}</p>
              <a class="play" v-if="item.pause" v-on:click.stop="audioPlay(item,$event)"></a>
              <a class="pause" v-else v-on:click.stop="audioPause(item)"></a>
            </div>
            <div class="progress"></div>
          </div>
        </template>
        <template v-if="item.type == 'video'">
          <div class="media-container media-container-video"
               v-if="item.thumb" v-on:click="videoPlay(item)"
               v-bind:style="{'backgroundImage':'url('+item.thumb+')','height':video_height+'px'}">
            <div class="media-holder media-holder-video"></div>
          </div>
          <div class="media-container media-container-video" v-else v-on:click="videoPlay(item)"
               v-bind:style="{'height':video_height+'px'}">
            <div class="media-holder media-holder-video"></div>
          </div>
          <span class="tips_v" v-if="item.tips">{{item.tips}}</span>
        </template>
        <template v-if="item.type == 'subtitle'">
          <h2><span class="border"></span>{{item.con}}</h2>
        </template>
        <template v-if="item.type == 'votes'">
          <div class='vote_box' v-show="item.ready">
            <h4>
              <span>投票</span>
            </h4>
            <div v-bind:class="item.voteType">
              <template v-if="!item.voted">
                <dl>
                  <dt>
                    {{item.title}}
                    <span>(
                          <template v-if="item.voteType === 'checkbox'">
                            可选{{item.max_vote}}项
                          </template>
                          <template v-else>
                            单选
                          </template>
                          )</span>
                  </dt>
                  <template v-for="(option,index) in item.options">
                    <dd v-if="option.sel" class="checked" v-on:click="optionSel(option,index,item)">
                      <span class="tag"></span>
                      {{option.title}}
                    </dd>
                    <dd v-if="!option.sel" v-on:click="optionSel(option,index,item)">
                      <span class="tag"></span>
                      {{option.title}}
                    </dd>
                  </template>
                </dl>
                <div class="text">
                  <a v-if='item.selCounter>0' class="btn" @click="optionSub(item)">提交</a>
                  <a v-else class="btn btn_dis">提交</a>
                </div>
              </template>
              <template v-if="item.voted">
                <dl class="re">
                  <dt>
                    {{item.title}}
                    <span>(
                          <template v-if="item.voteType === 'checkbox'">
                            可选{{item.max_vote}}项
                          </template>
                          <template v-else>
                            单选
                          </template>
                          )</span>
                  </dt>
                  <template v-for="(option,index) in item.options">
                    <dd>
                      <h3>
                        {{option.title}} <em v-if="option.voted">已选</em>
                        <span v-html="Math.round(option.total/item.voteCount*100)+'%'"></span>
                      </h3>
                      <div class="rank">
                        <div class="bar" v-bind:class="option.voted? 'voted':''"
                             v-bind:style="{width:Math.round(option.total/item.voteCount*100)+'%'}"></div>
                      </div>
                    </dd>
                  </template>
                </dl>
                <div class="text">
                  <p v-if="item.selCounter > 0">您已经投过票了</p>
                  <p v-else>投票已结束</p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>

      <div id="agreement" v-if="is_feed == 1">
        <div id="agreement_con">
          <span>文章内容不代表懂球帝观点</span>
        </div>
      </div>

      <div id="news_ad" v-on:click="dqdAdLink" v-if="dqd_ads">
        <h2>【足彩应用推荐】</h2>
        <div class="ad_main">
          <img src="../assets/ad-dqd.png" alt=""/>
          <h3>159竞彩足彩</h3>
          <h6>
            安全、快捷，新用户注册即送218大礼包！竞彩加奖10%！
          </h6>
          <a>下载</a>
        </div>
      </div>

      <div class="report_con" v-if="is_feed == 1">
        <span>阅读 {{visit_total}}</span>
        <a :href="'dongdong:///report/' + article_id" class="report_btn">举报</a>
      </div>

    </div>
  </article>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'articleCon',
    data: function () {
      return {
        video_height: (pageParams.mainWidth) * 9 / 16 - 40,
        con: pageParams.con,
        imgArr: pageParams.imgArr,
        dqd_ads: vueData.dqd_ads
      }
    },
    props: ["is_feed", "visit_total"],
    created: function () {
      let that = this;
      let [pro_ids, hao_ids, vote_ids] = ['', '', ''];
      for (let i = 0; i < this.con.length; i++) {

        let item = this.con[i];
        if (item.type === 'product') {
          pro_ids += item.id + ',';
        }
        if (item.type === 'hao') {
          hao_ids += item.id + ',';
        }
        if (item.type === 'votes') {
          vote_ids += item.id + '_';
        }
        if (item.type === 'music') {
          Vue.set(item, 'pause', true)
        }
      }
      if (pro_ids) {//获取商品推荐模块列表信息
        let options = {
          method: 'get',
          url: `https://${this.prefix}mall.dongdong.com/api/product/infos_new?product_codes=${pro_ids}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          if (data.length) {
            for (let i = 0; i < that.con.length; i++) {
              let item = that.con[i];
              if (item.type === 'product') {
                Vue.set(item, 'title', data[0].title)
                Vue.set(item, 'img', data[0].img)
                Vue.set(item, 'price', data[0].price)
                Vue.set(item, 'old_price', data[0].old_price)
                Vue.set(item, 'link', 'dongdong:///mall/product/' + item.id)
                Vue.set(item, 'ready', true)
                data.splice(0, 1)
              }
              if (!data.length) {
                break
              }
            }
          }
        });
      }
      if (hao_ids) {//获取懂球号推荐模块列表信息
        let options = {
          method: 'get',
          url: `https://${this.prefix}feed.dongdong.com/account/infos_new?account_ids=${hao_ids}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          if (data.code !== 0) return;
          data = data.data;
          for (let i = 0; i < that.con.length; i++) {
            let item = that.con[i];
            if (item.type === 'hao') {
              Vue.set(item, 'user_id', data[0].user_id)
              Vue.set(item, 'name', data[0].name)
              Vue.set(item, 'intro', data[0].intro)
              Vue.set(item, 'icon', data[0].icon)
              Vue.set(item, 'scheme', data[0].report.scheme);
              Vue.set(item, 'ready', true)
              data.splice(0, 1)
            }
            if (!data.length) {
              break
            }
          }
        });
      }

      if (vote_ids) {//获取投票模块列表信息
        let options = {
          method: 'get',
          url: `https://${this.prefix}api.dongdong.com/poll?id=${vote_ids}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          for (let i = 0; i < that.con.length; i++) {
            let item = that.con[i];
            if (item.type === 'votes') {
              let voteType = data[0].max_vote > 1 ? 'checkbox' : 'radio';
              Vue.set(item, 'max_vote', data[0].max_vote);
              Vue.set(item, 'voteType', voteType);
              Vue.set(item, 'title', data[0].title);
              Vue.set(item, 'voted', data[0].voted);
              Vue.set(item, 'options', data[0].options);
              Vue.set(item, 'ready', true);
              Vue.set(item, 'selCounter', 0);
              Vue.set(item, 'selList', []);
              Vue.set(item, 'voteCount', data[0].options.map(x => x.total).reduce(function (a, b) {
                return a + b;
              }));
              data.splice(0, 1);
            }
            if (!data.length) {
              break
            }
          }
        });
      }
    },
    mounted: function () {
      let that = this;
      that.loadImages();
      that.setGalleries(that.imgArr);
    },
    methods: {
      loadImages: function () {
        if (pageParams.imgMode === "off") return;
        let imagesItem = this.con.filter(function (x) {
          if (x.type === "img" || x.type === "gif") {
            return x
          }
        });
        for (let i = 0, len = imagesItem.length; i < len; i++) {
          let item = imagesItem[i];
          this.imgSrc(item, item.dataSrc);
        }
      },
      showImg: function (item) {
        if (item.mode === "off" || item.mode === "error") {
          item.mode = "loading";
          this.imgSrc(item, item["dataSrc"]);
        } else {
          this.imgView(item);
        }
      },
      showGifImg: function (item) {
        if (item.mode === "off" || item.mode === "error") {
          item.mode = "loading";
          this.imgSrc(item, item["dataSrc"]);
        } else if (item.mode === "on" || item.mode === "gifError") {
          item.mode = "gifLoading";
          this.imgSrc(item, item["dataGifSrc"]);
        } else {
          this.imgView(item);
        }
      },
      imgSrc: function (item, src) {
        WebViewJavascriptBridge.callHandler("downloadImage", {src: src}, function (data) {
          if (data !== "") {
            Vue.set(item, 'src', data);
          } else if (item.mode === "loading") {
            item.mode = "error";
          } else {
            item.mode = "gifError";
          }
        });
      },
      imgView: function (item) {
        WebViewJavascriptBridge.callHandler('gallery', {'index': item.imgIndex});
      },
      imgLoaded: function (item) {
        if (item.mode === "loading") {
          item.mode = "on";
        }
      },
      gifLoaded: function (item) {
        if (item.mode === "loading") {
          item.mode = "on";
        } else {
          item.mode = "gif";
        }
      },
      setGalleries: function (images) {
        WebViewJavascriptBridge.callHandler('setGalleries', {'images': JSON.stringify(images)});
      },
      videoPlay: function (item, event) {
        let {src, mode: type, site, hash} = item;
        if (src.indexOf("qnssl.com") > 0) {
          src = "http://www.dqdvideo.com/" + hash;
        }
        if (type === 'browser') {//外部浏览器中打开 安卓TODO
          WebViewJavascriptBridge.callHandler('startBrowser', {'url': src, 'target': 1, 'src': src});
        } else if (type === 'h5') {//内部浏览器中打开
          WebViewJavascriptBridge.callHandler('startBrowser', {'url': src, 'target': 0, 'src': src});
        } else {//应用内打开
          WebViewJavascriptBridge.callHandler('play', {'url': src, 'stream': hash, 'referer': src});
        }
      },
      optionSel: function (item, index, box) {
        let selList = box.selList;
        if (box.max_vote == 1) {
          selList[0] = item.id;
          box.options.forEach(function (item) {
            if (item.voted) {
              Vue.set(item, 'total', item.total - 1);
            }
            Vue.set(item, 'sel', false);
            Vue.set(item, 'voted', false)
          });

          Vue.set(item, 'total', item.total + 1);
          Vue.set(item, 'voted', true);
          Vue.set(item, 'sel', true);

          Vue.set(box, 'selCounter', 1);
          Vue.set(box, 'selList', selList)
        } else {
          if (box.selCounter < box.max_vote) {
            if (item.voted) {
              selList.forEach(function (sel_id, i) {
                if (sel_id === item.id) {
                  selList.splice(i, 1)
                }
              });
              Vue.set(item, 'sel', false);
              Vue.set(box, 'selCounter', box.selCounter - 1);
              Vue.set(box, 'selList', selList);
              Vue.set(item, 'total', item.total - 1);
              Vue.set(item, 'voted', false);

            } else {
              selList.push(item.id);
              Vue.set(item, 'sel', true);
              Vue.set(box, 'selCounter', box.selCounter + 1);
              Vue.set(box, 'selList', selList);
              Vue.set(item, 'total', item.total + 1);
              Vue.set(item, 'voted', true);
            }
          }
        }
      },
      optionSub: function (item) {
        let data = {
          id: item.id,
          list: item.selList
        };
        Vue.set(item, 'voted', true);
        Vue.set(item, 'voteCount', item.voteCount + item.selList.length);
        let options = {
          method: 'post',
          url: `https://${this.prefix}api.dongdong.com/poll/commit`,
          param: data
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
        });
      },
      audioPlay: function (item, event) {
        let musicBox = event.target.parentNode.parentNode;
        let music = musicBox.getElementsByTagName('audio')[0];
        let curPro = musicBox.getElementsByClassName('progress')[0];
        music.play();
        item.pause = false;
        let musicPlay = window.setInterval(function () {
          let cur = music.currentTime / music.duration * 100 + '%';
          if (music.currentTime === music.duration) {
            window.clearInterval('musicPlay')
            item.pause = true
          }
          curPro.style.width = cur;
        }, 1000);
      },
      audioPause: function (item) {
        let musicBox = event.target.parentNode.parentNode;
        let music = musicBox.getElementsByTagName('audio')[0];
        music.pause();
        window.clearInterval('musicPlay')
        item.pause = true
      },
      dqdAdLink: function () {
        if (pageParams.platform === 'android') {
          window.location.href = this.dqd_ads.android_href
        } else {
          window.location.href = this.dqd_ads.ios_href
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  article {
    margin: 0 15px 15px 15px;
  }

  article p {
    line-height: 30px;
  }

  article .con {
    margin-top: 20px;
  }

  article h2 {
    line-height: 1.5;
    font-weight: 600;
    margin: 10px 0;
    padding: 0 0 0 10px;
    position: relative;
    color: #333;
  }

  article h2 span {
    height: 1em;
    width: 2px;
    display: block;
    position: absolute;
    top: 0.2em;
    left: 0;
    background: #16b13a
  }

  article img {
    display: block;
    width: 100%;
  }

  article video {
    display: block;
    margin: 0 auto;
    background: #3e3e3e no-repeat center center;
    background-size: 118px;
    border-radius: 1px;
    -moz-border-radius: 1px;
    -webkit-border-radius: 1px;
  }

  .img-container {
    display: block;
    position: relative;
    z-index: 1000;
    margin: 20px auto 10px;
    min-height: 46px;
  }

  .img-container.off {
    background: url(../assets/img_holder_off.png) center center no-repeat #efefef;
    background-size: auto 46px;
  }

  .img-container.off, .img-container.loading, .img-container.error {
    height: 200px;
  }

  .img-container.loading {
    z-index: 1000;
    position: relative;
    background: url(../assets/loading_circle.gif) #efefef no-repeat center center;
    background-size: 20px 20px;
  }

  .img-container.error {
    z-index: 1000;
    position: relative;
    background: url(../assets/icon-img-error.png) #efefef no-repeat center center;
    background-size: 40px 40px;
  }

  .media-holder {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: url(../assets/play@80x80.png) no-repeat center center;
    background-size: 40px 40px;
  }

  .media-label {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url(../assets/icon_gif_play_con.png) 0 0 no-repeat;
    width: 78px;
    height: 30px;
    background-size: 100% 100%;
    text-indent: 1000px;
  }

  .media-error {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url(../assets/icon-img-error.png) 0 0 no-repeat;
    width: 40px;
    height: 40px;
    background-size: 100% 100%;
    text-indent: 1000px;
  }

  .media-loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url(../assets/loading_circle.gif) transparent no-repeat center center;
    filter: alpha(opacity=30);
    opacity: 0.3;
    background-size: 20px 20px;
  }

  .media-container {
    display: block;
    position: relative;
    z-index: 1000;
    margin: 20px auto 10px;
  }

  .media-container-video {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-color: rgba(0, 0, 0, 0.5);
    border-bottom: 20px solid #000000;
    border-top: 20px solid #000000;
    width: 100%;
    background-image: url('http://img1.dongqiudi.com/fastdfs/M00/0C/C5/ooYBAFg-lWeASiMwAAE9gCQQKDI777.png');
  }

  .media-holder-video {
    background: url(../assets/video_play.png) no-repeat center center;
    background-size: 50px 50px;
  }

  a.product_box:visited {
    color: #333333;
  }

  .product_box {
    color: #333333;
    display: block;
    position: relative;
    background: #ffffff;
    padding: 15px;
    border: 1px solid #e9e9e9;
    height: 100px;
    margin: 20px 0
  }

  .product_box img {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 0;
    margin: 0 10px 0 0
  }

  .product_box h3 {
    text-indent: 0;
    overflow: hidden;
    font-size: 14px;
    overflow: hidden;
    line-height: 18px;
    margin: 0 0 8px;
    padding: 0;
    font-weight: 400;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .product_box p {
    color: #999;
    text-indent: 0;
    height: 22px;
    line-height: 22px !important;
    margin: 0;
    padding: 0;
    font-size: 12px;
  }

  .product_box p span {
    position: relative;
    bottom: 8px;
    font-size: 16px;
    color: #ea1600;
    vertical-align: baseline;
    display: inline-block;
    font-family: arial;
    font-weight: 400;
    height: 16px;
  }

  .product_box a.pro_go {
    position: absolute;
    bottom: 15px;
    right: 15px;
    margin-top: -10px;
    font-size: 12px;
    line-height: 30px;
    height: 30px;
    background: #ff3939;
    color: #fff;
    text-decoration: none;
    text-align: center;
    width: 75px;
  }

  .product_box p em {
    position: relative;
    bottom: 8px;
    font-style: normal;
    text-decoration: line-through;
    margin-left: 3px;
    font-size: 12px;
  }

  .reco_box {
    background: #ffffff;
    padding: 19px 16px 0;
    height: 65px;
    margin: 20px 0;
    position: relative;
    border: 1px solid #e9e9e9
  }

  .reco_box img {
    margin: 0;
    width: 45px;
    border-radius: 50%;
    position: absolute;
    top: 20px;
    height: 45px;
    left: 16px
  }

  .reco_box .con {
    height: 65px;
    line-height: 50px;
    vertical-align: middle;
    padding: 0 75px 0 55px;
    overflow: hidden;
    margin: 0;
  }

  .reco_box strong {
    height: 17px;
    line-height: 17px;
    overflow: hidden;
    margin-bottom: 2px;
    display: block;
    color: #2d2f32;
    font-size: 15px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .reco_box p {
    width: 100%;
    height: 55px;
    color: #8c9399;
    text-indent: 0;
    line-height: 20px;
    margin: 0;
    padding: 0;
    font-size: 12px;
    vertical-align: middle;
    display: inline-block;
  }

  .reco_box .btn_con {
    width: 80px;
    height: 50px;
    position: absolute;
    top: 20px;
    right: 16px;
    text-align: right;
    line-height: 50px;
  }

  .reco_box a.pro_go {
    height: 22px;
    line-height: 22px;
    width: 60px;
    border-radius: 2px;
    display: inline-block;
    padding: 2px 0;
    text-align: center;
    font-size: 14px;
    background: #ffffff;
    color: #16a73a;
    border: 1px solid #16a73a;
    text-decoration: none;
  }

  .reco_box p span {
    display: block;
    overflow: hidden;
    height: 30px;
    line-height: 15px !important;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 12px;
  }

  .audio {
    background-color: #ffffff;
    overflow: hidden;
    padding: 4px;
    position: relative;;
    margin: 24px auto;
    border: 1px solid #e9e9e9;
    height: 40px;
  }

  .audio a {
    width: 40px;
    height: 40px;
    float: right;
    margin-top: -43px;

  }

  .audio a.play {
    background: url(../assets/icon_play.png) center center no-repeat;
    background-size: 12px
  }

  .audio a.pause {
    background: url(../assets/icon_pause.png) center center no-repeat;
    background-size: 12px
  }

  .audio .main {
    padding-left: 50px;
    background: url(../assets/bg_music.png) 0 0 no-repeat;
    background-size: 40px 40px;
  }

  .audio .main h3 {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #2d2f32;
    font-weight: 400;
    margin: 0;
    padding: 0;
  }

  .audio .main p {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #8c9399;
    margin: 0;
    padding: 0;
  }

  .audio .progress {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: #55c818;
  }

  .audio audio {
    position: absolute;
    display: none;
  }

  .vote_box {
    position: relative;
    border: 1px solid #e9e9e9;
    margin: 30px 0;
  }

  .vote_box h4 {
    position: absolute;
    top: -37px;
    width: 100%;
    line-height: 20px;
    height: 20px;
    left: 0;
    text-align: center
  }

  .vote_box span {
    display: inline-block;
    font-size: 16px;
    padding: 0 10px;
    background: #f7f7f7
  }

  .vote_box dl {
    margin: 0;
    padding: 0;
  }

  .vote_box dt {
    line-height: 20px;
    padding: 20px 0 12px 12px;
    font-size: 14px;
    color: #2d2f32;
    text-align: left;
  }

  .vote .radio dt span {
    fonts-size: 14px;
  }

  .vote_box dd {
    padding: 13px 10px 13px 40px;
    line-height: 24px;
    border-top: 1px solid #e9e9e9;
    position: relative;
  }

  .vote_box .re dd {
    padding: 10px;
  }

  .vote_box h3 {
    color: #5b6463;
    line-height: 20px;
    font-size: 14px;
    margin: 0;
    padding: 0 26px 0 0;;
    position: relative;
    font-weight: 400;
  }

  .vote_box .re h3 {
    color: #2d2f32;
  }

  .vote_box h3 span {
    color: #2d2f32;
    position: absolute;
    bottom: 8px;
    right: 0;
    width: 26px;
    text-align: right;
    height: 14px;
    line-height: 14px;
  }

  .vote_box h3 em {
    color: #fff;
    background: #ff8d06;
    padding: 0 3px;
    border-radius: 2px;
    font-size: 10px;
    line-height: 16px;
    height: 16px;
    display: inline-block;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform: scale(.75);
    font-style: normal;
    font-weight: 400;
  }

  .vote_box div.rank {
    width: 100%;
    height: 16px;
    line-height: 16px;
    background: #e9e9e9;
  }

  .vote_box div.bar {
    background: #4ccf6c;
    height: 16px;
    line-height: 16px;
  }

  .vote_box div.voted {
    background: #ff8d06;
  }

  .vote_box dd span.tag {
    position: absolute;
    width: 12px;
    line-height: 20px;
    height: 12px;
    border: 1px solid #8dc99b;
    top: 18px;
    left: 15px;
    padding: 0;
  }

  .vote_box .checkbox span.tag {
    border-radius: 5px;
  }

  .vote_box .checkbox dd.checked span.tag {
    background: url(../assets/poll_check.png) center center no-repeat;
    border: 0;
    padding: 1px;
    border-radius: 0;
    background-size: 100% 100%
  }

  .vote_box .radio span.tag {
    border-radius: 20px;
  }

  .vote_box .radio dd.checked span.tag {
    background: url(../assets/check_r.png) center center no-repeat;
    border: 0;
    padding: 1px;
    border-radius: 0;
    background-size: 100% 100%
  }

  .vote_box .text {
    padding: 10px 0;
    height: 40px;
    text-align: center;
    line-height: 20px;
    border-top: 1px solid #ebebeb;
    font-size: 13px;
    color: #adadad
  }

  .vote_box .text p {
    text-align: center;
    height: 40px;
    margin: 0;
    padding: 2px 0;
    font-size: 15px;
    line-height: 40px !important;
    color: #333333;
  }

  .vote_box .text span {
    display: inline-block;
    max-width: 100px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .vote_box a.btn {
    display: block;
    width: 90px;
    background: #f7f7f7;
    margin: 0 auto;
    color: #16ac3a;
    text-align: center;
    height: 35px;
    font-size: 15px;
    line-height: 35px;
    padding: 0;
    border: 1px solid #16ac3a;
    border-radius: 3px;
    text-decoration: none;

  }

  .vote_box a.btn_dis {
    background: #f7f7f7;
  }

  .tips {
    display: block;
    width: 100%;
    font-size: 0.8em;
    color: #888888;
    line-height: 1.5
  }

  .tips_v {
    display: block;
    width: 100%;
    font-size: 0.8em;
    color: #8c9399;
    line-height: 1.5
  }

  #news_ad {
    margin: 0
  }

  #news_ad h2 {
    font-size: 16px;
    margin: 0;
    height: 20px;
    padding: 5px 0 15px 0;
  }

  #news_ad .ad_main {
    position: relative;
    padding: 10px 60px 10px 75px;
    height: 55px;
    background: #fff;
    border-radius: 3px;
  }

  #news_ad .ad_main img {
    margin: 0;
    position: absolute;
    top: 10px;
    left: 10px;
    height: 55px;
    width: 55px;
    border-radius: 10px;
    border: 1px solid #ebebeb;
  }

  #news_ad .ad_main img {
    border-radius: 0;
    border: none;
  }

  #news_ad .ad_main a {
    display: block;
    position: absolute;
    text-align: center;
    top: 24px;
    right: 10px;
    width: 60px;
    height: 26px;
    line-height: 26px;
    text-decoration: none;
    color: #fff;
    background: #00c0ff;
    border-radius: 3px;
    font-size: 15px;
  }

  #news_ad .ad_main h3 {
    height: 24px;
    font-weight: 400;
    line-height: 24px;
    font-size: 15px;
    color: #000;
    margin: 0;
    padding: 0;
  }

  #news_ad .ad_main h6 {
    height: 40px;
    overflow: hidden;
    font-weight: 400;
    line-height: 16px;
    font-size: 12px;
    margin: 0;
    padding: 0;
    color: #989898;
    width: 106%;
    transform: scale(0.85);
    transform-origin: 0 0;
  }

  #agreement {
    text-align: center;
    padding-top: 4px;
    padding-bottom: 10px;
  }

  #agreement_con {
    height: 10px;
    border-bottom: 1px solid #dddddd;
    display: inline-block;
    line-height: 20px;
    padding: 0 25px;
  }

  #agreement_con span {
    display: inline-block;
    background: #f5f5f5;
    padding: 0 5px;
    color: #999999;
    font-size: 13px;
  }

  .report_con {
    margin: 18px 0 0;
    height: 20px;
    padding: 0;
    color: #999999;
  }

  .report_con span {
    float: left;
    height: 20px;
    font-size: 13px;
  }

  .report_con a {
    color: #999999;
    float: right;
    height: 20px;
    font-size: 13px;
  }

  #news_ad {
    margin: 0
  }
</style>
