// pages/comment/comment.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      inputValue:'',
      wxcomments:[],
      modalHidden: true,
      replyNewContent:'',
      noticeid:'',
      replyTo:{
        replyToId:'',
        replyContent: '',
        replyContentParentId:'',
        replyNoticeId:1,
      },
      noticeData:{},
      articleHeight:'',
      contentHeight:'',
      commentsCount:'',
      userInfo:app.globalData.userInfo.id
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
        noticeData:item,
        noticeid:item.noticeid
      },() => {
        that.LoadData(() => {
          console.log(that.data.noticeData);
        });
      });
     
    });
   
    // var data = options.notice;
    // console.log(data.noticeid);
    //   this.data.noticeid='',
    //   this.data.noticeid=options.notice.noticeid,
    //   this.data.noticeData=data,
      //  this.LoadData();
  },
    commentsAll() {
        wx.request({
          url:"http://8.222.154.106:8081/test/wxcomment/getcommentsCount/"+this.data.noticeData.noticeid,
          methods:"GET",
          success: (result) => {
            console.log(result)
            let Data = result.data.data
            this.setData({
             commentsCount:Data,
           }, () => {
             console.log("共有"+this.data.commentsCount+"条评论...");
           });
          },
          fail: (err) => {},
          complete: (res) => {},
        })
      },
  
  LoadData(callback)
  {
    this.commentsAll();
    wx.request({
      url:"http://8.222.154.106:8081/test/wxcomment/findtree/"+this.data.noticeid,
      methods:"GET",
      success: (result) => {
        let Data = result.data
        this.setData({
         wxcomments: Data
       }, () => {
         console.log(this.data.wxcomments);
         if (typeof callback === "function") {
          callback(); // 执行回调函数
        }
       });
      },
      fail: (err) => {},
      complete: (res) => {},
    })
  },
  onInput: function (e) {
    this.setData({
      inputValue: e.detail.value, // 将输入框的值存储到data中的inputValue变量中
    });
  },
  DeleteWxCommentFirst:function(e)
  {
    var id= e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    wx.request({
      url: 'http://8.222.154.106:8081/test/wxcomment/delete/'+id,
    
      method: 'DELETE',
      success: (result) => {
       
        console.log("删除成功")
        
        
      },
      fail: (err) => {},
      complete: (res) => {
        wx.showToast({
          title: '删除评论成功....',
          icon: 'success',
          image: '/static/images/成功.svg',
          duration: 2000
        });
        this.LoadData()
      },
    })
  },
  DeleteWxCommentSecond:function(e)
  {
    var id= e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.subitem;
    wx.request({
      url: 'http://8.222.154.106:8081/test/wxcomment/delete/'+id,
    
      method: 'DELETE',
      success: (result) => {
       
        console.log("删除成功")
        
       
      },
      fail: (err) => {},
      complete: (res) => {
        wx.showToast({
          title: '删除评论成功....',
          icon: 'success',
          image: '/static/images/成功.svg',
          duration: 2000
        });
        this.LoadData()
      },
    })
  },
  ////////////////methods Dialog
  showModal: function(e) {
    var id= e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.subitem;
    console.log(item);
   
    this.data.replyTo={};
    if(item.contentParentid==0)
    {
      this.setData({
        modalHidden: false,
        'replyTo.replyToId': item.userid,
        'replyTo.replyContentParentId':id,
        'replyTo.replyNoticeId':this.data.noticeData.noticeid,
        'replyTo.replyContent':this.data.replyNewContent,
      });
    }else{
      this.setData({
        modalHidden: false,
        'replyTo.replyToId': item.userid,
        'replyTo.replyContentParentId':item.contentParentid,
        'replyTo.replyNoticeId':this.data.noticeData.noticeid,
        'replyTo.replyContent':this.data.replyNewContent,
      });
    }
    console.log(this.data.replyTo)
  },
  confirmModal: function() {
    // 处理回复内容
    console.log(this.data.replyTo)
    
     
    ///创建一个集合对象
    const wxcomment={
      id:'',
      content:this.data.replyNewContent,
      userid:app.globalData.userInfo.id,
      pid:this.data.replyTo.replyToId,
      noticeid:this.data.replyTo.replyNoticeId,
      contentParentid:this.data.replyTo.replyContentParentId
    }
    // this.data.replyTo.replyContentParentId
   wx.request({
      url: 'http://8.222.154.106:8081/test/wxcomment/save',
      data: wxcomment,
      method: 'POST',
      success: (result) => {
        console.log(wxcomment)
        console.log("增加成功")
        this.data.wxcomments=[],
        this.data.replyNewContent='',
        this.LoadData()
      },
      fail: (err) => {},
      complete: (res) => {},
    })

    // 关闭弹窗
    this.setData({
      modalHidden: true,
      replyNewContent:'',
    });
  },
  cancelModal:function() {
    // 关闭弹窗
    this.setData({
      modalHidden: true
    });
  },
  inputChange: function(e) {
    this.setData({
      replyNewContent: e.detail.value
    });
  },
  
  // 评论按钮
  onSubmit: function () {
    // 在这里可以使用this.data.inputValue获取输入框的值，并执行相应的操作
    this.setData({
      'replyTo.replyToId': null,
      'replyTo.replyContentParentId':null,
      'replyTo.replyNoticeId':this.data.noticeData.noticeid,
      'replyTo.replyContent':this.data.replyNewContent,
    });
    console.log('用户输入的内容为：', this.data.inputValue);
    this.data.replyNewContent=this.data.inputValue;
        ///创建一个集合对象
        const wxcomment={
          id:'',
          content:this.data.replyNewContent,
          userid:app.globalData.userInfo.id,
          pid:null,
          noticeid:this.data.replyTo.replyNoticeId,
          contentParentid:this.data.replyTo.replyContentParentId
        }
        wx.request({
          url: 'http://8.222.154.106:8081/test/wxcomment/save',
          data: wxcomment,
          method: 'POST',
          success: (result) => {
            console.log(wxcomment)
            console.log("增加成功")
            this.data.wxcomments=[],
            this.data.replyNewContent='',
            this.LoadData(),
            this.inputValue=''
          },
          fail: (err) => {},
          complete: (res) => {},
        })
    
        // 关闭弹窗
        this.setData({
          replyNewContent:'',
        });

    // ...
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