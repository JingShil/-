// 简单版
Page({
  data: {
      content: '',
      // 当前登录者信息
      login: {
          id: '2023',
          user: '我',
          avatar: '/images/tabs/1.png'
      },
      // 聊天信息
      chatList: [{
              msgId: '2023',
              nickname: '我',
              avatar: '/images/tabs/1.png',
              message: '一个简单的智能问答窗口界面',
              type: 'text',
              date: '05-02 14:24' // 每隔5分钟记录一次时间
          },
          {
              msgId: '2022',
              nickname: 'AI',
              avatar: '/images/tabs/2.png',
              message: '请问我有什么能够帮助到您呢？',
              type: 'text'
          },
          // {
          //     msgId: '2023',
          //     nickname: '我',
          //     avatar: '/images/tabs/1.png',
          //     message: '嘞 对头,解压文件夹后,可直接使用完整版',
          //     type: 'text'
          // },
          // {
          //     msgId: '2022',
          //     nickname: 'AI',
          //     avatar: '/images/tabs/2.png',
          //     message: '若出现iOS不兼容现象,请自行调整哦',
          //     type: 'text',
          //     date: '05-04 16:05'
          // },

          // {
          //     msgId: '2022',
          //     nickname: 'AI',
          //     avatar: '/images/tabs/2.png',
          //     message: '没有用苹果手机测试啦',
          //     type: 'text'
          // },
          // {
          //     msgId: '2022',
          //     nickname: 'AI',
          //     avatar: '/images/tabs/2.png',
          //     message: '该消息为撤回消息',
          //     type: 'custom'
          // },
          // {
          //     msgId: '2023',
          //     nickname: '我',
          //     avatar: '/images/tabs/1.png',
          //     message: '请前往下方链接,使用完整版',
          //     type: 'text'
          // },
          // {
          //     msgId: '2023',
          //     nickname: '我',
          //     avatar: '/images/tabs/1.png',
          //     message: '谢谢各位亲的点赞关注和收藏',
          //     type: 'text'
          // },
          // {
          //     msgId: '2022',
          //     nickname: 'AI',
          //     avatar: '/images/tabs/2.png',
          //     message: '已滑动至最底部',
          //     type: 'text',
          //     date: '05-07 19:08'
          // },
      ],
  },
  onLoad() {
      this.scrollToBottom();
  },
  // 输入监听
  inputClick(e) {
      this.setData({
          content: e.detail.value
      })
  },
  // 发送监听
  sendClick() {
      var that = this;
      var list = this.data.chatList;
      // 获取当前时间
      var date = new Date();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minu = date.getMinutes();
      var now1 = month < 10 ? '0' + month : month;
      var now2 = day < 10 ? '0' + day : day;
      // 组装数据
      var msg = {
          msgId: this.data.login.id,
          nickname: this.data.login.user,
          avatar: this.data.login.avatar,
          message: this.data.content,
          type: 'text',
          date: now1 + '-' + now2 + ' ' + hour + ':' + minu
      }
      this.setData({
          chatList: list.concat(msg)
      }, () => {
          that.scrollToBottom();
          that.setData({
              content: ''
          })
      })
  },
  // 滑动到最底部
  scrollToBottom() {
      setTimeout(() => {
          wx.pageScrollTo({
              scrollTop: 200000,
              duration: 3
          });
      }, 600)
  },
})

