<template>
  <div id="relatedNews" v-if="loadRelatedNews && ready">
    <dl>
      <dt>
        <span>相关文章</span>
      </dt>

      <dd v-for="(news,index) in relatedNews">
        <template v-if="index === 2 && ad !== null">
          <!--show ad-->
          <a v-on:click="click_ad(ad,$event)" class="ad-relative">
            <div class="img_news" v-bind:style="ad.image?'backgroundImage:url('+ ad.image +');':''"></div>
            <template v-if="ad.ad_type==='picture_txt_download'">
              <p class="ad-relative-appname multiple">{{ad.title}}</p>
              <span class="single">点击下载「{{ad.app_name}}」</span>
            </template>
            <!--picture_txt-->
            <template v-else-if="ad.summary">
              <p class="ad-relative-name single">{{ad.title}}</p>
              <span class="ad-relative-intr multiple">{{ad.summary}}</span>
            </template>
            <template v-else>
              <p class="ad-relative-name multiple">{{ad.title}}</p>
              <span class="ad-relative-intr single">{{ad.summary}}</span>
            </template>

            <span class="ad-type"
                  :style="'border: 1px solid '+ad.label_color+';color: '+ad.label_color+';'"
                  v-if="ad.label">{{ad.label}}</span>
          </a>
        </template>

        <template v-else>
          <a :href="news.schema" v-on:click="click_status(news.schema)">
            <div class="img_news" v-bind:style="{ backgroundImage:'url('+ news.thumb +')' }"></div>
            <p v-html="news.title"></p>
            <span v-html="news.time"></span>
          </a>
        </template>

      </dd>
      <dt v-for="tab in tabs" v-on:click="loadTabs(tab.url)">查看更多 [{{tab.label}}] 新闻</dt>
    </dl>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default{
    name: 'relatedNews',
    data () {
      return {
        tabs: [],
        relatedNews: [],
        loadRelatedNews: false,
        ad: null
      }
    },
    props: ['ready'],
    created: function () {
      let that = this;
      this.init();
      this.$bus.on('relativeNewsAd', function (ad) {
        Vue.set(that, 'ad', ad);
      });
    },
    methods: {
      init: function () {
        let that = this;
        let options = {
          method: 'get',
          url: `https://${this.prefix}api.dongdong.com/v2/article/relative/${this.article_id}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          that.$bus.emit('relative');
          let relatedNews = data.relative;
          let tabs = data.tab;
          if (relatedNews.length > 0) {
            that.loadRelatedNews = true;
            for (let i = 0; i < relatedNews.length; i++) {
              Vue.set(that.relatedNews, i, relatedNews[i]);
            }
            for (let i = 0; i < tabs.length; i++) {
              Vue.set(that.tabs, i, tabs[i]);
            }
            Vue.nextTick(function () {
              that.loadRelativeImages();
            })
          }
        });
      },
      loadTabs: function (url) {
        window.location.href = url;
      },
      loadRelativeImages: function () {
        let that = this;
        for (let i = 0, len = this.relatedNews.length; i < len; i++) {
          WebViewJavascriptBridge.callHandler("downloadImage", {src: this.relatedNews[i].thumb}, function (data) {
            if (data) {
              that.relatedNews[i].src = data;
            }
          });
        }
      },
      click_status: function (scheme) {
        let newsId = scheme.split('/').pop();
        (new Image()).src = `https://stat.dongdong.com/article/relate_touch?type=news&fromid=${this.article_id}&toid=${newsId}`;
      },
      click_ad: function (ad, ev) {
        this.$bus.emit('relativeAdClick', {
          ad: ad,
          ev: ev
        });
      }
    }
  }
</script>

<style>
  #relatedNews {
    background: #f7f7f7;
    margin: 26px 15px 36px;
    border: solid #e9e9e9 1px;
    border-top: none;
  }

  #relatedNews dd {
    margin: 0 12px;
  }

  #relatedNews dt {
    text-align: center;
    height: 12px;
    line-height: 20px;
    color: #999;
    font-size: 14px;
    border-top: 1px solid #e9e9e9;
    padding: 0 14px;
  }

  #relatedNews dt span {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    display: block;
    height: 20px;
    width: 84px;
    margin: 0 auto 0;
    background: #f7f7f7;
    position: relative;
    bottom: 10px;
  }

  #relatedNews dt:not(:first-child) {
    color: #333333;
    height: 50px;
    line-height: 50px;
  }

  #relatedNews dd:nth-child(4) {
    margin-bottom: 26px;
  }

  #relatedNews dd a {
    display: block;
    height: 55px;
    padding: 0 0 0 85px;
    position: relative;
    margin: 26px 0 0;
  }

  #relatedNews dd a .img_news {
    background-color: #e9e9e9;
    width: 75px;
    height: 55px;
    position: absolute;
    left: 0;
    background-position: center center;
    background-size: 100%;
  }

  #relatedNews dd span {
    display: block;
    margin-top: 4px;
    padding-left: 2px;
    color: #999999;
    font-size: 11px;
  }

  #relatedNews p {
    padding: 0;
    line-height: 19px;
    margin: 0;
    color: #333;
    font-size: 16px;
    position: relative;
    bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    max-height: 38px;
  }

  #relatedNews .ad-relative span {
    font-size: 12px;
    margin-right: 30px;
    margin-top: 2px;
    margin-left: 0;
    max-height: 34px;
  }

  #relatedNews .ad-relative .ad-type {
    border: 1px solid #deb929;
    color: #deb929;
    border-radius: 1px;
    z-index: 2;
    position: absolute;
    font-size: 12px;
    padding: 1px 3px;
    display: block;
    height: 12px;
    line-height: 12px;
    vertical-align: middle;
    margin-right: 0;
    /*transform: scale(0.9,0.9);*/
    /*-webkit-transform: scale(0.9,0.9);*/
    /*-moz-transform: scale(0.9,0.9);*/
    /*transform-origin: 100% 100%;*/
    /*-webkit-transform-origin: 100% 100%;*/
    /*-moz-transform-origin: 100% 100%;*/

  }

  #relatedNews .ad-relative-appname {
    height: 38px;
  }

  #relatedNews .ad-relative-intr {
    max-height: 34px;
  }

  #relatedNews .ad-relative .single {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  #relatedNews .ad-relative .multiple {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    -o-line-clamp: 2;
    -ms-line-clamp: 2;
    line-clamp: 2;
    -o-box-orient: vertical;
    -ms-box-orient: vertical;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -moz-box-orient: vertical;
    box-orient: vertical;
    overflow: hidden;
  }
</style>
