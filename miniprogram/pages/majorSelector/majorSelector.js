// pages/majorSelector.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingState: 0,
    grade: 0,
    resultList: [],
    majors: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const id = wx.getStorageSync('selectedGrade');
    this.setData({
      grade: id
    });
    wx.request({
      url: `${app.globalData.serverBaseUrl}/listMajors`,
      method: 'GET',
      timeout: 15000,
      success: (res) => {
        if (res.statusCode === 200) {
          const majorList = res.data.data;
          majorList.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
          const filteredMajors = majorList.filter(item => item.grade === this.data.grade);
          this.setData({
            majors: filteredMajors.map(item => ({
              majorId: item.majorId,
              majorName: item.majorName,
              collegeName: item.collegeName
            })),
            loadingState: 1
          });
        } else {
          this.setData({
            loadingState: 2
          });
        }
      },
      fail: (error) => {
        console.log('error', error);
        this.setData({
          loadingState: 2
        });
      }
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

  },
  onChangeValue(e) {
    const value = e.detail.value;
    this.setData({ searchQuery: value });
    this.searchMajors(value);
  },

  searchMajors(value) {
    const resultList = this.data.majors.filter(item => item.majorName.includes(value));
    this.setData({
      resultList: resultList
    });
  },

  handleCellClick(e) {
    const majorId = e.currentTarget.dataset.id;
    const majorName = e.currentTarget.dataset.title;
    wx.setStorageSync('majorId', majorId);
    wx.setStorageSync('majorName', majorName);
    wx.navigateTo({
      url: '/pages/bookList/bookList'
    });
  },

  goback(){
    wx.navigateBack();
  }
})