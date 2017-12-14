<template>
  <div v-if="status == 1" class="donate">
    <a v-bind:class="(status == 1)? 'press':'press_none'" v-on:click="action_donate">赞赏</a>
    <p>
      <template v-if="donate.length > 0">
        <span>{{donateCount}}</span>人赞赏
      </template>
      <template v-else>
        {{tips}}
      </template>
    </p>
    <div v-if="donate.length > 0" class="donate_icon" v-bind:class="(donate.length > 10)? 'donate_multiple':''">
      <span v-for="user in donate" v-on:click="goUser(user.id)"
            v-bind:style="{backgroundImage:'url('+ user.avatar +')'}"></span>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Vue from 'vue'

  export default{
    name: 'donate',
    data(){
      return {
        donate: [],
        donateCount: 0,
        status: 0,
        tips: '赞赏是对作者最好的赞美~',
        platform: pageParams.platform,
        version: pageParams.version
      }
    },
    created: function () {
      this.init();
    },
    methods: {
      donateSuccess: function (user_info) {
        let that = this;
        if (!user_info.id) {
          user_info = {
            id: "0",
            username: '神秘人',
            avatar: 'http://img1.dongqiudi.net/fastdfs1/M00/6C/06/o4YBAFkH9cOAJZQ1AAACgmrQgK8143.png'
          };
        }
        that.user_render(user_info);
      },
      init: function () {
        let that = this;
        let options = {
          method: 'get',
          url: `https://${this.prefix}api.dongdong.com/v2/reward/list/${this.article_id}?version=${this.version}`,
          param: {}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          that.$bus.emit('donate');
          if (data.status) {
            Vue.set(that, 'status', data.status)
          }
          if (data.tips) {
            Vue.set(that, 'tips', data.tips)
          }

          if (data.list) {
            Vue.set(that, 'donateCount', data.list.length);
            Vue.set(that, 'donate', data.list.slice(0, 499));
          }
        });
      },
      user_render: function (user_info) {
        function uniqueCode(arr) {
          let hash = {};
          let newarr = [];
          for (let i = 0, elem; i < arr.length; i++) {
            elem = arr[i].id;
            if (elem === '0') {
              newarr.push(arr[i]);
            } else if (!hash[elem]) {
              hash[elem] = true;
              newarr.push(arr[i])
            }
          }
          return newarr
        }

        this.donate.splice(0, 0, user_info);
        let donate_arr = uniqueCode(this.donate);

        if (this.donate.length === donate_arr.length) {
          Vue.set(this, 'donateCount', this.donateCount + 1);
        }
        this.donate = donate_arr.slice(0, 499);
      },
      goUser: function (userid) {
        if (userid !== "0") {
          location.href = 'dongdong:///user/' + userid;
        }
      },
      action_donate: function () {
        let that = this;
        (new Image()).src = `https://stat.dongdong.com/reward_button_click?fromid=${that.article_id}`;
        if (this.status == 1) {
          WebViewJavascriptBridge.callHandler('actionDonate', {article_id: that.article_id}, that.donateSuccess);
        }
      },
    }
  }
</script>
<style>
  .donate {
    position: relative;
    margin: 47px 0 70px;
    text-align: left;
    letter-spacing: 0;
  }

  .donate a.press {
    height: 34px;
    width: 90px;
    color: #ffffff;
    font-size: 16px;
    line-height: 34px;
    margin: 0 auto;
    display: block;
    border-radius: 3px;
    background: #dc5d4a;
    text-align: center;
  }

  .donate a.press_none {
    pointer-events: none;
    height: 34px;
    width: 90px;
    color: #ffffff;
    font-size: 16px;
    line-height: 34px;
    margin: 0 auto;
    display: block;
    border-radius: 3px;
    background: #e9e9e9;
    text-align: center;
  }

  .donate p {
    margin: 15px 0 10px;
    text-align: center;
    font-size: 16px;
    color: #999999;
  }

  .donate p span {
    color: #16b13a;
  }

  .donate_icon {
    text-align: center;
    width: 310px;
    margin: 0 auto;
    padding: 1px 0 0;
  }

  .donate_icon span {
    border-radius: 50%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 27px 27px;
    margin: 0 2px;
    padding: 0;
    display: inline-block;
    width: 27px;
    height: 27px;
  }

  .donate_icon span.more {
    margin-left: -4px;
    background-image: url(../assets/more.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 27px 27px;
  }

  .donate_multiple {
    text-align: left !important;
  }

  .donate .mask {
    position: absolute;
    margin: auto;
    top: 1px;
    left: 0;
    right: 0;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }

  .donate .mask span {
    opacity: 0.9;
    font-size: 14px;
    padding: 8px 20px;
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
