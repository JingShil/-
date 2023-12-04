// pages/chatgpt/chatgpt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatAnswer: "",
    chatQuestion: "",
    messages: [],
    requestIp: "8.222.154.106:8081",
    textareaHeight: 20,
    bottomHeight: wx.getSystemInfoSync().windowHeight * 0.1,
    mainHeight: wx.getSystemInfoSync().windowHeight * 0.9,
    bottomHeightBasic: wx.getSystemInfoSync().windowHeight * 0.1,
    mainHeightBasic: wx.getSystemInfoSync().windowHeight * 0.9,
    functionFlag: false,
    chatHistory:[],
    historyFlag:false,
    pageNumber:1,
    pageSize:10,
    userId:1,
    startStyle: "",
    voiceStyle: "",
    isStart: false,
    isPause: false,
    recorderManager : wx.getRecorderManager(),
    isVoice: false,
    audioFlag: false,
    audio:wx.createAudioContext('audio'),
    messagesAudio: [],
    audioBefore: 0,
    settings:[],
    messageDto:{
      "model":"gpt-3.5-turbo",
      "messages":""
    },
    audioStyles:[{"style":""},{"style":""},{"style":""}],
    
  },
  navigateToSetting: function() {
    // console.log("跳转到设置页面")
    wx.navigateTo({
      url: '/pages/setting/setting' // 跳转到其他页面的路径
    })
    
  },
  closeAudioToText:function(event){
    var messagesAudio = this.data.messagesAudio;
    var index = event.currentTarget.dataset.index;
    messagesAudio[index].hiddenText=true;
    this.setData({
      messagesAudio:messagesAudio
    })
  },
  openAudioToText:function(event){

    var messagesAudio = this.data.messagesAudio;
    var index = event.currentTarget.dataset.index;
    messagesAudio[index].hiddenText=false;
    this.setData({
      messagesAudio:messagesAudio
    })
  },
  closeAudio:function(){
    // this.setData({
    //   audioFlag:false,
    //   messages: [{"role": "assistant", "content": "你好！"}],
    //   messagesAudio: [{"role": "assistant", "content": "你好！", "audioBase64": ""}],
    // })
    this.setData({
      audioFlag:false,
      messages: [],
      messagesAudio: [],
    })
    this.getSetting();
  },
  openAudio:function(){
    this.setData({
      audioFlag:true,
      messages: [],
      messagesAudio: [],
    })
    this.getSetting();
  },
  playAudio:function(event){
    // this.pauseAudio();
    var messagesAudio = this.data.messagesAudio;
    const audioForm = wx.createAudioContext('audio' + this.data.audioBefore);
    audioForm.pause();
    
    var index = event.currentTarget.dataset.index;
    
    messagesAudio[index].isPlay = true;
    const audio=wx.createAudioContext('audio' + index)
    
    audio.play();
    this.setData({
      audioBefore:index,
      messagesAudio:messagesAudio
    })
  },
  pauseAudio:function(event){
    var messagesAudio = this.data.messagesAudio;
    var index = event.currentTarget.dataset.index;
    messagesAudio[index].isPlay = false;
    this.setData({
      messagesAudio:messagesAudio
    })
  },
  getAnswareAudio:function(){
    var that = this;
    var messages = this.data.messages;
    var messagesAudio = this.data.messagesAudio;
    messages.push({"role": "user", "content": this.data.chatQuestion})
    messagesAudio.push({"role": "user", "content": this.data.chatQuestion,"audioBase64": "", "hiddenText":true,"isPlay":false})
    var messageDto = that.data.messageDto;
    messageDto.messages = messages;
    that.setData({
      messages:messages,
      messagesAudio:messagesAudio,
      chatQuestion: "",
      messageDto:messageDto
    })
    wx.request({
      url: 'http://'+ this.data.requestIp +'/chat/sendMsg/voice',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: messageDto,
      success: function(res) {
        messages.push({"role": "assistant", "content": res.data.data.content})
        messagesAudio.push({"role": "assistant", "content": res.data.data.content,"audioBase64": res.data.data.audioBase64,"hiddenText":true,"isPlay":false})
        
        that.setData({
          messages:messages,
          messagesAudio:messagesAudio,
          chatQuestion: ""
        })
        // console.log(res.data);
      },
      fail: function(err) {
        console.error('发送失败', err);
      }
    });
    
  },
  deleteChat:function(){
    var that = this;
    wx.showModal({
      title: '删除',
      content: '删除当前聊天记录',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          that.setData({
            messages: [],
            messagesAudio: [],
          })
          that.getSetting();
          console.log('用户点击确定')
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
    
  },
  deleteChatHistory:function(e){
    var that = this;
    wx.showModal({
      title: '删除',
      content: '删除后无法恢复',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.request({
            url: 'http://'+ that.data.requestIp +'/chat/history/delete',
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              "id":e.target.dataset.id
            },
            success: function(res) {
              that.getHistory();
              // console.log(res);
            },
            fail: function(err) {
              console.error('发送失败', err);
            }
          });
          
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
    
  },
  addHistory:function(){

    var that = this;
    wx.showModal({
      title: '保存',
      content: '是否将当前聊天保存',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.request({
            url: 'http://'+ that.data.requestIp +'/chat/history/add',
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              "text":JSON.stringify(that.data.messages),
              "userId":that.data.userId
            },
            success: function(res) {
              // console.log(res);
            },
            fail: function(err) {
              console.error('发送失败', err);
            }
          });
          console.log('用户点击确定')
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
    
  },
  getHistory : function(){
    
    var that = this;
    var pageNumber = this.data.pageNumber;
    var pageSize = this.data.pageSize + 5;
    this.setData({
      pageSize:pageSize
    })
    wx.request({
      url: 'http://'+ this.data.requestIp +'/chat/history/list',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        pageNumber:pageNumber,
        pageSize:pageSize,
        userId:that.data.userId
      },
      success: function(res) {
        var chatHistory = res.data.data;
        // console.log(JSON.stringify(chatHistory));
        for (var i = 0; i < chatHistory.length; i++) {
          chatHistory[i].text = JSON.parse(chatHistory[i].text);
        }
        that.setData({
          chatHistory:chatHistory
        })
        
      },
      fail: function(err) {
        console.error('发送失败', err);
      }
    });
  },
  setMessages: function(event) {
    var messagesAudio=[];
    var messages=[];
    var index = event.currentTarget.dataset.index;
    var chatHistory = this.data.chatHistory;
    messages=chatHistory[index].text;
  
    var newData = chatHistory[index].text.map(item => {
      return {
        ...item,
        "audioBase64": "",
        "hiddenText":true,
        "isPlay":false
      };
    });
    messagesAudio=newData;

    this.setData({
      messages:messages,
      messagesAudio:messagesAudio
    })

  },
  openHistory: function() {
    this.setData({
      historyFlag:true
    })
    this.getHistory();
  },
  closeHistory: function() {
    this.setData({
      historyFlag:false
    })
  },
  changeHeight: function(e) {
    var that = this;
    let lineCount = e.detail.lineCount;
    // console.log(lineCount);
    if(lineCount <= 8){
      this.setData({
        textareaHeight:lineCount*20,
        mainHeight:that.data.mainHeightBasic-(lineCount-1)*20,
        bottomHeight:that.data.bottomHeightBasic+(lineCount-1)*20
      })
    }
  },
  closeFunction: function(){
    if(this.data.historyFlag)
      this.closeHistory();
    else
      this.setData({
        functionFlag:false
      })

  },
  openFunction:function() {
    this.setData({
      functionFlag:true
    })
  },
  changeFunction:function(){
    var functionFlag = this.data.functionFlag;
    this.setData({
      functionFlag:!functionFlag
    })
  },
  getSetting:function() {
    var that = this;
    wx.request({
      url: 'http://'+ this.data.requestIp +'/setting/list',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data:{
        "userId":"1"
      },
      success: function(res) {
        
        that.setData({
          settings:res.data.data
        })
        var settings = that.data.settings;
        var message = {"role": "system", "content": ""};
        var languageVoice = "";
        var speedVoice = "";
        for(var i=0;i<settings.length;i++){
          var index = settings[i].userDefaultValue;
          if(settings[i].model=="1"){
            message.content+=settings[i].title + ":" + settings[i].settingChildren[index] + ","
          }else if(settings[i].model=="2"){
            if(settings[i].type=="slider"){
              speedVoice=settings[i].userDefaultValue;
            }else{
              languageVoice=settings[i].settingChildren[index];
            }
          }
        }
        var messages = [];
        messages.push(message)
        that.setData({
          messages: messages
        })
        var messageDto = {
          "model":settings[0].settingChildren[settings[0].userDefaultValue],
          "messages":messages,
          "languageVoice":languageVoice,
          "speedVoice":speedVoice
        }
        that.setData({
          messageDto:messageDto
        })
        
        // console.log(res.data);
      },
      fail: function(err) {
        console.error('发送失败', err);
      }
    });
  },

  getAnsware:function() {
    var that = this;
    var messages = this.data.messages;
    messages.push({"role": "user", "content": this.data.chatQuestion})
    messages.push({"role": "assistant", "content": ""})
    var messageDto = that.data.messageDto;
    messageDto.messages = messages;
    this.setData({
      messages:messages,
      messagesAudio:messages,
      chatQuestion: "",
      messageDto:messageDto
    })
    wx.request({
      url: 'http://'+ this.data.requestIp +'/chat/sendMsg',
      enableChunked: "true",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: messageDto,
      success: function(res) {
        
        // console.log(res.data);
      },
      fail: function(err) {
        console.error('发送失败', err);
      }
    });
    
  },

  linkChatGpt:function() {
    var that = this;
    wx.connectSocket({
      // url: 'ws://localhost:8081/websocket', // WebSocket服务器地址
      url: 'ws://'+ that.data.requestIp + '/websocket',
      success: function(res) {
        console.log('WebSocket连接成功');
      },
      fail: function(err) {
        console.log('WebSocket连接失败', err);
      }
    });

    // 监听WebSocket连接打开事件
    wx.onSocketOpen(function(res) {
      console.log('WebSocket连接已打开');
    });

    // 监听WebSocket接收到服务器的消息事件
    wx.onSocketMessage(function(res) {
      // console.log('收到服务器消息：', res.data);
      if(JSON.parse(res.data).choices[0].delta.content != null){

        ///回答
        var message = JSON.parse(res.data).choices[0].delta.content;     
        var messages = that.data.messages;
        messages[messages.length - 1].content = messages[messages.length - 1].content + message;
        that.setData({
          messages:messages,
          messagesAudio:messages
        })
        // console.log(that.data.chatAnswer);
      }
    });

    // 监听WebSocket错误事件
    wx.onSocketError(function(err) {
      console.log('WebSocket错误：', err);
    });

    // 监听WebSocket连接关闭事件
    wx.onSocketClose(function(res) {
      console.log('WebSocket连接已关闭');
    });

  
  },

  closeLinkChatGPt(){
    wx.closeSocket({
      success: function(res) {
        console.log('WebSocket连接已关闭');
      },
      fail: function(err) {
        console.error('WebSocket连接关闭失败', err);
      }
    });
  },

  onInput: function(e) {
    var value = e.detail.value;
    this.setData({
      chatQuestion: value
    })
       
  },
  startVoice:function(){
    var that=this;
    this.setData({
      startStyle:"background-color: white;height:120px;",
      voiceStyle:" background-color: cadetblue;",
      cancelStyle:"background-color: rgb(161, 167, 161);"
    })
    if(this.data.isStart==false){
      console.log('开始录音');
      that.setData({
        isStart:true
      })
      this.data.recorderManager.onStart(() => {
        console.log('开始录音');
      });

      this.data.recorderManager.start({
        duration: 60000, // 录音时长，单位为毫秒，默认为60000（1分钟）
        sampleRate: 44100, // 采样率，有效值为 8000/16000/44100，默认为44100
        numberOfChannels: 1, // 录音通道数，有效值为 1/2，默认为1
        encodeBitRate: 96000, // 编码码率，有效值为8000/16000/24000/48000/64000/96000/128000，默认为96000
        format: 'mp3', // 音频格式，有效值为aac/mp3，默认为mp3
        frameSize: 50, // 每帧大小，单位为KB，默认为50
      });

     
    }else{
      if(that.data.isPause){
        that.setData({
          isPause:false
        })
        console.log('继续录音');
        this.data.recorderManager.resume();
      }
    }
    
  },
  stopVoice:function(){
    this.setData({
      startStyle:"background-color: rgb(97, 89, 89);",
      voiceStyle:" background-color: rgb(252, 2, 2);",
      cancelStyle:"background-color: white;"
    })
    if(this.data.isStart){
      if(this.data.isPause==false){
        this.setData({
          isPause:true
        })
        console.log('停止录音');
        this.data.recorderManager.pause();
      }
    }
  },
  endVoice:function(){
    var that=this
    this.setData({
      startStyle:"background-color: rgb(97, 89, 89);",
      voiceStyle:" background-color: rgb(252, 2, 2);",
      cancelStyle: "background-color: rgb(161, 167, 161);"
    })
    if(this.data.isStart){
      console.log("结束录音")
      this.closeVoice();
      if (this.data.isPause) {
        that.data.recorderManager.onStop(() => {
          console.log('取消录音');
          
          wx.showToast({
            title: '录音取消',
            icon: 'error',
            duration: 1000    //提示的延迟时间
          });
        });
      }else {
        this.data.recorderManager.onStop((res) => {
          console.log('停止录音', res.tempFilePath);
          wx.showLoading({  // 显示加载中loading效果 
            title: "请等待",
            mask: true  //开启蒙版遮罩
          });
          wx.uploadFile({
            url: 'http://'+ that.data.requestIp + '/voice/text/upload', // 上传服务器的URL
            filePath: res.tempFilePath, // 录音文件的临时路径
            name: 'audio', // 服务器接收文件的字段名
            success: function(res) {
              wx.hideLoading();
              // console.log('上传成功', JSON.parse(res.data));
              that.setData({
                chatQuestion:JSON.parse(res.data).data
              })
              // console.log(that.data.chatQuestion)
              // 在这里可以处理上传成功后的逻辑
            },
            fail: function(res) {
              console.log('上传失败', res.errMsg);
              // 在这里可以处理上传失败后的逻辑
            }
          });
        });
      }
      that.setData({
        isStart:false,
        isPause: false
      })
      that.data.recorderManager.stop();
      
    }
  },
  moveVoice:function(e){
    var that = this;
    // 获取手指触摸的位置
    var touchY = e.touches[0].clientY;
    // 获取元素的位置和尺寸信息
    var rect= wx.createSelectorQuery().select('.start').boundingClientRect();
      rect.exec(function(res) {
        var height = res[0].height;
        // 判断手指是否超过边框
        if (touchY < wx.getSystemInfoSync().windowHeight-height) {
          that.stopVoice();
        }else {
          that.startVoice();
        }
      });
  },
  openVoice:function(){
    this.setData({
      isVoice:true
    })
  },
  closeVoice:function(){
    this.setData({
      isVoice:false
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.linkChatGpt(); 
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
    this.getSetting();
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