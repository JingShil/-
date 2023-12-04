// login.js
Page({
  data: {
    phone: '',
    password: ''
  },
  //获取手机号
  onInputPhone(event) {
    this.setData({
      phone: event.detail.value
    })
    const phone = event.detail.value; //输入的手机号
    // 去除空格
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length !== 11) {
      wx.showToast({
        title: '手机号必须为11位',
        icon: 'none',
        duration: 2000,
      });
    } else if (!/^1[3456789]\d{9}$/.test(trimmedPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000,
      });
    }
  },
  //获取密码
  onInputPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 处理注册逻辑
  onRegister(e) {
    wx.redirectTo({
      url: '/pages/register/register',
    })
    console.log('register')
  },
  // 处理登录逻辑
  onLogin(e) {
    const phone = this.data.phone;
    const password = this.data.password;
    console.log('login')
    console.log(phone)
    console.log(password)
    if (phone && password) {
      // 发起登录请求，验证手机号和密码的正确性
      wx.request({
        url: 'http://8.222.154.106:8081/test/meet/add', 
        method: 'POST',
        header: {
          'Content-Type': 'application/json' // 请求头，设置为JSON格式
        },
        data: {
          phone: this.data.phone, // 请求参数
          password: this.data.password,
        },
        success(res) {
          // 登录成功
          console.log('登录成功');
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
          });
          // 跳转到首页
          wx.navigateTo({
            url: '/pages/index/index',
          });
        },
        fail(err) {
          // 请求失败的回调函数
          console.error("登录失败");
        }
      })
    } else {
      // 手机号或密码为空，显示错误提示
      wx.showToast({
        title: '请输入手机号和密码',
        icon: 'none',
        duration: 2000,
      });
    }
  },
  //微信登录
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      // 用户授权成功，可以获取到用户信息
      const userInfo = e.detail.userInfo;

      // 这里可以将 userInfo 发送到后端进行处理，比如登录或注册
      // 你可以使用微信提供的 wx.login() 方法获取登录凭证 code，然后将 code 和 userInfo 发送到后端

      // 示例：假设有一个后端登录接口 /login，接收 code 和 userInfo
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送 code 和 userInfo 到后端
            wx.request({
              url: 'https://your-backend.com/login',
              method: 'POST',
              data: {
                code: res.code,
                userInfo: userInfo
              },
              success: (res) => {
                // 后端处理登录逻辑的返回结果
                console.log(res.data);
              },
              fail: (error) => {
                console.error('请求后端登录接口失败', error);
              }
            });
          } else {
            console.error('获取登录凭证失败', res.errMsg);
          }
        },
        fail: (error) => {
          console.error('wx.login 失败', error);
        }
      });
    } else {
      // 用户拒绝授权
      console.log('用户拒绝授权');
    }
  }
})