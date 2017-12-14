<template>
  <div id="relatedNewsByHao" v-if="ready">
    <dl>
      <a :href="'dongdong:///feed/column/' + account_id">
        <dt>
          <span>懂球号</span>
          <img :src="account_icon">
        <div class="hao_con">
          <p>
            <strong>
              <span v-html="account_name"></span>
              <template v-if="account_addV">
                <em class="icon_v"></em>
              </template>
            </strong>
            <small v-html="account_intro"></small>
          </p>
        </div>
        <div class="btn_con"><a class="pro_go" v-on:click.prevent="followAccount(account_isfollow, $event)"
                                v-bind:class="account_isfollow? 'followed':''">{{ account_isfollow? '已关注' : '+ 关注'
          }}</a></div>
        </dt>
      </a>
      <dd v-for="news in relatedNewsByHao" v-if="loadRelatedNewsByHao === true">
        <a :href="news.scheme" v-on:click="click_status(news.scheme)">
          <p><em>· </em>{{news.title}}</p>
          <span>{{news.published_at}}</span>
        </a>
      </dd>
    </dl>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default{
    name: 'relatedNewsByHao',

    data(){
      return {
        account_id: vueData.account.id,
        account_name: vueData.account.name,
        account_icon: vueData.account.icon,
        account_intro: vueData.account.intro,
        account_addV: vueData.account.addV,
        account_isfollow: false,
        relatedNewsByHao: [],
        loadRelatedNewsByHao: false
      }
    },
    props: ['ready'],
    created: function () {
      this.init();
      this.isFollow();
    },
    methods: {
      init: function () {
        let that = this;
        let options = {
          method: 'POST',
          url: `https://${this.prefix}api.dongdong.com/v2/article/feed/column`,
          param: {id: that.account_id}
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          that.$bus.emit('relative');
          data = data.data;
          if (data && data.feeds.length > 0) {
            that.loadRelatedNewsByHao = true;
            let filterData = [];
            data.feeds.forEach(function (item) {
              if (item.id != that.article_id) {
                filterData.push(item)
              }
            });

            filterData.forEach(function (item, i) {
              if (i <= 2) {
                Vue.set(that.relatedNewsByHao, i, item);
              }
            })
          }
        });
      },
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
      followAccount: function (account_isfollow, event) {
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
      },
      click_status: function (scheme) {
        let newsId = scheme.split('/')[scheme.split('/').length - 1];
        (new Image()).src = `https://stat.dongdong.com/article/relate_touch?type=hao&fromid=${this.article_id}&toid=${newsId}`;
      }
    }
  }
</script>

<style>
  #relatedNewsByHao {
    background: #f7f7f7;
    margin: 26px 15px 36px;
    border: solid #e9e9e9 1px;
    border-top: none;
  }

  #relatedNewsByHao dd:last-child {
    margin-bottom: 26px;
  }

  #relatedNewsByHao dd {
    padding: 0 14px;
  }

  #relatedNewsByHao dt {
    position: relative;
    text-align: center;
    height: 100px;
    line-height: 20px;
    color: #999;
    font-size: 14px;
    border-top: 1px solid #e9e9e9;
    padding: 0 14px;
  }

  #relatedNewsByHao dt span {
    font-size: 14px;
    color: #333333;
    display: block;
    height: 20px;
    width: 66px;
    margin: 0 auto 0;
    background: #f7f7f7;
    position: relative;
    bottom: 10px;
    left: 35%;
  }

  #relatedNewsByHao dt img {
    margin: 0;
    width: 45px;
    border-radius: 50%;
    position: absolute;
    top: 24px;
    height: 45px;
    left: 15px
  }

  #relatedNewsByHao dt .hao_con {
    height: 50px;
    text-align: left;
    line-height: 50px;
    vertical-align: middle;
    padding: 4px 72px 7px 55px;
    overflow: hidden;
    margin: 0;
  }

  #relatedNewsByHao dt strong {
    height: 16px;
    line-height: 16px;
    display: block;
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 4px;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
  }

  #relatedNewsByHao dt strong span {
    top: 0;
    left: 0;
    display: inline;
    color: #333333;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: auto;
    margin: 0;
  }

  #relatedNewsByHao dt p {
    min-height: 50px;
    color: #999999;
    text-indent: 0;
    line-height: 20px;
    margin: 0;
    padding: 0;
    font-size: 12px;
    vertical-align: middle;
    display: inline-block;
    width: 100%;
  }

  #relatedNewsByHao dt .btn_con {
    width: 60px;
    height: 50px;
    position: absolute;
    top: 23px;
    right: 15px;
    text-align: right;
    line-height: 50px;
  }

  #relatedNewsByHao dt a.pro_go {
    height: 22px;
    line-height: 22px;
    width: 62px;
    border-radius: 2px;
    display: inline-block;
    padding: 2px 0;
    text-align: center;
    font-size: 14px;
    background: #f7f7f7;
    color: #16a73a;
    border: 1px solid #16a73a;
    text-decoration: none;
  }

  #relatedNewsByHao dt a.followed {
    color: #555555;
    border-color: #999999
  }

  #relatedNewsByHao dt small {
    overflow: hidden;
    height: 30px;
    line-height: 15px !important;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    font-size: 12px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  #relatedNewsByHao dt strong .icon_author {
    display: inline-block;
    font-style: normal;
    height: 14px;
    line-height: 14px;
    margin-left: 4px;
    font-size: 12px;
    padding: 2px 4px;
    background: #16ac3a;
    color: #ffffff;
    border-radius: 4px;
    transform: scale(0.9);
    vertical-align: top;
    transform-origin: 0 0;
  }

  #relatedNewsByHao dt strong .icon_v {
    position: relative;
    top: 2px;
    left: 4px;
    background-image: url(../assets/V_con_v2.png);
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: inline-block;
    height: 12px;
    width: 12px;
    flex-shrink: 0;
  }

  #relatedNewsByHao dt:not(:first-child) {
    color: #333333;
    height: 60px;
    line-height: 60px;
  }

  #relatedNewsByHao dd:nth-child(2) {
    border-top: 1px solid #e9e9e9;
  }

  #relatedNewsByHao dd a {
    display: block;
    padding: 26px 0 0;
    position: relative;
  }

  #relatedNewsByHao dd span {
    padding-left: 12px;
    color: #999999;
    font-size: 11px;
  }

  #relatedNewsByHao p {
    padding: 0 10px 0 12px;
    line-height: 18px;
    margin: 0;
    color: #333;
    font-size: 16px;
    position: relative;
    bottom: 2px;
    overflow: visible;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    max-height: 38px;
  }

  #relatedNewsByHao p em {
    position: absolute;
    left: 0;
    top: 0;
    color: #bbbbbb;
    font-weight: bold;
  }
</style>
