// login.js
Page({
  data: {
  phone: '',
  password: '',
  msgcode:'',
  msgButtonTitle: '获取验证码', // 验证码按钮文本
  msgButtonDisabled: false, // 验证码按钮是否禁用
  },
//获取手机号
  onInputPhone(e) {
  this.setData({
    phone: e.detail.value
  })
  },
//获取密码
  onInputPassword(e) {
  this.setData({
    password: e.detail.value
  })
  },
  //获取验证码
  onInputMSG(){
    this.setData({
      msgcode: e.detail.value
    })
  },
  //点击获取验证码
  getMSG() {
    // 判断手机号是否合法
    const phone = this.data.phone;
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length !== 11 || !/^1[3456789]\d{9}$/.test(trimmedPhone)) {
      wx.showToast({
        title: '请输入合法的手机号',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    // 执行获取验证码逻辑
    // 发起请求或调用相应的接口来获取验证码
    // ...

    // 模拟获取验证码的操作（示例：显示倒计时）
    let count = 60;
    const timer = setInterval(() => {
      if (count > 0) {
        count--;
        // 更新按钮文本显示为倒计时秒数
        this.setData({
          msgButtonTitle: `${count}s后重新获取`,
          msgButtonDisabled: true,
        });
      } else {
        // 倒计时结束，恢复按钮文本和状态
        this.setData({
          msgButtonTitle: '获取验证码',
          msgButtonDisabled: false,
        });
        clearInterval(timer);
      }
    }, 1000);
  },
 // 处理注册逻辑
  onRegister(e) {
  const phone = this.data.phone;
  const password = this.data.password;
  const msgcode=this.data.msgcode;
  console.log('register')
  console.log(phone)
  console.log(password)
  console.log(msgcode)
  if (phone && password && msgcode) {
    // 发起注册请求，验证手机号和密码和验证码的正确性
    wx.request({
      url: 'http://8.222.154.106:8081/test/meet/add',
      method: 'POST', 
      header: {
        'Content-Type': 'application/json' // 请求头，设置为JSON格式
      },
      data: {
        phone: this.data.phone, // 请求参数
        password: this.data.password,
        msgcode: this.data.msgcode,
      },
      success(res) {
        // 注册成功
        console.log('注册成功');
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000,
        });
        // 跳转到首页
        wx.navigateTo({
          url: '/pages/login/login',
        });
      },
      fail(err) {
        // 请求失败的回调函数
        wx.showToast({
          title: '注册失败',
          icon: 'error',
          duration: 2000,
        });
      }
    })
  }else if(!phone){
    wx.showToast({
     title: '请输入手机号',
      icon: 'error',
      duration: 2000,
    });
  } else if(!password){
    // 手机号或密码为空，显示错误提示
    wx.showToast({
      title: '请输入密码',
      icon: 'error',
      duration: 2000,
    });
  }else {
    wx.showToast({
      title: '请输入验证码',
      icon: 'error',
      duration: 2000,
    });
  }
  },
// 处理登录逻辑
  onLogin(e) {
    wx.redirectTo({
      url: '/pages/login/login',
    })
  console.log('login')
  },
})
