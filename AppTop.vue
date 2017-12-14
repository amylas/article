<template>
  <div class="main">
    <headerTitleTop></headerTitleTop>
    <articleConTop v-bind:class="fontSize" :visit_total="visit_total"></articleConTop>
    <infos v-once></infos>
    <like></like>
    <comments :ready="commentsTurn"></comments>
    <share :ready="shareTurn"></share>
  </div>
</template>

<script>

  import Vue from 'vue'
  import headerTitleTop from './components/headerTitleTop'
  import articleConTop from './components/articleConTop'
  import infos from './components/infos'
  import like from './components/like'
  import comments from './components/comments'
  import share from './components/share'

  export default {
    name: 'top',
    data() {
      return {
        fontSize: vueData.fontSize,
        donateLoad: false,
        likeLoad: false,
        visit_total: '',
        commentsLoad: false,
        commentsTurn: true
      }
    },
    computed: {
      shareTurn: function () {
        return this.commentsLoad;
      },
    },
    created: function () {
      let that = this;
      that.$bus.on('comments', function () {
        that.commentsLoad = true;
      });
    },
    mounted: function () {
      this.visitor();
    },
    methods: {
      visitor: function () {
        let that = this;
        (new Image()).src = `https://${that.prefix}api.dongdong.com/archive/app/click/${that.article_id}`;
        let options = {
          method: 'get',
          url: `https://${that.prefix}api.dongdong.com/v2/article/visitor/${that.article_id}`,
          param: {}
        };

        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          that.visit_total = data.visit_total;
        });
      }
    },
    components: {
      headerTitleTop, articleConTop, infos, like, share, comments
    }
  }


</script>

<style>
  body {
    -webkit-touch-callout: none;
    font-family: 'PingFang SC', "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 17px;
    padding: 0 0 20px 0;
    margin: 0 0 15px 0;
    color: #333333;
    background: #f7f7f7;
  }

  a {
    color: #16b13a;
    text-decoration: none;
  }

  p {
    line-height: 1.6;
    word-wrap: break-word;
    word-break: normal;
    margin: 20px 0;
  }

  .l p {
    font-size: 18px;
  }

  .l h2 {
    font-size: 20px;
  }

  .l h3 {
    font-size: 18px;
  }

  .m p {
    font-size: 17px;
  }

  .m h2 {
    font-size: 18px;
  }

  .s p {
    font-size: 16px;
  }

  .s h2 {
    font-size: 17px;
  }

  .s h3 {
    font-size: 16px;
  }

  article p, article span {
    line-height: 1.7 !important;
  }

  ul,
  li,
  dl,
  dt,
  dd {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .clearfix {
    overflow: auto;
    zoom: 1;
  }
</style>
