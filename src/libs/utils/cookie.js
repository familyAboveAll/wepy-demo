export default {
  // 设置 cookie
  setCookie (value, days, name) {
    name = name || 'topenid'
    let d = new Date()
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = name + '=' + value + ';expires=' + expires
  },
  // 根据type 取cookie
  getCookie (name) {
    let v
    name = name || 'topenid'
    v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)') // 正则匹配cookie字段
    return v ? v[2] : null
  },
  // 从url获取相关参数
  getQueryString (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r !== null) {
      return unescape(r[2])
    }
    return null
  }
}
