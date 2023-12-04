// pages/group/group.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentGroup: null, // 存储当前选中的组的信息
    groups: [],
    dropdownOpen: false,
      groupModalHidden:true,
      isShowCreateGroupPage:true,
      isShowAddGroupPage:true,
      isShowGroupDetail:true,
      inputGroupName:'',
      inputInvitation:'',
      ModalData:{
        founder:'',
        invitation:'',
        member:[],
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.LoadGroups();
  },

  // 我的群
  LoadGroups()
  {
    wx.request({
      url: app.globalData.frontUrl+'/test/groups/getMygroups/'+app.globalData.userInfo.id,
    
      method:'GET',
      success: (result) => {
         console.log(result.data)
         this.setData({
           groups:result.data.data
         })
       
      },
     fail: (err) => {},
     complete: (res) => {},
    })
  },
  toggleDropdown: function () {
    this.setData({
      dropdownOpen: !this.data.dropdownOpen
    });
  },


  showAddGroupPage()
  {
      this.setData({
        isShowAddGroupPage: false
     });
  },

  cancelGroupModal()
  {
    this.setData({
      isShowAddGroupPage: true,
   });
  },

   Groupdetail(){
    this.setData({
      isShowGroupDetail: true,
   });
  },

  // 确认
  confirmGroupModal(){
    wx.showLoading({
      title: '加载中....',
      mask:true
    })
    wx.request({
      url: app.globalData.frontUrl+'/test/groups/savebyInvitation/'+this.data.inputInvitation+'/'+app.globalData.userInfo.id,
      method:'POST',
      success: (result) => {
        console.log(result.data)
        if(result.data.data==200)
        {
           wx.showToast({
                      title: '已经加入过....',
                      icon: 'none',
                      image: '',
                      duration: 2000,
                      complete: () => {
                      // 延时隐藏加载中的提示
                      setTimeout(() => {
                      wx.hideLoading();
                     }, 2000);
                      }
                      });
        }else
        {
           wx.showToast({
                      title: '加入成功，在我的组中查看......',
                      icon: 'success',
                      image: '',
                      duration: 2000,
            complete: () => {
              // 延时隐藏加载中的提示
              setTimeout(() => {
              wx.hideLoading();
             }, 2000);
              }
                      });
        }
        
     },
    fail: (err) => {},
    complete: (res) => {
    // wx.hideLoading();

    },
    })
    this.setData({
      isShowAddGroupPage: true
   });
  },

// 查看群信息
  showGroupDetail(event){
    this.setData({
      isShowGroupDetail: false
   });
   const selectgroup = event.currentTarget.dataset.item;
    // 根据 groupId 获取当前组的信息，这里假设 groups 是包含所有组信息的数组
    console.log(selectgroup);

    wx.request({
      url: app.globalData.frontUrl+'/user/getUserByid/'+selectgroup.founder,
      method:'GET',
      success:res=>{
        console.log(res.data)
        this.setData({
          'ModalData.invitation':selectgroup.invitationcode,
          'ModalData.founderName':res.data.name,
        })
      },
      complete:res=>{
        wx.request({
          url: app.globalData.frontUrl+'/user/getUserMemberList/'+selectgroup.member,
          method:'GET',
          success:res=>{
            console.log(res.data.data)
            this.setData({
              'ModalData.invitation':selectgroup.invitationcode,
              'ModalData.member':res.data.data,
            })
          },
          complete:res=>{
              
          }
        })
      }
    })
  },

  // 创建群
  showCreateGroupPage: function() {
    wx.navigateTo({
      url: '/pages/groupSon/groupSon'
    });
    // this.setData({
    //   isShowCreateGroupPage: false
    // });
    // console.log(this.data.isShowCreateGroupPage)
  },

  onInput:function(e)
  {
    this.setData({
      inputInvitation: e.detail.value, // 将输入框的值存储到data中的inputValue变量中
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