// pages/meet/meet.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     meetData:[],
     urlfront:'http://8.222.154.106:8081',

     MemberModalHidden:true,

     UserList:[],
     UserIdSelectedList:[],
     xmluserInfoId:app.globalData.userInfo.id,
     

     ///保存为通知
     newNotice:{
         meetid:'',
         title:'',
         text:'',
         member:'',
         promoter:'',
         address:'',
     },
     selectedMeet:{},

     ///撰写通知：
     WriteNoticeModalHidden:true,
     
     ToWriteNoticePage:{
       theme:'yourfather'
     },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中....',
      mask:true,
    })

    this.LoadData()

  },
  LoadData()
  {
    wx.request({
      url:this.data.urlfront+"/test/meet/page?pageNum=1&pageSize=8",
      methods:"GET",
      success: (result) => {
       let Data = result.data.records;
      
        this.setData({
          meetData: Data
       }, () => {

         console.log(this.data.meetData);
       });
       wx.stopPullDownRefresh();
       
      },
      fail: (err) => {},
      complete: (res) => {
        const meetData = this.data.meetData.map(item => ({
          ...item,
          color: this.getRandomColor()
        }));
        
    this.setData({ 
      meetData:meetData,
     });

    console.log(this.data.meetData)
        wx.hideLoading();
      },
    })


  },

  /**
   * 弹窗组件 确认取消
   */
  // showMemberModal(e)
  // {

  //  ///获取当前的meet信息 初始化
  //   this.data.selectedMeet={}
  //   this.data.UserList={}


  //   ///获取他的meetid 通过meetid返回string型数组
   

  //   this.data.newNotice={}

  //   var meet = e.target.dataset.item;
  //   this.data.selectedMeet=meet;
  //   console.log(this.data.selectedMeet)

  //     wx.request({
  //       url: this.data.urlfront+'/user/getUserList',
  //       method:'GET',
  //       success:(res =>{
  //         let data = res.data.data
  //         console.log(data)
          
  //           this.setData({
  //             MemberModalHidden:false,
  //             UserList: data
  //           })

  //       }),
  //       complete:(complete => {

  //       })
  //     })

  //     wx.request({
  //       url: this.data.urlfront+'/test/wxnotice/getByMeetId/'+meet.meetid,
  //       method:"GET",
  //       success:(res => {
  //         if(res.data==null)
  //         {
  //           this.data.UserIdSelectedList=[app.globalData.userInfo.id]
  //         }else
  //         {
  //           console.log(res.data)
  //           var selectList=[]
  //           for (let char of res.data.member) {
  //             if (char !== ',') {
  //               var intValue = parseInt(char);
  //               selectList.push(intValue);
  //             }
  //           }
  //          this.data.UserIdSelectedList=[]
  //          this.data.UserIdSelectedList=selectList
  //          console.log(this.data.UserIdSelectedList)
  //         }
  //       })
  //     })
  // },
  showMemberModal(e) {
    this.data.selectedMeet = {};
    this.data.UserList = {};
    this.data.newNotice = {};
  
    var meet = e.target.dataset.item;
    this.data.selectedMeet = meet;
    console.log(this.data.selectedMeet);
  
    // 使用 Promise 和 async/await 处理异步请求
    Promise.all([
      this.getNoticeByMeetId(meet.meetid),
      this.getUserList(),
      
    ]).then(() => {
          // 预处理数据，将选中状态存储在 checkedList 数组中 新加一个属性进行渲染
    const checkedList = this.data.UserList.map((item) => {
      return {
        ...item,
        checked: this.data.UserIdSelectedList.includes(item.id)
      };
    });
      // 异步请求全部完成后，进行页面渲染
      this.setData({
        MemberModalHidden: false,
        UserList: checkedList,
        UserIdSelectedList: this.data.UserIdSelectedList
      });
    });
  },
  
  getUserList() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.data.urlfront + '/user/getUserList',
        method: 'GET',
        success: (res) => {
          let data = res.data.data;
          console.log(data);
          this.data.UserList = data;
          resolve();
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  },
  
  getNoticeByMeetId(meetId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.data.urlfront + '/test/wxnotice/getByMeetId/' + meetId,
        method: 'GET',
        success: (res) => {
          if (res.data === null) {
            this.data.UserIdSelectedList = [app.globalData.userInfo.id];

            ///undefined 的走下面
          } else {
            console.log(res.data);
            if (res.data.member !== undefined) { // 添加判断条件
              var selectList = [];
              for (let char of res.data.member) {
                if (char !== ',') {
                  var intValue = parseInt(char);
                  selectList.push(intValue);
                }
              }
              this.data.UserIdSelectedList = selectList;
              console.log(this.data.UserIdSelectedList);
            } else {
              this.data.UserIdSelectedList = [app.globalData.userInfo.id];
            }
          }
          resolve();
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
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

  console.log("此时的选择用户的集合为：" + this.data.UserIdSelectedList); // 打印选择的ID
  },   
  confirmMemberModal()
  {


    ////将UserSelectedId 传入  updated
    //先为空
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
      'newNotice.meetid':this.data.selectedMeet.meetid,
      'newNotice.title':this.data.selectedMeet.theme,
      'newNotice.promoter':this.data.selectedMeet.promoter,
      'newNotice.address':this.data.selectedMeet.address,
      'newNotice.member':memberstring,
    })
    console.log(this.data.newNotice)
   ///异步请求1秒钟
    setTimeout(()=>{
      wx.request({
        url: this.data.urlfront+'/test/wxnotice/save',
        data:this.data.newNotice,
        method:'POST',
        success:(res => {
          ///打印成功日志
          console.log(res.data)
  
        }),
        complete:(res => {
  
          //取消弹窗
           this.setData({
            MemberModalHidden:true
           })
           wx.hideLoading();
        })
      })
    },1000)

  },
  cancelMemberModal()
  {
    ////// UserList置为空
    this.setData({
      MemberModalHidden:true
    })
  },
  
  ////showWriteNoticeModal
  showWriteNoticeModal(e)
  {
    var meet = e.target.dataset.item;

    
    wx.navigateTo({
      url: '/pages/chat/chat?item=' + meet,
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: meet});
      }
    });

    console.log(meet)
  },
  showSelectGroupPage(e)
  {
    var meet = e.target.dataset.item;
    console.log(meet)
    ///如果wxnotice中 没有该会议 必须创建一个
    wx.request({
      url: this.data.urlfront + '/test/wxnotice/getByMeetId/' + meet.meetid,
      method: 'GET',
      success: (res) => {
        var Data = res.data;
        console.log(res.data)
        if (Data) {
          wx.navigateTo({
            url: '/pages/groupSelect/groupSelect?item=' + meet,
            success: function(res) {
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: meet});
            }
          });
        }else
        {
            //需要创建一个再进去
            this.setData({
              'newNotice.meetid':meet.meetid,
              'newNotice.title':meet.theme,
              'newNotice.promoter':meet.promoter,
              'newNotice.address':meet.address,
              'newNotice.member':"",///空的
            })
             wx.request({
               url: this.data.urlfront+'/test/wxnotice/save',
               data:this.data.newNotice,
               method:'POST',
               success: (result) => {
                  console.log(result.data)
               },
               complete: (res) =>{
                 console.log("GGGGGGGGG")
               }
             })
             wx.navigateTo({
              url: '/pages/groupSelect/groupSelect?item=' + meet,
              success: function(res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: meet});
              }
            });
     
        }
      }
    })

  },
  confiremWriteNoticeModal()
  {
    this.setData({
      WriteNoticeModalHidden:true
    })
  },
  cancelWriteNoticeModal()
  {
     this.setData({
       WriteNoticeModalHidden:true
     })
  },
  

  navigatorToComment(e)
  {

    var meet = e.target.dataset.item;
    wx.navigateTo({
      url: '/pages/report/report?item=' + meet,
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: meet});
      }
    });
  },
  /**
   * Util层
   */
  getRandomColor: function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
    ///清空数据
    this.setData({
      meetData:[]
    })
    console.log("code=200")
       this.LoadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
   
    wx.showLoading({
      title: '加载中....',
      mask:true,
    })
    setTimeout(()=>{
      this.LoadData()
    },1500)
        
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})