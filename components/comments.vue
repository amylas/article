<template>
  <div class="comments" v-if="loadComments">
    <div class="comment_head">
      <h1>精彩评论</h1>
      <div class="sub_line">
        <span>COMMENTS</span>
      </div>
    </div>
    <ul id="comment_list">
      <li v-for="com in comments" v-on:click.capture.stop.prevent="showDetail">
        <img class="avatar" :src="users[''+com.user_id+''].avatar"
             onerror="javascript:this.src='https://img1.dongqiudi.com/fastdfs1/M00/3B/EF/o4YBAFjM9lqAel9GAAAQrsgeQ3A103.jpg'">
        <div class="user_info">
          <!--// 用户名+V+最爱勋章+全局挂件+会员+作者-->
          <p class="name">
            <!--// 用户名-->
            <span class="username">{{users[''+com.user_id+''].username}}</span>
            <!--// V-->
            <span v-if="users[''+com.user_id+''].medal_url" class="icon_v"
                  :style="{backgroundImage:'url('+ users[''+com.user_id+''].medal_url +')'}"></span>
            <!--// 最爱勋章-->
            <span v-if="users[''+com.user_id+''].team_icon" class="icon_team"
                  :style="{backgroundImage:'url('+ users[''+com.user_id+''].team_icon +')'}"></span>
            <!--／／  全局挂件-->
            <span v-if="pendant.icon" class="icon_team"
                  :style="{backgroundImage:'url('+ pendant.icon +')'}"></span>
            <!--// 会员-->
            <span v-if="users[''+com.user_id+''].member_pendant_url" class="icon_pendant"
                  :style="{backgroundImage:'url('+ users[''+com.user_id+''].member_pendant_url +')'}"></span>
            <!--// 作者-->
            <span v-if="users[''+com.user_id+''].is_root" class="icon_author">作者</span>
          </p>
          <p class="commend">
            {{com.up}}
            <span></span>
          </p>
          <div style="clear:both;"></div>
        </div>
        <div class="date">{{com.created_at}}</div>

        <!--quote-->
        <div class="quote" v-if="com.quote">
          <div class="quote_author">
            <p class="name">
              <span class="username">{{users[''+com.quote.user_id+''].username}}</span>

              <span v-if="(users[''+com.quote.user_id+''].medal_id!=0)" class="icon_v"
                    :style="{backgroundImage:'url('+ users[''+com.quote.user_id+''].medal_url +')'}"></span>

              <span v-if="users[''+com.quote.user_id+''].team_icon" class="icon_team"
                    :style="{backgroundImage:'url('+ users[''+com.quote.user_id+''].team_icon +')'}"></span>

              <span v-if="pendant.icon" class="icon_team"
                    :style="{backgroundImage:'url('+ pendant.icon +')'}"></span></p>
          </div>
          <p class="quote_con" v-html="com.quote.content"></p>
        </div>

        <!--detail-->
        <div class="detail">
          <p class="text_con" v-html="com.content"></p>
          <!--视频展示区-->
          <div v-if="com.video_info && com.video_info.length" class="media-container media-container-video"
               :style="'height: '+videoHeight+'px;background-image:url('+com.video_info[0].thumb +');'">
            <div class="media-holder media-holder-video"></div>
          </div>
          <!--img/gif-->
          <div v-else-if="com.attachments_total > 0" class="pic_con clearfix">
            <div class="img_con" v-if="(imgMode = 'on')" v-bind:class="(com.attachments_total>1)? 'multiple':'single'"
                 v-for="pic in com.attachments">
              <img :src="pic.thumb">
              <template v-if="pic.mime === 'image/gif'">
                <div class="media-label"></div>
              </template>
            </div>
            <div v-else>
              [图片]
            </div>
          </div>
        </div>

        <!--replylist-->
        <div class="replylist" v-if="com.reply_list && com.reply_list.length">
          <div class="reply" v-for="reply in com.reply_list">
            <span class="username">{{users[''+reply.user_id+''].username}}</span>
            <span v-if="(users[''+reply.user_id+''].medal_id!=0)" class="icon_v"
                  :style="{backgroundImage:'url('+ users[''+reply.user_id+''].medal_url +')'}"></span><span
            v-if="users[''+reply.user_id+''].team_icon" class="icon_team"
            :style="{backgroundImage:'url('+ users[''+reply.user_id+''].team_icon +')'}"></span><span
            class="reply_con"
            v-html="(reply.quote&&reply.quote.user_id?'回复'+users[''+reply.quote.user_id+''].username :'')+':'+reply.content"></span>
            <span v-if="reply.video_info && reply.video_info.length">[视频]</span>
            <span v-else-if="reply.attachments && reply.attachments.length">[图片]</span>
          </div>
          <div class="reply_count" v-if="com.reply_total > com.reply_list.length">共{{com.reply_total}}条回复></div>
        </div>
        <div v-else-if="com.reply_total > 0" class="replylist reply_total">共{{com.reply_total}}条回复></div>
      </li>
    </ul>
    <div class="more_comment">
      <a :href="'dongdong:///comment/' + article_id">
        查看更多评论 >
      </a>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: 'comments',
    data () {
      return {
        version: pageParams.version,
        imgMode: vueData.imgMode,
        pendant: {},
        comments: [],
        users: {},
        loadComments: false,
        videoHeight: pageParams.mainWidth * 0.67 * 9 / 16 - 40
      }
    },
    props: ['ready'],
    created: function () {
      this.init();
    },
    methods: {
      init: function () {
        let that = this;
        let options = {
          method: 'get',
          url: `https://${this.prefix}api.dongdong.com/v2/article/${this.article_id}/hot?size=3&version=${this.version}`,
          param: {}
        };

        WebViewJavascriptBridge.callHandler("htmlRequest", options, function (data) {
          that.$bus.emit('comments');
          let comments = data.data.comment_list;
          let users = data.data.user_list;
          if (comments && comments.length > 0) {
            Vue.set(that, 'loadComments', true);
            for (let i = 0, len = comments.length; i < len; i++) {
              Vue.set(that.comments, i, comments[i]);
            }
            if (data.data.pendant) {
              that.pendant = data.data.pendant;
            }
            for (let i = 0, len = users.length; i < len; i++) {
              Vue.set(that.users, users[i].id, users[i]);
            }
          }
        });
      },
      showDetail: function () {
        window.location.href = "dongdong:///comment/" + this.article_id;
      }
    }
  }
</script>
<style>
  ul li {
    list-style: none;
    position: relative;
    padding: 0 15px 0 15px;
    margin-bottom: 12px;
    overflow: hidden;
    border-bottom: solid #e9e9e9 1px;
  }

  .pic_con img {
    width: 100%;
    border-radius: 2px;
    display: block;
  }

  .pic_con .single {
    width: 73%;
  }

  .pic_con .multiple {
    width: 32%;
    float: left;
  }

  .pic_con .multiple:not(:last-child) {
    margin-right: 2%;
  }

  img.face {
    height: 24px;
    width: auto;
    vertical-align: top;
    position: relative;
    top: -1px;
  }

  .pic_con .media-label {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url(../assets/icon_gif_play_com.png) 0 0 no-repeat;
    width: 63px;
    height: 24px;
    background-size: 100% 100%;
    text-indent: 1000px;
  }

  .comments {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .comment_head {
    text-align: center;
    padding: 0 20px 12px;
  }

  .comment_head h1 {
    font-size: 17px;
    font-weight: bold;
    margin: 20px 0 0;
  }

  .comment_head .sub_line {
    height: 10px;
    width: 160px;
    border-bottom: 1px solid #e9e9e9;
    display: inline-block;
    line-height: 18px;
    padding: 0 25px;
  }

  .comment_head .sub_line span {
    width: 100px;
    display: inline-block;
    background: #f7f7f7;
    padding: 0 5px;
    color: #e9e9e9;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 600;
  }

  #comment_list {
    margin: 4px 0 18px;
    padding: 0;
  }

  #comment_list .quote {
    margin: 14px 0 6px;
    padding: 10px 12px 8px;
    background: #ececec;
    color: #999;
    border-radius: 3px;
  }

  #comment_list .quote p {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
  }

  #comment_list .quote img.face {
    height: 22px;
  }

  #comment_list .quote_author {
    color: #333;
    font-size: 14px;
    height: 16px;
    line-height: 16px;
    margin-bottom: 4px;
  }

  #comment_list .quote_author .name {
    display: -ms-flexbox;
    display: flex;
    width: 70%;
  }

  #comment_list .quote_author .username {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #comment_list .quote_author span {
    margin-right: 1px;
  }

  #comment_list .quote_author span {
    display: inline-block;
    vertical-align: middle;
  }

  #comment_list .replylist {
    margin: 10px 0;
    padding: 8px 12px;
    background: #ececec;
    color: #999999;
    border-radius: 3px;

  }

  #comment_list .replylist p {
    margin: 0;
    font-size: 14px;
  }

  #comment_list .replylist .reply_con {
    display: inline;
  }

  #comment_list .reply {
    color: #555;
    font-size: 14px;
    margin-bottom: 2px;
  }

  #comment_list .reply_count {
    color: #16b13a;
    font-size: 14px;
    line-height: 22px;
    margin-top: 4px;
  }

  #comment_list .reply_total {
    color: #16b13a;
    font-size: 14px;
    line-height: 22px;
    margin-top: 0;
    height: 22px;
    display: inline-block;
    padding: 4px 12px;
  }

  #comment_list .reply .username {
    color: #16b13a;
    max-width: 150px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #comment_list .reply span {
    display: inline-block;
    vertical-align: middle;
    height: 22px;
    line-height: 22px;
  }

  #comment_list .reply img.face {
    height: 22px;
  }

  #comment_list .avatar {
    position: absolute;
    top: 2px;
    left: 15px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }

  #comment_list .user_info {
    margin-bottom: 0;
    font-size: 14px;
    width: 100%;
    padding: 0;
  }

  #comment_list .user_info .name {
    display: flex;
    width: 70%;
    margin: 0 0 0 35px;
    color: #16ac3a;
    float: left;
  }

  #comment_list .user_info .username {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #comment_list .user_info p span {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
  }

  #comment_list .icon_v {
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: inline-block;
    width: 13px;
    flex-shrink: 0;
  }

  #comment_list .icon_author {
    height: 16px;
    line-height: 16px;
    margin-left: 2px;
    font-size: 12px;
    padding: 0 4px;
    background: #16ac3a;
    color: #ffffff;
    border-radius: 4px;
    flex-shrink: 0;
  }

  #comment_list .icon_team {
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: inline-block;
    width: 16px;
    flex-shrink: 0;
  }

  #comment_list .icon_pendant {
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: inline-block;
    width: 40px;
    flex-shrink: 0;
  }

  #comment_list .user_info .commend {
    position: relative;
    top: 3px;
    margin: 0;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
    font-size: 12px;
    color: #999999;
    float: right;
  }

  #comment_list .user_info .commend span {
    position: relative;
    bottom: 4px;
    background-image: url(../assets/up-h.png);
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: inline-block;
    height: 22px;
    width: 22px;
  }

  #comment_list .detail {
    margin: 8px 0;
    font-size: 16px;
    color: #333333;
  }

  #comment_list .detail .text_con {
    line-height: 24px;
    margin: 0;
  }

  .comments .media-holder-video {
    background-size: 40px 40px;
  }

  .comments .media-container-video {
    width: 67%;
    margin: 6px 0 12px;
  }

  #comment_list .detail .pic_con {
    margin-top: 4px;
  }

  #comment_list .detail .pic_con .img_con {
    position: relative;
    max-height: 336px;
    overflow: hidden;
  }

  #comment_list .date {
    font-size: 10px;
    color: #878787;
    margin: 0 0 0 35px;
  }

  .more_comment {
    font-size: 15px;
    text-align: center;
    margin-bottom: 25px;
  }

  .more_comment a {
    color: #999999;
  }
</style>
