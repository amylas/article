<template>
  <div class="like">
    <a class="btn-like" v-on:click="action_like"></a>

    <p class="btn-like-span" v-html="'还没有人赞过'" v-if="likeCount === 0"></p>
    <p class="btn-like-span" v-html="'已有'+likeCount+'人点赞'" v-else></p>

    <transition name="fade">
      <div v-show="tip.show" class="like-mask">
      <span>
        {{tip.text}}
      </span>
      </div>
    </transition>
  </div>
</template>
<script type="text/javascript">
  import Vue from 'vue'

  export default {
    name: 'like',
    data() {
      return {
        likeCount: vueData.praise_total || 0,
        tip: {
          show: false,
          text: ''
        }
      }
    },
    created: function () {
    },
    methods: {
      action_like: function () {
        let that = this;
        (new Image()).src = `https://stat.dongdong.com/like_button_click?fromid=${that.article_id}`;
        let options = {
          method: 'post',
          url: `https://${this.prefix}api.dongdong.com/v2/article/up/${this.article_id}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          if (data.errCode) {
            that.tip.text = data.message;
          } else {
            Vue.set(that, 'likeCount', parseInt(that.likeCount) + 1);
            that.tip.text = '赞已成功';
          }
          that.tip.show = true;
          setTimeout(function () {
            that.tip.show = false;
          }, 1500);
        });

      },
    }
  }
</script>
<style>
  .like {
    position: relative;
    margin: 30px auto 68px;
  }

  .like .btn-like {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    background: url("../assets/icon_like.png") no-repeat;
    background-size: 100% auto;
  }

  .like .btn-like-span {
    font-size: 14px;
    color: #888;
    display: block;
    text-align: center;
    margin: 12px 0;
  }

  .like-mask {
    position: absolute;
    margin: auto;
    top: 42px;
    left: 0;
    right: 0;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }

  .like-mask span {
    opacity: 0.78;
    font-size: 14px;
    padding: 6px 18px;
    text-align: center;
    border-radius: 3px;
    color: #fff;
    background-color: #383a3c;
  }

  .fade-enter-active {
    animation: fade-in .2s;
  }

  .fade-leave-active {
    animation: fade-out .2s;
  }

  @keyframes fade-in {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes fade-out {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.5);
    }
  }
</style>
