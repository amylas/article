<template>
  <article>
    <template class="con">
      <p v-html="content"></p>
      <!--images-->
      <section class="img-cell clearfix" :class="imgDisplayMode">
        <template v-for="(item,i) in images">
          <div class="img-container" :class="item.mode" v-on:click="showImg(item,$event)"
               :style="'height:'+ img_height+'px;'">
            <img :src="item.src"
                 v-show="item.mode === 'on' || item.mode === 'gifError' || item.mode === 'gifLoading' || item.mode === 'gif'"
                 @load="imgLoaded(item)">
            <template v-if="item.type === 'gif' && images.length ===1">
              <div class="media-loading" v-if="item.mode === 'gifLoading'"></div>
              <div class="media-label" v-if="item.mode ==='on'"></div>
              <div class="media-error" v-if="item.mode ==='gifError'"></div>
            </template>
            <template v-else-if="item.type === 'gif' && item.mode ==='on'">
              <span class="media-label-sm"></span>
            </template>
          </div>
        </template>
      </section>

      <!--video-->
      <template v-for="(item,i) in videos">
        <template>
          <div class="mask"></div>
          <div class="media-container media-container-video"
               v-if="item.image" v-on:click="videoPlay(item)"
               v-bind:style="{'backgroundImage':'url('+item.image+')','height':video_height+'px'}">
            <div class="media-holder media-holder-video"></div>
          </div>
          <div class="media-container media-container-video" v-else v-on:click="videoPlay(item)"
               v-bind:style="{'height':video_height+'px'}">
            <div class="media-holder media-holder-video"></div>
          </div>
          <span class="tips_v" v-if="item.tips">{{item.tips}}</span>
        </template>
      </template>
      <!--end video-->
    </template>

    <div class="report_con">
      <span>阅读 {{visit_total}}</span>
      <a :href="'dongdong:///report/' + article_id" class="report_btn">举报</a>
    </div>

  </article>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'articleCon',
    data: function () {
      return {
        content: vueData.mini_top_content.content,
        images: vueData.mini_top_content.images,
        videos: vueData.mini_top_content.videos,
        video_height: (pageParams.mainWidth) * 9 / 16 - 40,
        imgDisplayMode: "cell-3",
        imgMode: pageParams.imgMode,
        img_height: 'auto'
      }
    },
    props: ["visit_total"],
    created: function () {

    },
    mounted: function () {
      let that = this;
      that.imagesInit();
    },
    methods: {
      imagesInit: function () {
        let imgCount = this.images.length;
        if (imgCount === 1) {
          this.imgDisplayMode = "cell-1";
          let _height = this.images[0].width && this.images[0].height ? pageParams.mainWidth / this.images[0].width * this.images[0].height : "";
          Vue.set(this, 'img_height', _height);
        } else if (imgCount === 2 || imgCount === 4) {
          this.imgDisplayMode = "cell-2";
          Vue.set(this, 'img_height', pageParams.mainWidth * 0.49);
        } else {
          this.imgDisplayMode = "cell-3";
          Vue.set(this, 'img_height', pageParams.mainWidth * 0.32);
        }
        for (let i = 0, len = this.images.length; i < len; i++) {
          Vue.set(this.images[i], 'mode', this.imgMode);
          Vue.set(this.images[i], 'imgIndex', i);

          if (this.imgMode === "off") {
            Vue.set(this.images[i], 'src', "");
          } else if (this.imgMode === "loading") {
            this.imgSrc(this.images[i], this.images[i].dataSrc)
          }
        }
        this.setGalleries(this.images.map(x => x.origSrc));
      },
      imgSrc: function (item, src) {
        WebViewJavascriptBridge.callHandler("downloadImage", {src: src}, function (data) {
          if (data !== "") {
            Vue.set(item, 'src', data);
          } else if (item.mode === 'loading') {
            item.mode = 'error';
          } else {
            item.mode = 'gifError';
          }
        });
      },
      showImg: function (item, ev) {
        if (item.mode === "off" || item.mode === "error") {
          Vue.set(item, 'mode', "loading");
          this.imgSrc(item, item.dataSrc)
        } else if ((item.mode === "on" || item.mode === "gifError") && this.images.length === 1 && item.type === "gif") {
          Vue.set(item, 'mode', "gifLoading");
          this.imgSrc(item, item.origSrc);
        } else {
          this.imgView(item);
        }
      },
      imgLoaded: function (item) {
        if (item.mode === "loading") {
          Vue.set(item, 'mode', "on");
        } else {
          Vue.set(item, 'mode', "gif");
        }
      },
      setGalleries: function (images) {
        WebViewJavascriptBridge.callHandler('setGalleries', {'images': JSON.stringify(images)});
      },
      imgView: function (item) {
        WebViewJavascriptBridge.callHandler('gallery', {'index': item.imgIndex});
      },
      videoPlay: function (item, event) {
        let {url: src, mode: type, site, hash} = item;
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  article {
    margin: 0 15px 30px 15px;
  }

  article p {
    line-height: 30px;
    margin: 6px auto;
  }

  article .con {
    margin-top: 20px;
  }

  .img-cell {
    margin: 12px 0 24px;
  }

  .img-cell .img-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .img-cell .media-label-sm {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url(../assets/icon_gif_play_com.png) 0 0 no-repeat;
    width: 63px;
    height: 24px;
    background-size: 100% 100%;
  }

  .cell-1 .gif-label {
    background: url(../assets/icon_gif_play_con.png) 0 0 no-repeat;
    width: 78px;
    height: 30px;
  }

  .img-cell img {
    width: 100%;
    height: auto;
  }

  .cell-1 .img-container {
    width: 100%;
    background: #efefef no-repeat center center;
    overflow: hidden;

  }

  .img-cell .img-container.loading {
    background: url(../assets/loading_circle.gif) #efefef no-repeat center center;
    background-size: 20px 20px;
  }

  .img-cell .img-container.off {
    background: url(../assets/img_holder_off.png) center center no-repeat #efefef;
    background-size: auto 46px;
  }

  .img-cell .img-container.error {
    background: url(../assets/icon-img-error.png) #efefef no-repeat center center;
    background-size: 40px 40px;
  }

  .img-cell .gifloading {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: url(../assets/loading_circle.gif) #efefef no-repeat center center;
    opacity: .3;
    -webkit-opacity: .3;
    -moz-opacity: .3;
    background-size: 20px 20px;
  }

  .cell-2 .img-container {
    width: 49%;
    background: #efefef no-repeat center center;
    float: left;
    margin-bottom: 2%;
  }

  .cell-2 .img-container:nth-child(2n) {
    float: right;
  }

  .cell-3 .img-container {
    width: 32%;
    background: #efefef no-repeat center center;
    float: left;
    margin-bottom: 2%;
  }

  .cell-3 .img-container:nth-child(3n+1) {
    margin-right: 2%;
  }

  .cell-3 .img-container:nth-child(3n) {
    float: right;
  }

  article img.data-gif-src {
    width: 100%
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

  .media-container {
    display: block;
    position: relative;
    z-index: 1000;
    margin: 0 auto;
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

  .img-off-holder {
    width: 100%;
    height: auto;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  .video {
    position: relative
  }

  .video .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url(../assets/icon_playing.png) center center no-repeat rgba(0, 0, 0, 0.5);
    background-size: auto 20px;
    z-index: 10000;
    display: none;
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
    background-size: 65px 65px;
  }

  .report_con {
    margin: 46px 0 0;
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
</style>
