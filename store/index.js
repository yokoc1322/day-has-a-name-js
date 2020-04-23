import Cookies from 'js-cookie'

export const state = () => ({
  token: null,
  isHerokuLaunched: false
})

export const mutations = {
  setToken(state, token) {
    state.token = token
    Cookies.set('token', token, { expires: 2, secure: true, sameSite: 'lax' })
  },
  clearToken(state) {
    state.token = null
    Cookies.remove('token')
  },
  setFlagLaunchHeroku(state) {
    state.isHerokuLaunched = true
  }
}
