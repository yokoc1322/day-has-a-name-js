import Cookies from 'js-cookie'
export default function({ store }) {
  const cookieToken = Cookies.get('token')
  if (cookieToken) {
    store.commit('setToken', cookieToken)
  }
}
