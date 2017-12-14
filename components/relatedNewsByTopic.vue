<template>
  <div id="relatedNewsByTopic" v-if="loadRelatedNewsByTopic && ready">
    <dl>
      <dt v-if="column.id">
        <a :href="column.href">
            <span class="topic_icon">
              <img src="../assets/topic_position_icon.png">
            </span>
          <div class="topic_con">
            <p v-html="column.name"></p>
            <small v-html="column.intro"></small>
          </div>
          <div class="topic_arrow"></div>
        </a>
      </dt>
      <dd v-for="news in relatedNewsByTopic">
        <a :href="news.scheme" v-on:click="click_status(news.scheme)">
          <p><em>· </em>{{news.title}}</p>
        </a>
      </dd>
    </dl>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default{
    name: 'relatedNewsByTopic',
    data(){
      return {
        column: vueData.infos.column,
        relatedNewsByTopic: [],
        loadRelatedNewsByTopic: false
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
          method: 'post',
          url: `https://${this.prefix}api.dongdong.com/v2/article/old/columns`,
          param: {
            id: this.column.id
          }
        };
        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          that.$bus.emit('relative');
          data = data.data;
          if (data && data.length > 0) {
            that.loadRelatedNewsByTopic = true;
            let filterData = [];
            data.forEach(function (item) {
              if (item.aid != that.article_id) {
                filterData.push(item)
              }
            });

            filterData.forEach(function (item, i) {
              if (i <= 2) {
                Vue.set(that.relatedNewsByTopic, i, item);
              }
            });
          }
        });
      },
      click_status: function (scheme) {
        let newsId = scheme.split('/').pop();
        (new Image()).src = `https://stat.dongdong.com/column/relate_touch?type=topic&fromid=${this.article_id}&toid=${newsId}`;
      }
    }
  }
</script>

<style>
  #relatedNewsByTopic {
    background: #f7f7f7;
    margin: 26px 15px 36px;
    border: solid #e9e9e9 1px;
    border-top: none;
  }

  #relatedNewsByTopic dd {
    margin: 0 15px;
  }

  #relatedNewsByTopic dd:last-child {
    margin-bottom: 26px;
  }

  #relatedNewsByTopic dt {
    position: relative;
    text-align: center;
    height: 90px;
    line-height: 20px;
    color: #999999;
    font-size: 14px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    padding: 0 40px;
  }

  #relatedNewsByTopic dt span.topic_icon {
    display: block;
    height: 30px;
    line-height: 30px;
    width: 30px;
    margin: 0 auto 0;
    background: #f7f7f7;
    position: relative;
    bottom: 15px;
  }

  #relatedNewsByTopic .topic_icon img {
    width: 30px;
  }

  #relatedNewsByTopic dt .topic_con {
  }

  #relatedNewsByTopic dt .topic_con p {
    padding: 0;
    height: 18px;
    line-height: 18px;
    font-size: 17px;
    color: #333333;
    margin: 0;
    text-align: center;
    display: block;
  }

  #relatedNewsByTopic dt .topic_con small {
    font-size: 12px;
    line-height: 15px;
    height: 30px;
    display: block;
    overflow: hidden;
    color: #999999;
  }

  #relatedNewsByTopic dt .topic_arrow {
    background-image: url(../assets/ad_right_icon.png);
    background-repeat: no-repeat;
    background-size: 80% auto;
    background-position: center center;
    width: 20px;
    height: 28px;
    position: absolute;
    right: 15px;
    top: 35px;
  }

  #relatedNewsByTopic dd a {
    display: block;
    padding: 26px 0 0 0;
    position: relative;
  }

  #relatedNewsByTopic dd span {
    color: #999999;
    font-size: 11px;
    position: absolute;
    bottom: 12px;
  }

  #relatedNewsByTopic p {
    padding: 0 10px 0 12px;
    line-height: 18px;
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

  #relatedNewsByTopic p em {
    position: absolute;
    left: 0;
    top: 0;
    color: #bbbbbb;
    font-weight: bold;
  }
</style>
