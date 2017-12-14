<template>
  <div id="share_con" v-if="ready">
    <template v-if="loadingStatus === ''">看看都有谁分享过本文</template>
    <template v-if="loadingStatus === 'none'">好文章要分享给朋友</template>
    <template v-if="loadingStatus === 'exists'">
      已有 <span class="shared">{{share.total? share.total : '...'}}人</span> 分享该文章
    </template>
    <div class="icon_box" v-if="loadShare === true">
      <template v-for="avatar in share.avatar_list">
        <a v-if="avatar.user" :href="'dongdong:///user/'+avatar.user.id">
          <img class="head" :src="avatar.user.avatar_small">
        </a>
        <a v-else>
          <img class="head" src="../assets/avatar.png">
        </a>
      </template>
    </div>
    <template v-else>
      <div v-if="loadingStatus === ''" class="share-loading">
        <img src="http://static1.dongqiudi.com/web-new/static/img/loading.gif?20161213">
      </div>
      <div v-else class="show-none">
      </div>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default{
    data(){
      return {
        loadingStatus: '',
        share: {
          avatar_list: []
        },
        loadShare: false
      }
    },
    props:['ready'],
    created: function () {
      this.init();
    },
    methods: {
      init: function () {
        let that = this;
        let options = {
          method: 'get',
          url: `https://${this.prefix}api.dongdong.com/share/list/article/${this.article_id}?size=500`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          if (data.total && data.total > 0) {
            Vue.set(that, 'loadingStatus', 'exists');
            Vue.set(that, 'loadShare', true);
            Vue.set(that.share, 'total', data.total);
            data.list.forEach(function (item, i) {
              Vue.set(that.share.avatar_list, i, item)
            })
          } else {
            Vue.set(that, 'loadingStatus', 'none');
          }
        });
      }
    }
  }
</script>
<style>
  #share_con {
    margin: 24px 8px 0 15px;
    font-size: 14px;
    text-align: left;
    color: #999999;
  }

  #share_con .shared {
    font-size: 16px;
    color: #16b13a;
  }

  #share_con a {
    display: inline-block
  }

  #share_con img.head {
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    display: inline-block;
    margin: 4px 2px 0 2px;
    background: #999;
  }

  .show-none {
    min-height: 39px;
  }

  .share-loading {
    margin: 15px 0;
    text-align: center;
    max-width: 100%;
    height: 9px;
  }

  .share-loading img {
    height: 9px;
    -webkit-animation-delay: 100ms;
    -moz-animation-delay: 100ms;
    animation-delay: 100ms;
  }
</style>

