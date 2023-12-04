Page({
  data: {
    friends: ['好友1', '好友2', '好友3', '好友4', '好友5'],
    dropdownOpen: false
  },

  toggleDropdown: function () {
    this.setData({
      dropdownOpen: !this.data.dropdownOpen
    });
  }
});