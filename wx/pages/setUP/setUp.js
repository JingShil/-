// pages/setUP/setUp.js
Page({
  data: {
    theme: 'light', // 初始主题状态为白色主题
    arraySpeak: ['Chinese', 'English', 'Japanese'],
    indexSpeak: 0,
    arrayRole: ['招待人', '秘书'],
    indexRole: 0,
    speed: '',
    tone: ''
  },

  // 重置设置
  resetdata() {
    wx.request({
      url: 'http://8.222.154.106:8081/test/meet/add', // 请求的URL
      method: 'POST', // 请求方法
      header: {
        'Content-Type': 'application/json' // 请求头，设置为JSON格式
      },
      data: {
        reset: 1 //重置标志
      },
      success(res) {
        // 请求成功的回调函数
        console.log(res.data); // 输出后端返回的数据
        wx.showToast({
          title: '重置成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail(err) {
        // 请求失败的回调函数
        console.error(err);
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        });
      }
    });
  },

  //保存设置
  savedata() {
    wx.request({
      url: 'http://8.222.154.106:8081/test/meet/add', // 请求的URL
      method: 'POST', // 请求方法
      header: {
        'Content-Type': 'application/json' // 请求头，设置为JSON格式
      },
      data: {
        // topic: this.data.topic, // 请求参数
        speak: this.data.arraySpeak[this.data.indexSpeak],
        role: this.data.arrayRole[this.data.indexRole],
        speed: this.data.speed,
        tone: this.data.tone
      },
      success(res) {
        // 请求成功的回调函数
        console.log(res.data); // 输出后端返回的数据
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail(err) {
        // 请求失败的回调函数
        console.error(err);
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        });
      }
    });
  },
  bindPickerChangeSpeak: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexSpeak: e.detail.value
    })
  },

  bindPickerChangeRole: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexRole: e.detail.value
    })
  },

  speedChange: function (e) {
    this.data.speed = e.detail.value
  },

  toneChange: function (e) {
    this.data.tone = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取全局的主题状态
    const theme = getApp().globalData.theme;
    // const theme = wx.getStorageSync('theme');
    if (theme) {
      this.setData({
        theme: theme
      });
    }
  },

  // 切换主题的按钮点击事件处理函数
  toggleTheme: function (e) {
    const theme = e.detail.value;
    this.setData({
      theme: theme
    });
    wx.setStorageSync('theme', theme);
    wx.redirectTo({
      url: '/pages/setUP/setUP'
    });
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