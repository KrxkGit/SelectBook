// pages/bookList/bookList.js
import Message from 'tdesign-miniprogram/message/index';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    majorId:"",
    majorName:"",
    loadingState: 0,
    books: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const grade = wx.getStorageSync('selectedGrade');
    const majorId = wx.getStorageSync('majorId');
    const majorName = wx.getStorageSync('majorName');
    this.setData({
      grade: grade,
      majorId: majorId,
      majorName: majorName
    });
    wx.request({
      url: `${app.globalData.serverBaseUrl}/queryBookList`,
      method: 'POST',
      data: {
        grade: grade,
        majorId: majorId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      timeout: 15000,
      success: (res) => {
        if (res.statusCode === 200) {
          const bookList = res.data.data.list.map(book => ({
            ...book,
            author: "点击查询"
          }));
          this.setData({
            books: bookList,
            loadingState: 1
          });
        }else {
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

  queryAuthor(e){
    const index = e.currentTarget.dataset.index
    const authorKey = `books[${index}].author`;
    this.setData({
      [authorKey]: "请稍候..."
    });
    wx.request({
      url: `${app.globalData.isbnQueryUrl}/book`,
      method: 'GET',
      timeout: 15000,
      data: {
        isbn: e.currentTarget.dataset.isbn,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            [authorKey]: res.data.info.authors
          });
        }else {
          this.setData({
            [authorKey]: "查询失败"
          });
        }
      },
      fail: (error) => {
        console.log('error', error);
        this.setData({
          [authorKey]: "查询失败"
        });
      }
    });
  },

  showSuccessMessage() {
    Message.success({
      context: this,
      offset: [90, 32],
      duration: 5000,
      content: '信息已成功复制到剪贴板',
    });
  },

  copyToClipBoard(e){
    const that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.info,
      success (res) {
        that.showSuccessMessage();
      }
    })
  },
})