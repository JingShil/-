// pages/report/report.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
       noticeData:{},
       noticeUrl:"http://8.222.154.106:8081/test/wxnotice",
       item: {
        content: '这是一段很长的文本，如果超过规定字数就会被省略显示。'
      },
      fromMeet:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
       ////页面之间的传递 
       var that=this;
       var eventChannel = this.getOpenerEventChannel();
       eventChannel.on('acceptDataFromOpenerPage', function(data) {
         var item = data.data;
         that.setData({
           fromMeet:item
         })
         console.log(that.data.fromMeet);
       });
        wx.showToast({
                  title: '查看通知页面...',
                  icon: 'success',
                  image: '/static/images/成功.svg',
                  duration: 2000
                  });
    this.LoadData();
  },
   /*methods */
   /*
     wx:wx.request({
       url: 'url',
       data: data,
       dataType: dataType,
       enableCache: true,
       enableChunked: true,
       enableHttp2: true,
       enableHttpDNS: true,
       enableQuic: true,
       forceCellularNetwork: true,
       header: header,
       httpDNSServiceId: 'httpDNSServiceId',
       method: method,
       responseType: responseType,
       timeout: 0,
     }) */
   LoadData()
   {
     wx.request({
       url:"http://8.222.154.106:8081/test/wxnotice/getByMeetId/"+this.data.fromMeet.meetid,
       methods:"GET",
       success: (result) => {
         let Data = result.data
         this.setData({
          noticeData: Data
        }, () => {
          console.log(this.data.noticeData);
        });
       },
       fail: (err) => {},
       complete: (res) => {},
     })
   },
   navigateToDetail:function(event) {
    var notice = event.currentTarget.dataset.item;
    console.log(notice)
    var judge = false;
    for (let char of notice.member) {
                  if (char !== ',') {
                    var intValue = parseInt(char);
                     if(intValue===app.globalData.userInfo.id)
                     {
                       judge=true;
                       break;
                     }
                 }
    }
    if(judge===true)
    {
       wx.showToast({
                  title: '你可以进入讨论......',
                  icon: 'success',
                  image: '/static/images/成功.svg',
                  duration: 2000
                  });
      wx.navigateTo({
        url: '/pages/comment/comment?item=' + notice,
        success: function(res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: notice});
        }
      });
     }else
     {
         wx.showToast({
                  title: '你无法进入讨论......',
                  icon: 'none',
                  image: '/static/images/24gf-eyeHide2.svg',
                  duration: 2000
                  });
     }
      
    },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(){

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
     this.LoadData()
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