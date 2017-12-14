<template>
  <header>
    <h1 v-html="title"></h1>
    <h2>
      <a v-html="writer"></a>
      <time>{{time}}</time>
    </h2>
  </header>
</template>

<script>
  export default {
    name: 'headerTitle',
    data: function () {
      return {
        title: vueData.title,
        writer: vueData.writer,
        time: vueData.time
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  header {
    margin: 30px 15px 0
  }

  header h1 {
    text-align: center;
    font-size: 25px;
    padding: 0;
    margin: 0 15px;
    line-height: 35px;
    font-weight: 500;
  }

  header h2 {
    text-align: center;
    font-size: 14px;
    padding: 0;
    font-weight: 400;
    margin: 14px 0 30px;
    height: 16px;
    line-height: 16px;
  }

  header h2 a {
    color: #999999;
    vertical-align: middle;
  }

  header h3 {
    line-height: 26px;
    padding: 0 0 0 8px;
    border-left: 2px solid #e9e9e9;
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 30px;
    color: #999999;
  }

  header time {
    color: #999999;
    font-size: 14px;
    display: inline-block;
    padding: 0;
    vertical-align: middle;
    margin-left: 6px;
  }

</style>
