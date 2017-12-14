<template>
  <header class="top">
    <a class="top-head" :href="'dongdong:///feed/column/' + author.user_id">
      <img :src="author.avatar"
           width="30px" height="30px">
    </a>
    <div class="top-info">
      <a class="top-username"><a v-html="author.name" :href="'dongdong:///feed/column/' + author.user_id"></a>
        <span class="top-icon" v-if="author.medal_url"
              :style="'background-image: url('+author.medal_url+');'"></span></a>
      <span class="top-info-time" v-html="time"></span>
    </div>
    <div class="top-follow" v-on:click.prevent="followAccount(account_isfollow, $event)"
         v-bind:class="account_isfollow? 'followed':''">{{ account_isfollow? '已关注' : '+ 关注'}}
    </div>
  </header>
</template>

<script>
  export default {
    name: 'headerTitle',
    data: function () {
      return {
        account_isfollow: false,
        author: vueData.author,
        time: vueData.publish_time,
        account_id: vueData.author && vueData.author.user_id
      }
    },
    created: function () {
      this.isFollow()
    },
    methods: {
      isFollow: function () {
        let that = this;
        let options = {
          method: 'POST',
          url: `https://${this.prefix}api.dongdong.com/v2/account/is_follow?account_id=${this.account_id}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          if (data.rs) {
            that.account_isfollow = data.data.data.ret;
          }
        });
      },
      followAccount: function (account_isfollow) {
        let that = this;
        if (!pageParams.username) {
          window.location.href = 'dongdong:///native/login';
          return;
        }
        if (!account_isfollow) {
          let options = {
            method: 'POST',
            url: `https://${this.prefix}api.dongdong.com/v2/account/follow?account_id=${this.account_id}`,
            param: {}
          };
          WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
            if (data.rs) {
              that.account_isfollow = data.data.data.ret;
            }
          });
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .top {
    margin: 25px 15px 6px;
    height: 34px;
    position: relative;
  }

  .top-head {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    display: block;
  }

  .top-info {
    margin: 0 72px 0 38px;
    line-height: 16px;
    position: relative;
    top: -3px;
  }

  .top-username {
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    display: block;
  }

  .top-username a {
    color: #000;
  }

  .top-icon {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 1px;
    background-position: 50%;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: inline-block;
    width: 13px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    top: -2px;
    left: -3px;
    position: relative;
  }

  .top-info .top-info-time {
    font-size: 12px;
    line-height: 16px;
    color: #888;
  }

  .top-follow {
    position: absolute;
    right: 0;
    height: 22px;
    line-height: 22px;
    width: 60px;
    border-radius: 2px;
    display: inline-block;
    text-align: center;
    font-size: 14px;
    background: #f7f7f7;
    color: #16a73a;
    border: 1px solid #16a73a;
    text-decoration: none;
    top: 5px;
  }

  .top-follow.followed {
    color: #555;
    border-color: #999
  }
</style>
