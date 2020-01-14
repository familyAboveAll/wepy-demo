import {
  chttp,
  apis
} from '@/libs/interfaces'
export default {
  // 设备信息
  getHomeData ({
    commit,
    state
  }) {
    let params = {
      openid: state.openid,
      unionid: state.unionid
    }
    chttp.get(apis.homeApi, params).then(res => {
      commit('SAVE_ICON_LIST', res.data.iconListVer)
    }).catch(() => {
    })
  }
}
