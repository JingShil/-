// pages/report/report.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
       isShowGroupDetail:true,
       isShowMemberDetail:true,
       noticeData:{},
       noticeUrl:"http://8.222.154.106:8081/test/wxnotice",
       item: {
        content: '这是一段很长的文本，如果超过规定字数就会被省略显示。'
      },
      fromMeet:{},
      fromeetId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      var item = data.data;
      that.setData({
        fromMeet: item,
        fromeetId: item.meetid
      }, () => {
        that.LoadData(() => {
          console.log(that.data.fromeetId);
        });
      });
    });
  
    wx.showToast({
      title: '查看通知页面...',
      icon: 'success',
      image: '/static/images/成功.svg',
      duration: 2000
    });
  },
  // onLoad(options) {
  //      ////页面之间的传递 

       
  //      var that=this;
  //      var eventChannel = this.getOpenerEventChannel();
  //      eventChannel.on('acceptDataFromOpenerPage', function(data) {
  //        var item = data.data;
  //        that.setData({
  //          fromMeet:item,
  //          fromeetId:item.meetid
  //        })
  //        console.log(that.data.fromeetId);
  //      });
  //       wx.showToast({
  //                 title: '查看通知页面...',
  //                 icon: 'success',
  //                 image: '/static/images/成功.svg',
  //                 duration: 2000
  //                 });
  //      this.LoadData()
    
  // },
   /*methods */
  //  LoadData()
  //  {
  //    console.log(this.data.fromeetId)
  //   //  setTimeout(()=>{

  //   //  },8000)
  //    if(!isNaN(this.data.fromeetId))
  //    {
  //     wx.request({
  //       url:"http://192.168.168.179:8081/test/wxnotice/getByMeetId/"+this.data.fromeetId,
  //       methods:"GET",
  //       success: (result) => {
  //         let Data = result.data
  //         this.setData({
  //          noticeData: Data
  //        }, () => {
  //          console.log(this.data.noticeData);
  //        });
  //       },
  //       fail: (err) => {},
  //       complete: (res) => {},
  //     })
  //    }else{

  //    }
     
  //  },
  LoadData(callback) {//页面信息
    if (!isNaN(this.data.fromeetId)) {
      wx.request({
        url: "http://8.222.154.106:8081/test/wxnotice/getByMeetId/" + this.data.fromeetId,
        methods: "GET",
        success: (result) => {
          let Data = result.data;
          this.setData({
            noticeData: Data
          }, () => {
            console.log(this.data.noticeData);
            if (typeof callback === "function") {
              callback(); // 执行回调函数
            }
          });
        },
        fail: (err) => {},
        complete: (res) => {},
      });
    } else {
      if (typeof callback === "function") {
        callback(); // 执行回调函数
      }
    }
  },
//查看成员信息
showMemberDetail(event){
  this.setData({
    isShowMemberDetail: false
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
  //查看组信息
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
  //确认、取消
  Groupdetail(){
  this.setData({
        isShowGroupDetail: true,
        isShowMemberDetail: true,
     });
  },

   navigateToDetail:function(event) {
    var notice = event.currentTarget.dataset.item;
    console.log(notice)
    var judge1 = false;
   var judge2= false;

   /* 判断成员中有无 */
    var memberString=[]
    memberString = notice.member.split(",");
    for (let i = 0; i < memberString.length; i++) {
      var intvalue = parseInt(memberString[i]);
      if(intvalue==app.globalData.userInfo.id)
      {
        judge1=true;
        break;
      }
   }

   /*判断自己加入的组中 是否在这个通知中 */
   wx.request({
    url: app.globalData.frontUrl+'/test/groups/getMygroups/'+app.globalData.userInfo.id,
    method:'GET',
    success: (result) => {
       console.log(result.data)
       ///类的list
       var groupsList=[]
       if(result.data.data)
       {
         groupsList=result.data.data;///groupid 匹配
       }else{
          
       }
      

      ///通知的groupid String
       var groupString = []
       if(this.data.noticeData.groups)
       {
        groupString = this.data.noticeData.groups.split(",");
       }else{

       }
      


      ///3 4    1 3
      for(let i=0;i<groupsList.length;i++)
      {
        for(let j=0;j<groupString.length;j++)
        {
          if(groupsList[i].groupid== parseInt(groupString[j]))
          {
            judge2=true;
            break;
          }
        }
       
      }
      
    },
   fail: (err) => {},
   complete: (res) => {
    console.log(judge1)
    console.log(judge2)
    if(judge1===true||judge2===true)
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
     }else if(judge1==false&&judge2==false)
     {
         wx.showToast({
                  title: '你无法进入讨论......',
                  icon: 'none',
                  image: '/static/images/24gf-eyeHide2.svg',
                  duration: 2000
                  });
     }
   },
  })



      
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