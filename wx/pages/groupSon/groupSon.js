// pages/groupSon/groupSon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputUserName:'',
    inputGroupName:'',
    userList: [],    // 用户列表数据
    pageNum: 1,      // 当前页数
    pageSize: 2,    // 每页显示的数量
    totalPage: 0,    // 总页数
    UserIdSelectedList:[],
    xmluserInfoId:app.globalData.userInfo.id,
    
    groupSave:{
       member:'',
       founder:'',
    },
    invitation:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.UserIdSelectedList.push(this.data.xmluserInfoId)
    console.log(this.data.UserIdSelectedList)
      this.getUserList()
  },
  getUserList: function() {
    // 调用后端接口获取数据
    wx.showLoading({
      title: '加载中....',
      mask:true,
    })
    setTimeout(()=>{

   
    wx.request({
      url: app.globalData.frontUrl+'/user/page',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        name: this.data.inputUserName
      },
      success: res => {
        const result = res.data;
        console.log(result)

// 更新 userList 数组中每个项的 checked 属性
const updatedList = result.records.map(item => {
  return {
    ...item,
    checked: this.data.UserIdSelectedList.includes(item.id)
  };
});
 console.log(updatedList)

// 更新数据
this.setData({
  userList: updatedList,
  totalPage: result.pages
});
wx.hideLoading();
   
      },
      complete:res => {
        
      }
    });
  },900)

  },

  prevPage: function() {
    // 上一页
    if (this.data.pageNum > 1) {
      this.setData({
        pageNum: this.data.pageNum - 1
      });
      console.log("点击分页时"+this.data.UserIdSelectedList)
      this.getUserList();
    }
  },

  nextPage: function() {
    // 下一页
    if (this.data.pageNum < this.data.totalPage) {
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getUserList();
    }
  },
  checkboxChange(e) {
    const selectedId = parseInt(e.detail.value[0]); // 获取选中的复选框的值（即ID）
   
     console.log("现在选择的是" + selectedId);
     const oldData = this.data.UserIdSelectedList;
   
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
       UserIdSelectedList: updatedData
     });

     console.log(this.data.UserIdSelectedList); // 打印选择的ID
     },   
  onInput:function(e)
   {
     this.setData({
       inputUserName:e.detail.value
     })
   },
   onInput1:function(e)
   {
    this.setData({
      inputGroupName:e.detail.value
    })
   },
   onInput2:function(e)
   {
    this.setData({
      invitation:e.detail.value
    })
   },
   foundInvitation()
   {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 可用字符集
    let inviteCode = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      inviteCode += charset.charAt(randomIndex);
    }

    this.setData({
      invitation:inviteCode,
    })
   },
   foundConfirm()
   {
    wx.showLoading({
      title: '加载中....',
      mask:true
    })
    var memberstring=''
    for(let i=0;i<this.data.UserIdSelectedList.length;i++)
    {
     
      memberstring+=String(this.data.UserIdSelectedList[i])
      memberstring+=','
    }
        // 去掉最后一个逗号
memberstring = memberstring.slice(0, -1);
    this.setData({
      'groupSave.groupname':this.data.inputGroupName,
      'groupSave.member':memberstring,
      'groupSave.founder':this.data.xmluserInfoId,
      'groupSave.invitationcode':this.data.invitation
    })
    setTimeout(()=>{
      wx.request({
        url: app.globalData.frontUrl+'/test/groups/save',
        data:this.data.groupSave,
        method:'POST',
        success: (result) => {
           console.log(result.data)
           wx.hideLoading();
        },
       fail: (err) => {},
       complete: (res) => {},
      })
    },1500)
    this.setData({
      inputGroupName:'',
      invitation:'',
      inputUserName:'',
    })
     wx.showToast({
                title: '创建组成功....',
                icon: 'success',
                image: '/static/images/成功.svg',
                duration: 2000
                });
   },
   showInput()
   {

    console.log(this.data.inputUserName)
    this.getUserList();

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