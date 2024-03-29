var canOnePointMove = false
var onePoint = {
  x: 0,
  y: 0
}
var twoPoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}
Page({
  data: {
    msg: '',
    src: '../images/diandi_cur.png',
    width: 0,
    height: 0,
    left: 375,
    top: 300,
    scale: 1,
    rotate: 0,
    sizeArray: ["../images/size_100.png", "../images/size_150.png", "../images/size_250.png","../images/size_500.png"],
    sizeList:[100,150,250,500],
    swiperIndex: 0,
    leftRate:'100%'
  },
  // 关闭上拉加载
  onReachBottom: function () {
    return
  },
  bindload: function (e) {
    var that = this
    var width = e.detail.width
    var height = e.detail.height
    if (width > 750) {
      height = 750 * height / width
      width = 750
    }
    if (height > 1200) {
      width = 1200 * width / height
      height = 1200
    }
    that.setData({
      width: width,
      height: height
    })
  },
  touchstart: function (e) {
    var that = this
    if (e.touches.length < 2) {
      canOnePointMove = true
      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2
    } else {
      twoPoint.x1 = e.touches[0].pageX * 2
      twoPoint.y1 = e.touches[0].pageY * 2
      twoPoint.x2 = e.touches[1].pageX * 2
      twoPoint.y2 = e.touches[1].pageY * 2
    }
  },
  touchmove: function (e) {
    var that = this;
    if (that.data.top >= 400){
      that.setData({
        top: 399
      })
      return;
    }
    if (that.data.top <= 300) {
      that.setData({
        top: 301
      })
      return;
    }
    var rate = 100-parseInt(that.data.top-300);
    that.setData({
      leftRate: rate+'%'
    })
    if (e.touches.length < 2 && canOnePointMove) {
      var onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
      var onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
      that.setData({
        left: that.data.left ,
        top: that.data.top + onePointDiffY
      })
      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2
    } else if (e.touches.length > 1) {
      var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
      twoPoint.x1 = e.touches[0].pageX * 2
      twoPoint.y1 = e.touches[0].pageY * 2
      twoPoint.x2 = e.touches[1].pageX * 2
      twoPoint.y2 = e.touches[1].pageY * 2
      // 计算角度，旋转(优先)
      var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
      var curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI
      if (Math.abs(perAngle - curAngle) > 1) {
        that.setData({
          msg: '旋转',
          rotate: that.data.rotate + (curAngle - perAngle)
        })
      } else {
        // 计算距离，缩放
        var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
        var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
        that.setData({
          msg: '缩放',
          scale: that.data.scale + (curDistance - preDistance) * 0.005
        })
      }
    }
  },
  touchend: function (e) {
    var that = this
    canOnePointMove = false
  },

  bindchange(e) {
    
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  sureAction:function(){
    var that = this;
    wx.reLaunch({
      url: '../../pages/index/index?containerSize=' + that.data.sizeList[that.data.swiperIndex] + '&leftRate=' + that.data.leftRate
    })
  },
  onShareAppMessage: function() {
    return {
      title: '不骗你，我真的在输液，明白该做什么了么？',
      path: '/pages/index/index'
    }
  }
})