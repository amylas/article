<template>
  <a :href="column.href">
    <div class="topicCell">
      <div v-html="column.name" class="topicInner"></div>
      <span class="crossLine"></span>{{column.intro}}
    </div>
  </a>
</template>
<script>
  import Vue from 'vue'

  export default{
    name: 'topicCell',
    data(){
      return {
        column: vueData.infos.column
      }
    },
    created:function () {
    }
  }
</script>
<style>
  .topicCell {
    position: relative;
    margin: 18px 15px 0;
    padding-right: 12px;
    height: 30px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #16b13a;
    color: #999999;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    display: block;
    overflow: hidden;
  }

  .topicInner, .crossLine {
    float: left;
  }

  .crossLine {
    margin: 0 3px 0 -3px;
    height: 100%;
    width: 20px;
    background: url(../assets/crossLine_holder.png) center center no-repeat;
    background-size: 100% 100%;
  }

  .topicInner {
    max-width: 210px;
    padding: 0 6px 0 15px;
    height: 30px;
    color: #f7f7f7;
    background-color: #16b13a;
    line-height: 32px;
    font-size: 14px;
    text-align: center;
    vertical-align: top;
  }

</style>
