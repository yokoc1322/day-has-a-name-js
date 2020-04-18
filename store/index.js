export const state = () => ({
  token: null,
  serverURL: 'http://localhost:8000'
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  }
}
