// pages/MeetingCreate/MeetingCreate.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "项目组",
    arrayTitle: ['郭小敏', '叶姝萱', '余海强','何笔男'],
    indexTitle: 0,
    arrayLocation: ['致远楼1315', '致远楼1312','致远楼1311','涵虚楼A1101'],
    indexLocation: 0,
    arrayClass: ['一组', '二组'],
    indexClass: 0,
    date: '2023-11-14',
    time: '15:00',
    durationArray: ['15分钟', '30分钟', '1小时', '2小时', '3小时'],
    durationIndex: 0,
    introduction: ''
  },

  /**
   * 事件处理
   */
  input:function(e)
  {
    this.setData({
      introduction:e.detail.value
    })
  },
  handel() {
    let datestr = this.data.date + ' ' + this.data.time+':00'
    // 使用Date对象将日期时间字符串转换为时间戳（毫秒）
    console.log(datestr)/////2023-11-14 15:00
    // var timestamp = new Date(datestr).getTime();

    // 使用Date对象和相关方法将时间戳转换为指定格式的日期时间字符串
    // var formattedDateTime = new Date(timestamp).toLocaleString()
    // console.log(this.data.introduction)
    // console.log(formattedDateTime); // 输出：2023-11-07 10:30:00
    wx.request({
      url: 'http://8.222.154.106:8081/test/meet/add', // 请求的URL
      method: 'POST', // 请求方法，可以是GET/POST等
      header: {
        'Content-Type': 'application/json' // 请求头，设置为JSON格式
      },
      data: {
        theme: this.data.inputValue, // 请求参数
        address: this.data.arrayLocation[this.data.indexLocation],
        promoter: this.data.arrayTitle[this.data.indexTitle],
        protime: datestr,
        introduction: this.data.introduction
      },
      success(res) {
        // 请求成功的回调函数
        console.log(res.data); // 输出后端返回的数据
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 2000
          });
          wx.navigateBack({
            delta: 1  // 返回页面数，这里设为1表示返回上一个页面
          });
      },
      fail(err) {
        // 请求失败的回调函数
        console.error(err);
      }
    });
  },

  handleInput(event) {
    this.data.inputValue = event.detail.value;
  },

  bindPickerChangeTitle: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexTitle: e.detail.value
    })
  },
  bindPickerChangeLocation: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexLocation: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  onDurationChange: function (event) {
    this.setData({
      durationIndex: event.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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