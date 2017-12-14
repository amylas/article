<template>
  <div class="main">
    <topicCell v-if="column_id" v-once></topicCell>
    <headerTitle></headerTitle>
    <articleCon v-bind:class="fontSize" :is_feed="0"></articleCon>
    <infos v-once></infos>
    <donate></donate>

    <relatedNewsByTopic v-if="column_id" :ready="relativeTurn"></relatedNewsByTopic>
    <relatedNews v-else :ready="relativeTurn"></relatedNews>

    <comments :ready="commentsTurn"></comments>
    <advertisement :ready="advertisementTurn"></advertisement>
    <share :ready="shareTurn"></share>
  </div>
</template>

<script type="text/javascript">
  import Vue from 'vue'
  import topicCell from './components/topicCell'
  import headerTitle from './components/headerTitle'
  import articleCon from './components/articleCon'
  import infos from './components/infos'
  import donate from './components/donate'
  import relatedNews from './components/relatedNews'
  import relatedNewsByTopic from './components/relatedNewsByTopic'
  import comments from './components/comments'
  import advertisement from './components/advertisement'
  import share from './components/share'

  export default {
    name: 'news',
    data () {
      return {
        fontSize: pageParams.fontSize,
        column_id: vueData.infos.column.id,
        donateLoad: false,
        relativeLoad: false,
        commentsLoad: false,
        advertisementLoad: false,
      }
    },
    computed: {
      relativeTurn: function () {
        return this.donateLoad;
      },
      commentsTurn: function () {
        return this.donateLoad && this.relativeLoad;
      },
      advertisementTurn: function () {
        return this.donateLoad && this.relativeLoad && this.commentsLoad;
      },
      shareTurn: function () {
        return this.donateLoad && this.relativeLoad && this.commentsLoad && this.advertisementLoad;
      },
    },
    created: function () {
      let that = this;
      that.$bus.on('donate', function () {
        that.donateLoad = true;
      });
      that.$bus.on('relative', function () {
        that.relativeLoad = true;
      });
      that.$bus.on('comments', function () {
        that.commentsLoad = true;
      });
      that.$bus.on('advertisement', function () {
        that.advertisementLoad = true;
      });
    },
    mounted: function () {
      let that = this;
      (new Image()).src = `https://${that.prefix}api.dongdong.com/archive/app/click/${that.article_id}`;
    },
    methods: {},
    components: {
      topicCell, headerTitle, articleCon, donate, infos, relatedNews, relatedNewsByTopic, comments, advertisement, share
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
