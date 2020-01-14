// 封装http请求
import Fly from 'flyio/dist/npm/wx'
import qs from 'qs'
import {
  util
} from '@/libs/utils'
import hosts from '@/libs/base/hosts'

const http = new Fly()
http.config.timeout = 15000
http.config.baseURL = hosts.ktv_baseurl

http.interceptors.request.use(config => {
  // 请求头里面加入各种判断
  if (config.method === 'POST' && config.body) {
    config.body = qs.stringify(config.body)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  // 接口url中添加BaseUrlType查询字段。如：/login?BaseUrlType=coupon
  // 自动切换http请求的BaseUrl为coupon域名
  if (util.getUrlPrem('BaseUrlType', config.url) === 'other') {
    const index = config.url.indexOf('?')
    config.url = config.url.substring(0, index)
  }
  // 上传图片的域名
  if (util.getUrlPrem('BaseUrlType', config.url) === 'upyun') {
    config.baseURL = hosts.upyun_baseurl
  }
  if (util.getUrlPrem('BaseUrlType', config.url) === 'coupons') {
    config.baseURL = 'http://coupon.ktvsky.com'
  }
  if (!util.getUrlPrem('close_loading', config.url)) {
    wx.showLoading({ title: '拼命加载中...' })
  }
  return config
}, error => {
  // 拦截请求错误
  Promise.reject(error)
})

http.interceptors.response.use(response => {
  const res = response.data
  wx.hideLoading()
  if (res.errcode === 200 || res.errcode === 21001 || res.errcode === 0 || res.code === 200 || res.total || response.config.url.indexOf('//ad.ktvsky.com/ad/config/') >= 0) {
    return res
  } else {
    wx.showToast({
      title: res.errmsg,
      icon: 'none'
    })
    return Promise.reject(res.errmsg)
  }
}, error => {
  // 调用一个错误提醒dialog
  wx.showToast({
    title: error.errmsg,
    icon: 'none'
  })
  return Promise.reject(error)
})

export default http
