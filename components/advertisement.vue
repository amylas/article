<template>
  <div v-if="loadAds === true && ready">
    <!--icon_txt_download-->
    <div class="ad-apps" v-if="adType === 'icon_txt_download'">
      <dl>
        <dt><span>应用推荐</span></dt>
        <dd v-for="advertisement in ads" @click.prevent="adClick(advertisement,$event)">
          <a>
            <div class="ad-apps-img"
                 :style="advertisement.image?'backgroundImage:url('+ advertisement.image +')':''"></div>
            <span class="ad-apps-name">{{advertisement.app_name}}</span>
            <span class="ad-apps-intr">{{advertisement.summary}}</span>
            <span class="ad-apps-download">立即下载</span>
          </a>
        </dd>
      </dl>
    </div>
    <!--big_picture_txt-->
    <div class="ad big_picture_txt" v-else-if="adType === 'big_picture_txt'"
         @click.prevent="adClick(advertisement,$event)">
      <h3>{{advertisement.title}}</h3>
      <div class="ad-img" :style="advertisement.image?'backgroundImage:url('+ advertisement.image +');':''">
        <span class="ad-type" :style="'background: '+advertisement.label_color+';'"
              v-if="advertisement.label">{{advertisement.label}}</span>
      </div>
    </div>
    <!--big_picture_txt_download-->
    <div class="ad big_picture_txt_download" v-else-if="adType === 'big_picture_txt_download'"
         @click.prevent="adClick(advertisement,$event)">
      <h3>{{advertisement.title}}</h3>
      <div class="ad-img" :style="advertisement.image?'backgroundImage:url('+ advertisement.image +');':''">
      </div>
      <span class="ad-name">点击下载「{{advertisement.app_name}}」</span>
      <span class="ad-type"
            :style="'border: 1px solid '+advertisement.label_color+';color: '+advertisement.label_color+';'"
            v-if="advertisement.label">{{advertisement.label}}</span>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default{
    data(){
      return {
        advertisement: {},
        adRelative: {},
        ads: [],
        loadAds: false,
        param: {
          cts: vueData.infos && vueData.infos.channels ? vueData.infos.channels.map(x => "article_" + x.id).join(",") : '',
          pgid: '1.3.1',
          position: ""
        },
        adType: "big_picture_txt"//icon_txt_download //big_picture_txt_download
      }
    },
    props: ['ready'],
    created: function () {
      let that = this;
      this.prefix = this.prefix.replace('test1-', 'test-');
      this.getAd();
      this.$bus.on('relativeAdClick', function (obj) {
        that.adClick(obj.ad, obj.ev);
      });
    },
    methods: {
      scrollMon: function () {
        let that = this;
        let winHeight = document.documentElement.clientHeight;
        let adBlock = null;
        let adBlock2 = null;
        window.addEventListener("scroll", is_visible, false);
        window.addEventListener("scroll", is_visible_relative, false);
        setTimeout(function () {
          is_visible();
          is_visible_relative();
        }, 200);

        function is_visible() {
          if (!adBlock) {
            adBlock = document.querySelector(".ad,.ad-apps");
          }
          if(adBlock == null) return;
          let footerOffsetTop = adBlock.getBoundingClientRect().top;
          if (footerOffsetTop - winHeight < 0) {
            window.removeEventListener("scroll", is_visible, false);
            let ads = that.ads.length > 0 ? that.ads : [that.advertisement];
            //曝光监控
            ads.map(function (ad) {
              let imp_mon_arr = ad.imp_mon_arr || [];
              imp_mon_arr.map(function (v) {
                v = v.replace("__TT__", (+new Date()));
                v = v.replace("__CP__", "");
                (new Image()).src = v;
              });
            });
          }
        }

        function is_visible_relative() {
          if (adBlock2 == null) {
            adBlock2 = document.querySelector(".ad-relative");
          }
          if(adBlock2 == null) return;
          let footerOffsetTop = adBlock2.getBoundingClientRect().top;
          if (footerOffsetTop - winHeight < 0) {

            window.removeEventListener("scroll", is_visible_relative, false);
            //曝光监控
            let imp_mon_arr = that.adRelative.imp_mon_arr || [];
            imp_mon_arr.map(function (v) {
              v = v.replace("__TT__", (+new Date()));
              v = v.replace("__CP__", "");
              (new Image()).src = v;
            });
          }
        }

      },
      getAd: function () {
        let options = {
          method: 'get',
          url: `https://${this.prefix}ap.dongdong.com/plat/v3`,
          param: {
            pgid: this.param.pgid,
            ct: this.param.cts
          }
        };
        WebViewJavascriptBridge.callHandler("adRequest", options, this.responseAd);
      },
      getBaseAd: function () {
        let prefix = this.prefix === "beta-" ? "beta" : "default";
        let options = {
          method: 'get',
          url: `https://ap-static.dongdong.com/ap-api/${prefix}/${this.param.pgid}.json`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, this.responseBaseAd);
      },
      responseAd: function (data) {
        let that = this;
        that.$bus.emit('advertisement');
        if (data.code === 1001) {//超时
          this.adFailTrack(100001);//请求超时
          this.getBaseAd();
          return;
        } else if (data.code === 1002) {
          this.adFailTrack(100004); //广告服务器故障
          this.getBaseAd();
          return;
        } else if (data.code === 1003) {
          this.adFailTrack(100003);//广告解析错误
          this.getBaseAd();
          return;
        }

        let ads = data.data;
        if (Object.prototype.toString.call(ads) !== "[object Array]") {
          this.adFailTrack(100003);//广告解析错误
          this.getBaseAd();
          return;
        } else if (ads.length === 0) {
          this.adFailTrack(100002);//返回广告为空
          this.getBaseAd();
          return;
        }
        this.mountAd(ads);
      },
      responseBaseAd: function (ads) {
        let that = this;
        that.$bus.emit('advertisement');
        if (ads.length === 0) {
          return;
        }
        that.mountAd(ads);
      },
      mountAd: function (ads) {
        let that = this;
        this.loadAds = true;

        let type = ads[0].ad_type;
        Vue.set(this, 'adType', type);
        let adRelative = null;
        if (type === "icon_txt_download") {//多个应用下载
          for (let i = 0, len = ads.length; i < len; i++) {
            let ad = ads[i];
            if (ad.position === "4") {
              adRelative = ad;
              break;
            } else {
              Vue.set(this.ads, i, {});
              Vue.set(this.ads[i], 'image', "");
              Vue.set(this.ads[i], 'ios_link', ad["ad_source"].ios_link);
              Vue.set(this.ads[i], 'android_link', ad["ad_source"].android_link);
              Vue.set(this.ads[i], 'summary', ad["ad_source"].summary);
              Vue.set(this.ads[i], 'app_name', ad["ad_source"].app_name);
              Vue.set(this.ads[i], 'label', ad["ad_source"].label);
              Vue.set(this.ads[i], 'label_color', ad["ad_source"].label_color);
              Vue.set(this.ads[i], 'imp_mon_arr', ad.imp_mon_arr);
              Vue.set(this.ads[i], 'click_mon_arr', ad.click_mon_arr);

              let img = new Image();
              img.onload = function () {
                Vue.set(that.ads[i], 'image', ad["ad_source"].image[0].pic);
              };
              img.onerror = function () {
                that.param.position = ad.position;
                that.adFailTrack(100005);//素材下载失败
              };
              let url = ad["ad_source"].image[0].pic;
              if (url) {
                img.src = url;
              }
            }
          }
        } else {
          let ad = ads[0];
          if (ad.position !== "4") {
            Vue.set(this.advertisement, 'image', "");
            Vue.set(this.advertisement, 'ios_link', ad["ad_source"].ios_link);
            Vue.set(this.advertisement, 'android_link', ad["ad_source"].android_link);
            Vue.set(this.advertisement, 'title', ad["ad_source"].title);
            Vue.set(this.advertisement, 'app_name', ad["ad_source"].app_name);
            Vue.set(this.advertisement, 'label', ad["ad_source"].label);
            Vue.set(this.advertisement, 'label_color', ad["ad_source"].label_color);
            Vue.set(this.advertisement, 'imp_mon_arr', ad.imp_mon_arr);
            Vue.set(this.advertisement, 'click_mon_arr', ad.click_mon_arr);

            let img = new Image();
            img.onload = function () {
              Vue.set(that.advertisement, 'image', ad["ad_source"].image[0].pic);
            };
            img.onerror = function () {
              that.param.position = ad.position;
              that.adFailTrack(100005);//素材下载失败
            };
            let url = ad["ad_source"].image[0].pic;
            if (url) {
              img.src = url;
            }
          }
          adRelative = ads.filter(x => x.position === '4')[0];
        }
        if (adRelative) {
          this.adRelative.ad_type = adRelative["ad_type"];
          this.adRelative.image = adRelative["ad_source"].image[0].pic;
          this.adRelative.ios_link = adRelative["ad_source"].ios_link;
          this.adRelative.android_link = adRelative["ad_source"].android_link;
          this.adRelative.title = adRelative["ad_source"].title;
          this.adRelative.app_name = adRelative["ad_source"].app_name;
          this.adRelative.summary = adRelative["ad_source"].summary;
          this.adRelative.label = adRelative["ad_source"].label;
          this.adRelative.label_color = adRelative["ad_source"].label_color;
          this.adRelative.imp_mon_arr = adRelative.imp_mon_arr;
          this.adRelative.click_mon_arr = adRelative.click_mon_arr;

          let img = new Image();
          img.onload = function () {
            that.$bus.emit('relativeNewsAd', that.adRelative);
          };
          img.onerror = function () {
            that.$bus.emit('relativeNewsAd', that.adRelative);
            that.param.position = adRelative.position;
            that.adFailTrack(100005);//素材下载失败
          };
          let url = adRelative["ad_source"].image[0].pic;
          if (url) {
            img.src = url;
          }
        }
        Vue.nextTick(function () {
          that.scrollMon();
        });
      },
      adFailTrack: function (tcode) {
        let params = {
          pgid: this.param.pgid,
          ct: this.param.cts,
          tcode: tcode
        };
        if (tcode === 100005) {
          params.position = this.param.position;
        }
        let options = {
          method: 'get',
          url: `https://${this.prefix}dab.dongdong.com/track/v3`,
          param: params
        };
        WebViewJavascriptBridge.callHandler("adRequest", options, function (data) {
        });
      },
      adClick: function (ad, ev) {
        //统计监控
        let click_mon_arr = ad.click_mon_arr || [];
        let promises = click_mon_arr.map(function (url) {
          url = url.replace("__TT__", (+new Date()));
          url = url.replace("__CP__", ev.offsetX + "." + ev.offsetY);
          return new Promise(function (resolve, reject) {
            let image = new Image();

            image.onload = function () {
              resolve(image);
            };
            image.onerror = function () {
              reject();
            };
            image.src = url;
          });
        });

        Promise.all(promises).then(function (posts) {
          goRedirect(ad);
        }).catch(function (reason) {
          goRedirect(ad);
        });

        function goRedirect(ad) {
          let url = pageParams.platform === 'android' ? ad.android_link : ad.ios_link;

          if (url.match(/^dongdong:\/\/\//)) {//匹配 ^dongdong:///
            window.location.href = url;
          } else {
            window.location.href = "dongdong:///url/" + url;
          }
        }
      }
    }
  }
</script>
<style>
  .ad-apps {
    background: #f7f7f7;
    margin: 7% 3% 9%;
    border: 1px solid #e9e9e9;
    border-top: none;
    padding-bottom: 25px;
  }

  .ad-apps dt {
    text-align: center;
    height: 12px;
    line-height: 20px;
    color: #999;
    font-size: 14px;
    border-top: 1px solid #e9e9e9;
    padding: 0 14px;
  }

  .ad-apps dt span {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    display: block;
    height: 20px;
    width: 84px;
    margin: 0 auto;
    background: #f7f7f7;
    position: relative;
    bottom: 10px;
  }

  .ad-apps dd {
    margin: 0 12px;
    position: relative;
  }

  .ad-apps dd a {
    padding: 0 72px 0 56px;
    position: relative;
    margin: 25px 0 0;
    display: block;
    min-height: 43px;
  }

  .ad-apps-img {
    background-color: #e9e9e9;
    width: 43px;
    height: 43px;
    position: absolute;
    left: 0;
    background-position: 50%;
    background-size: 100%;
  }

  .ad-apps-name {
    padding: 0;
    line-height: 21px;
    margin: 0;
    color: #333;
    font-size: 16px;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    overflow: hidden;
  }

  .ad-apps-intr {
    display: block;
    margin-top: 4px;
    color: #999;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ad-apps-download {
    font-size: 12px;
    color: #16b13a;
    border: 1px solid #16b13a;
    padding: 3px 9px;
    border-radius: 3px;
    position: absolute;
    right: 0;
    top: 9px;
  }

  .ad {
    background: #f7f7f7;
    margin: 26px 15px 33px;
    border: 1px solid #e9e9e9;
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }

  .big_picture_txt {
    border-bottom: none;
  }

  .ad h3 {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    max-height: 42px;
    padding: 0;
    margin: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    font-weight: normal;

    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    -o-line-clamp: 2;
    -ms-line-clamp: 2;
    line-clamp: 2;

    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -o-box-orient: vertical;
    -ms-box-orient: vertical;
    box-orient: vertical;
  }

  .ad h3:empty {
    display: none;
  }

  .ad-img {
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 132px;
  }

  .ad-name {
    font-size: 12px;
    color: #888;
    line-height: 38px;
    margin-left: 10px;
  }

  .ad-type {
    position: absolute;
    font-size: 12px;
    padding: 1px 3px;
    font-style: normal;
    right: 0;
    bottom: 0;
    display: block;
    height: 12px;
    line-height: 12px;
    vertical-align: middle;
  }

  .big_picture_txt_download .ad-type {
    right: 10px;
    bottom: 12px;
    border: 1px solid #deb929;
    color: #deb929;
    border-radius: 1px;
  }

  .big_picture_txt .ad-type {
    background: #deb929;
    color: #fff;
  }
</style>
