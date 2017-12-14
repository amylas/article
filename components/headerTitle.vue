<template>
  <header>
    <h1 v-html="title"></h1>
    <h2>
      <a v-html="writer" :href="writer_url"></a>
      <time>{{time}}</time>
    </h2>
    <h3 v-html="editor_word"></h3>
  </header>
</template>

<script>
  export default {
    name: 'headerTitle',
    data: function () {
      return {
        title: vueData.title,
        writer: vueData.writer,
        writer_url: vueData.writer_url,
        time: vueData.time,
        editor_word: vueData.editor_word
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .main header {
    margin: 18px 15px 0
  }

  header h1 {
    font-size: 25px;
    padding: 0;
    margin: 0;
    line-height: 35px;
    font-weight: 500;
  }

  header h2 {
    font-size: 14px;
    padding: 0;
    font-weight: 400;
    margin: 15px 0 30px;
    height: 16px;
    line-height: 16px;
  }

  header h3 {
    line-height: 24px;
    padding: 0 0 0 8px;
    border-left: 2px solid #e9e9e9;
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 30px;
    color: #888888;
  }

  header time {
    color: #888888;
    font-size: 14px;
    display: inline-block;
    padding: 0;
    vertical-align: top;
    margin-left: 6px;
  }

</style>
