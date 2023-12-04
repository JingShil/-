// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    theme: 'dark' ,// 当前主题，默认为黑色主题
    name:"weixin",
    ////获取本地的用户信息   
    // userInfo: wx.getStorageSync('userInfo')||null,
    userInfo:{
        id:4,
      },
          frontUrl:'http://8.222.154.106:8081',
          globalimage:'/static/images/一片空白的豆丁.svg'
  }
})
