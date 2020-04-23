export const state = () => ({
  token: null,
  isHerokuLaunched: false
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  },
  setFlagLaunchHeroku(state) {
    state.isHerokuLaunched = true
  }
}
