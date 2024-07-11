// index.js


Page({
  data: {
    grades: [
      { id: 2021, title: '2021级' , icon: "numbers-1-1"},
      { id: 2022, title: '2022级' , icon: "numbers-2-1"},
      { id: 2023, title: '2023级' , icon: "numbers-3-1"},
      { id: 2024, title: '2024级' , icon: "numbers-4-1"}
    ]
  },
  handleCellClick: function(event) {
    const content = event.currentTarget.dataset.id;
    wx.setStorageSync('selectedGrade', content);
    wx.navigateTo({
      url: '/pages/majorSelector/majorSelector'
    });
  }
})
