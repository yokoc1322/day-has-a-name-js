export default function({ $axios, store }) {
  $axios.onRequest((config) => {
    const token = store.state.token
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
  })
}
