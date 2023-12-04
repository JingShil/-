// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [{
        "role": "assistant",
        "content": 'Hello,What can I do for you?'
      },
      {
        "role": "assistant",
        "content": 'Hi'
      },
    ],
    inputValue: '',
    switch1: false,
    switch2: false,
    switch3: false,
    requestIp: "8.222.154.106:8081",
    urlfront: 'http://8.222.154.106:8081',
    fromMeet: {},
    selectedIdx: 0,
    NoticeSelected: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    ////页面之间的传递 
    var that = this;
    var eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      var item = data.data;
      that.setData({
        fromMeet: item
      })
      console.log(that.data.fromMeet);
    });
    this.linkChatGpt();
  },
  /**
   * 方法method
   */
  /*
  switch选择
  */
  switch1Change() {
    this.setData({
      switch1: true,
      switch2: false,
      switch3: false
    })
  },

  switch2Change() {
    this.setData({
      switch2: true,
      switch1: false,
      switch3: false
    })
  },

  switch3Change() {
    this.setData({
      switch3: true,
      switch1: false,
      switch2: false
    })
  },

  onInput: function (e) {
    var value = e.detail.value;
    this.setData({
      inputValue: value
    })
  },

  sendMessage() {
    var that = this;
    wx.showLoading({
      title: '加载中....',
      mask: true,
    })
    console.log("USer问的问题:" + this.data.inputValue)
    const messages = this.data.messages;
    var currentTime = new Date();
    // 获取小时
    var hours = currentTime.getHours();
    // 获取分钟
    var minutes = currentTime.getMinutes();
    // 获取秒钟
    var seconds = currentTime.getSeconds();
    var newquestion = {
      "role": "user",
      "content": this.data.inputValue,
    }
    var newanswer = {
      "role": "assistant",
      "content": "",
    }
    messages.push(newquestion);
    messages.push(newanswer);
    this.setData({
      messages: messages,
      inputValue: ''
    })
    wx.request({
      // url: 'http://localhost:8081/chat/sendg',
      url: 'http://' + this.data.requestIp + '/chat/sendg',
      enableChunked: "true",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: this.data.messages,
      success: function (res) {
        const checkedTimeList = that.data.messages.map((item, index) => {
          if (index === that.data.messages.length - 1) {
            return {
              ...item,
              time: hours + ':' + minutes + ':' + seconds
            };
          } else {
            return item;
          }
        });
        that.setData({
          messages: checkedTimeList
        })
        console.log(res.data);
        wx.hideLoading();
      },
      fail: function (err) {
        console.error('发送失败', err);
      }
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 1700)
  },

  sendMessageSwitch() {
    var question = ""
    var type = ""
    if (this.data.switch1 === true || this.data.switch2 === true || this.data.switch3 === true) {
      if (this.data.switch1 === true) {
        type = ",形式为指示规定性通知,注意格式";
      } else if (this.data.switch2 === true) {
        type = ",形式为发布性通知,注意格式";
      } else {
        type = ",形式为任免聘用性通知,注意格式";
      }
    }
        var start= "请帮我撰写一份学校实验室会议通知,从敬语起写,不超过300个字,并且根据数据:";
        var datas= '发布人:'+this.data.fromMeet.promoter+",主题为:"+this.data.fromMeet.theme+",地点在:"+this.data.fromMeet.address+",开会时间为:"+this.data.fromMeet.protime+",会议简介为:"+this.data.fromMeet.introduction;
        question=start+datas+type;
    this.setData({
      inputValue: question
    })
    console.log(this.data.inputValue)
    this.sendMessage();
  },

  linkChatGpt: function () {
    var that = this;
    wx.connectSocket({
      // url: 'ws://localhost:8081/websocket', // WebSocket服务器地址
      url: 'ws://' + that.data.requestIp + '/websocket',
      success: function (res) {
        console.log('WebSocket连接成功');
      },
      fail: function (err) {
        console.log('WebSocket连接失败', err);
      }
    });
    // 监听WebSocket连接打开事件
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开');
    });
    // 监听WebSocket接收到服务器的消息事件
    wx.onSocketMessage(function (res) {
      // console.log('收到服务器消息：', res.data);
      if (JSON.parse(res.data).choices[0].delta.content != null) {
        ///打印回答
        var message = JSON.parse(res.data).choices[0].delta.content;
        // console.log(message)
        var messages = that.data.messages;
        messages[messages.length - 1].content = messages[messages.length - 1].content + message;
        that.setData({
          messages: messages
        })
      }
    });

    // 监听WebSocket错误事件
    wx.onSocketError(function (err) {
      console.log('WebSocket错误：', err);
    });
    // 监听WebSocket连接关闭事件
    wx.onSocketClose(function (res) {
      console.log('WebSocket连接已关闭');
    });
  },
  closeLinkChatGPt() {
    wx.closeSocket({
      success: function (res) {
        console.log('WebSocket连接已关闭');
      },
      fail: function (err) {
        console.error('WebSocket连接关闭失败', err);
      }
    });
  },

  radioChange: function (e) {
    const selectedIdx = e.detail.value; // 获取选中的信息的索引
    this.setData({
      selectedIdx: selectedIdx
    });
    console.log(this.data.selectedIdx);
    var selectedContent = e.target.dataset.item;// 获取选中的信息的 id（这里假设消息具有唯一的 id）
    // 进行后续处理，如根据选中的 id 获取选中的消息等
    this.setData({
      NoticeSelected: selectedContent
    })
    console.log(this.data.NoticeSelected);
  },

  RepeatSendMessage() {
    ///获取最后一条即可 不满意
  },

  confirm() {
    ///异步请求1秒钟
    var updateNotice = {
      meetid: this.data.fromMeet.meetid,
      title: this.data.fromMeet.theme,
      text: this.data.NoticeSelected,
      member: '',
      promoter: this.data.fromMeet.promoter,
      address: this.data.fromMeet.address,
      groups: '',
    }
    wx.request({
      url: this.data.urlfront + '/test/wxnotice/getByMeetId/' + this.data.fromMeet.meetid,
      method: 'GET',
      success: (res) => {
        if (res.data === null) {
          ///undefined 的走下面
        } else {
          console.log(res.data);
          updateNotice.member = res.data.member
          updateNotice.groups = res.data.groups
          console.log(updateNotice);
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    setTimeout(() => {
      wx.request({
        url: this.data.urlfront + '/test/wxnotice/save',
        data: updateNotice,
        method: 'POST',
        success: (res => {
          ///打印成功日志
          console.log(res.data)
        }),
        complete: (res => {
          //取消弹窗
          wx.hideLoading();
        })
      })
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})