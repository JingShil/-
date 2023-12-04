// pages/setting/setting.ts

Page({


  data: {
    pickerHidden: true,
    chosen: '',
    array:["HTML","CSS","JavaScript","TypeScript"],
    settings:[
      {"settingId":"1","userId": "1","type":"select","title":"标题",
      "settingChildren":["1","2","3"],"defaultValue":"1","userDefaultValue":"1","model":"0"},
      {"settingId":"1","userId": "1","type":"select","title":"标题",
      "settingChildren":["1","2","3"],"defaultValue":"1","userDefaultValue":"1","model":"0"},
    ],
    pickerIndex: 0,
    requestIp:"8.222.154.106:8081",
    // requestIp:"localhost:8083",
    userId:"1"
  },
  pickerChange:function(e){
    var index=e.currentTarget.dataset.index;
    var pickerIndex=e.detail.value;
    var settings=this.data.settings;
    settings[index].userDefaultValue=pickerIndex;
    this.setData({
      settings:settings
    })
  },
  sliderChange:function(e){
    var index=e.currentTarget.dataset.index;
    var sliderIndex=e.detail.value;
    var settings=this.data.settings;
    settings[index].userDefaultValue=sliderIndex;
    this.setData({
      settings:settings
    })
  },
  resetSetting:function(){
    var that = this;
    wx.showModal({
      title: '重置',
      content: '是否重置当前配置',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          var settings = that.data.settings;
          for(var i=0;i<settings.length;i++){
            settings[i].userDefaultValue = settings[i].defaultValue
          }
          that.setData({
            settings:settings
          })
          console.log(that.data.settings);
          console.log('用户点击确定')
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
    
  },
  getSettings:function(){
    var that=this
    wx.request({
      url: 'http://'+ this.data.requestIp +'/setting/list',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "userId":this.data.userId
      },
      success: function(res) {
        
       that.setData({
         settings:res.data.data
       })
       console.log(res.data.data[0])
      },
      fail: function(err) {
        console.error('发送失败', err);
      }
    });
  },
  saveSettings:function(){
    var that = this;
    wx.showModal({
      title: '保存',
      content: '是否将当前配置保存',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.request({
            url: 'http://'+ that.data.requestIp +'/setting/add',
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: that.data.settings,
            success: function(res) {
              
             console.log(res.data.data)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getSettings();
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