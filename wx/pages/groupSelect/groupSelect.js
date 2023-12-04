// pages/groupSelect/groupSelect.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromMeet:{},
    myGroupList:[],
    xmluserInfoId:app.globalData.userInfo.id,
    globalimage:app.globalData.globalimage,

    groupSelectedList:[],
    newNotice:{},
  },
           
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this;
    var eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      var item = data.data;
      that.setData({
        fromMeet:item
      })
      console.log(that.data.fromMeet);
    });
    this.LoadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  LoadData()
  {
    wx.request({
      url: app.globalData.frontUrl+'/test/groups/getMygroups/'+this.data.xmluserInfoId,
      method:'GET',
      success: (result) => {
         console.log(result.data)
         this.setData({
           myGroupList:result.data.data
         })
      },
     fail: (err) => {},
     complete: (res) => {},
    })

  },
  checkboxChange(e) {
    const selectedId = parseInt(e.detail.value[0]); // 获取选中的复选框的值（即ID）
   
     console.log("现在选择的是" + selectedId);
     const oldData = this.data.groupSelectedList;
   
     ////如果判断id重复
        /// 如果选中的ID不存在，则从数组中移除
   
        ///标识id
        const datasetId = e.target.dataset.id;
   
        console.log("选择的为空，dataId是:"+datasetId)
        var judge = false
        for(let i=0;i<oldData.length;i++)
        {
          if(oldData[i]==datasetId)
          {
            //移除
            oldData.splice(i,1)
            judge = true
            break;
          }
        }
   
   
     let updatedData = [...oldData]; // 创建一个新的数组，初始值为原始数组的拷贝
     if(judge == false)
     {
       updatedData.push(selectedId);
     }
    
     // 更新数据
     this.setData({
       groupSelectedList: updatedData
     });
   
     console.log("此时的选择用户的集合为：" + this.data.groupSelectedList); // 打印选择的ID
     },   
  submit()
  {
      ////将UserSelectedId 传入  updated
    //先为空
    wx.showLoading({
      title: '加载中....',
      mask:true
    })
   var memberstring=''
   for(let i=0;i<this.data.groupSelectedList.length;i++)
   {
    
     memberstring+=String(this.data.groupSelectedList[i])
     memberstring+=','
   }
    // 去掉最后一个逗号
memberstring = memberstring.slice(0, -1);
    this.setData({
      'newNotice.meetid':this.data.fromMeet.meetid,
      'newNotice.title':this.data.fromMeet.theme,
      'newNotice.promoter':this.data.fromMeet.promoter,
      'newNotice.address':this.data.fromMeet.address,
      'newNotice.groups':memberstring,
    })
    console.log(this.data.newNotice)
   ///异步请求1秒钟
    setTimeout(()=>{
      wx.request({
        url: app.globalData.frontUrl+'/test/wxnotice/save',
        data:this.data.newNotice,
        method:'POST',
        success:(res => {
          ///打印成功日志
          console.log(res.data)
           wx.showToast({
                      title: '选择组成功....',
                      icon: 'success',
                      image: '/static/images/成功.svg',
                      duration: 2000
                      });
        }),
        complete:(res => {
  
          //取消弹窗
           wx.hideLoading();
        })
      })
    },1000)
  },
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