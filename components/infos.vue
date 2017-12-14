<template>
  <div>
    <div class="infos" v-if="showOff">
      <div class="source">
        <p>{{photo_copyright === 'shijue'? '以上图片来自于视觉中国':''}}</p>
        <p v-html="'消息参考来源: '+ source" v-if="source && source !== '懂球帝'"></p>
      </div>
      <div id="channels">
        <template v-for="channels in channels">
          <a v-html="channels.tag" :href="channels.href"></a>
        </template>
      </div>
    </div>
    <div v-else style="height: 10px"></div>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default{
    name: 'infos',
    data(){
      return {
        channels: vueData.infos.channels,
        source: vueData.source,
        photo_copyright: vueData.photo_copyright
      }
    },
    computed: {
      showOff: function () {
        let copyRightExist = (this.photo_copyright === 'shijue') ? true : false;
        let sourceExist = (this.source && this.source !== '懂球帝') ? true : false;
        let channelsExist = (this.channels.length > 0) ? true : false;
        return (!copyRightExist && !sourceExist && !channelsExist) ? false : true
      }
    }
  }
</script>
<style>
  .infos {
    margin: 30px 15px 0
  }

  .infos {
    padding: 5px 0 0 0;
  }

  .infos p {
    margin: 5px 0;
  }

  .source {
    color: #999999;
    font-size: 14px;
    width: 100%;
    text-align: left;
  }

  .source {
    font-size: 12px !important;
  }

  #channels {
    margin: 0 0 15px;
    padding: 5px 0 15px 0;
    font-size: 12px;
    color: #999;
    line-height: 30px;
  }

  #channels a {
    border-radius: 2px;
    display: inline-block;
    position: relative;
    background: #e9e9e9;
    color: #333333;
    bottom: 1px;
    padding: 4px 6px;
    margin: 0 5px 0 0;
    line-height: 16px;
    vertical-align: middle;
    height: 16px;
  }
</style>
