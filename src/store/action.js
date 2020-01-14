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
      openid: state.openid || 'o3JAqt0Jr9vtoVncMW7ZBnHFvUd',
      unionid: state.unionid || 'o6qE3t8QKr3uYqrgbknYUSE72RiM'
    }
    chttp.get(apis.homeApi, params).then(res => {
      commit('SAVE_ICON_LIST', res.data.iconListVer)
    }).catch(() => {
    })
  },
  getHomeConfig ({
    commit,
    state
  }) {
    let params = {
      openid: state.openid || 'o3JAqt0Jr9vtoVncMW7ZBnHFvUd',
      unionid: state.unionid || 'o6qE3t8QKr3uYqrgbknYUSE72RiM'
    }
    chttp.get(apis.configApi, params).then(res => {
      let data = res.data
      commit('SAVE_HOME_USER_INFO', res.data) // 用户信息
      commit('SAVE_VIP_BALANCE', data.charge.balance) // 用户余额
      commit('SAVE_KTV_INFO', data.stb) // 房台信息
      commit('SAVE_PACKAGE_DISCOUNT_RIGHTS', data.charge.rights) // 礼物/祝福/冠名/照片免费次数
      commit('SAVE_HOME_TOAST', !data.vip) // 非会员首次进入弹运营弹窗
      commit('SAVE_VIP_EXP_STATUS', data.user.vip_exp_status) // 是否买过体验会员
      commit('SAVE_ROOM_INTERACTION', data.stb.func) // 房台支持版本信息
      commit('BLESS_PATH', data.stb.func.ba)
      commit('PHOTO_PATH', data.stb.func.photo)
      // 活动信息
      commit('SET_ACTIVITY_OVER', !!data.ball.isfinish) // 砸金蛋活动是否结束
      commit('SET_RANK_INFO', data.lsk) // 雷石k歌信息
    }).catch(() => {
    })
  },
  // 绑定状态
  getBindStatus ({
    commit,
    state
  }, callback) {
    let params = {
      openid: state.openid || 'o3JAqt0Jr9vtoVncMW7ZBnHFvUd',
      unionid: state.unionid || 'o6qE3t8QKr3uYqrgbknYUSE72RiM'
    }
    chttp.get(apis.bindStatus, params)
      .then(res => {
        commit('SAVE_BIND_STATUS', {
          bind_status: true
        })
        callback && callback(res)
      }).catch((res) => {
        console.log(res)
      })
  },
  // 用户信息/是否是vip
  getUserInfo ({
    commit,
    state
  }) {
    let openid = state.openid
    let unionid = state.unionid
    chttp.get(apis.userInfo + '?openid=' + openid + '&unionid=' + unionid).then(res => {
      commit('SAVE_USER_INFO', res || {})
      commit('SAVE_VIP_BALANCE', res.balance)
      commit('SAVE_CHARGE_RIGHTS', res.rights)
      commit('SAVE_SHARE_RIGHTS', res.share_right)
      commit('SAVE_RIGHTS_DESC', res.rights_desc)
    }).catch(() => {
      // Vue.$messageBox.alert('请扫码绑定房台', '')
    })
  },
  showBarrage ({
    commit,
    state
  }) {
    if (!state.bind_status) {
      this.$store.commit('SHOW_SCAN_QRCODE')
      return
    }
    const params = {
      openid: state.openid,
      unionid: state.unionid
    }
    chttp.get(apis.barrageAuth, params)
      .then(res => {
        if (res.retcode) {
          commit('SHOW_PAY_PANEL', {
            type: 'barrage'
          })
        } else {
          commit('SHOW_BARRAGE', true)
        }
      })
  },
  rankSongData ({
    commit,
    state
  }, callback) {
    const params = {
      openid: state.openid,
      unionid: state.unionid
    }
    chttp.get(apis.rankHome, params).then(res => {
      commit('SET_RANK_INFO', res.data || {})
      callback && callback(res)
    }).catch(err => {
      console.log(err)
    })
  },
  login ({ commit, state, dispatch }) {
    wx.login({
      success (res) {
        if (res.code) {
          // 发起网络请求
          let params = {
            code: res.code
          }
          chttp.get(apis.login, params).then(res => {
            commit('SAVE_OPENID', res.data.openid)
            commit('SAVE_UNIONID', res.data.unionid)
            dispatch('getHomeConfig')
            dispatch('getHomeData')
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
}
