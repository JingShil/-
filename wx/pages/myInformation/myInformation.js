Page({
  data:{
    userInfo: {},
    name: '',
    genderArray: ['男', '女'],
    gender: 0,
    genderIndex: 0,
    age: 18,
    email:'',
    tel: '',
    birthday: '',
    intro: '',
    // imgUrl:'/images/user/2022/06/20/0831f209fe5e4aebb758404d7b3f41de.jpg',
    userPicture:'/images/user/2022/06/20/0831f209fe5e4aebb758404d7b3f41de.jpg'
  },

  onLoad:function(options){
    const userInfo = getApp().globalData.userInfo;
    // this.getUser();
    this.setData({
      userInfo: userInfo
    });
    // // 首先判断一下是否登录
    // // 如果没有登录(判断token)
    // var token = wx.getStorageSync("token");
    // if(token.length == 0){
    //   // 未登录，跳转界面
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    //   // console.log("1111111111111null")
    // }else{
    //   // 已登录，加载User信息
    //   var sysUser = wx.getStorageSync("sysUser");
    //   if(sysUser){
    //     this.setData({name:sysUser.userName});
    //     this.setData({email:sysUser.email});
    //     this.setData({tel:sysUser.phoneNumber});
    //     this.setData({gender:sysUser.sex});
    //     this.setData({birthday:sysUser.birthday});
    //     this.setData({intro:sysUser.autograph});
    //     // JSON.parse(subject.moviePoster)[0]
    //     this.setData({userPicture:JSON.parse(sysUser.userPicture)[0]});
    //   //  this.setData({imgUrl:sysUser.userPicture})
    //   }
    //   // console.log(2222222222)
    //   // console.log(token.length)
    // }
  },
  changeGender: function(e) {
    console.log(e)
    var genderIndex = e.detail.value
    if (genderIndex != "null") {
      this.setData({
        genderIndex: genderIndex,
        gender: this.data.genderArray[this.data.genderIndex]
      })
    }
  },
  // getUser: function () {
  //     that.setData({
  //       userInfo:getApp().globalData.userInfo
  //     });
  //   },

  changeBirthday: function(e) {
    var birthday = e.detail.value
    if (birthday != "null") {
      this.setData(
        {birthday: birthday}
      )
    }
  },


  saveUserInfo(e) {
    // console.log(11);
    
    var page = this;
    var token = wx.getStorageSync("token");
    var sysUser = wx.getStorageSync("sysUser");

    // userTemp表单里面的数据
    var userTemp = e.detail.value;
    console.log(e);
    console.log(userTemp);
    sysUser.userName = userTemp.name;
    sysUser.email = userTemp.email;
    sysUser.phoneNumber = userTemp.tel;
    sysUser.birthday = userTemp.birthday;
    sysUser.autograph = userTemp.intro;
    // 赋值性别
    if (userTemp.gender == '男') {
      sysUser.sex = true;
      // console.log("man");
      // console.log(userTemp.gender);
    } else {
      sysUser.sex = false;
      // console.log("woman");
      // console.log(userTemp.gender);
    }
    
    // 覆盖原来的sysUser
    wx.setStorageSync("sysUser",sysUser);   
   console.log(sysUser);

    wx.request({
      // 请求的url
     // http://127.0.0.1:8181/sysUser  PUT
      url: 'http://127.0.0.1:8181/sysUser',
      data:{"userId":sysUser.userId,
      "userName":sysUser.userName,
      "password":sysUser.password,
      "salt":sysUser.salt,
      "email":sysUser.email,
      "phoneNumber":sysUser.phoneNumber,
      "sex":sysUser.sex,
      "userPicture":sysUser.userPicture,
      "roleId":sysUser.roleId,
      "birthday":sysUser.birthday,
      "autograph":sysUser.autograph,
      "sysRole":sysUser.sysRole},
      method: 'PUT',
      header: {
        "Content-Type": "application/json",
        "token":token
      },
      success: function (res) {
        console.log(res)
        console.log(res.data.code)
        // res.data.code后端的响应码
        if (res.data.code == 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          });
          // wx.navigateBack({
          //   delta: 1
          // })
        }
        else {
          wx.showToast({
            title: '保存失败',
            icon: 'error',
            duration: 1000
          });
        }

      }
    })
  },

  // 上传图片
  changeAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        this.setData({
          imgUrl: tempFilePaths
        })
        console.log(tempFilePaths)
      }
    })
  },
  reMePage(){
    wx.navigateBack({
         delta: 1
       })
  },
  

 /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    // 下拉刷新
    var self = this;
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    wx.showLoading({
      title: '加载中...',
    })
    
    self.onLoad();
    wx.stopPullDownRefresh();
    
  }

})
