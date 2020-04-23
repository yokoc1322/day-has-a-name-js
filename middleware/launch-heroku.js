export default function({ store, $axios }) {
  if (!store.state.isHerokuLaunched) {
    console.log('Launching heroku...')
    $axios.get('/').then((res) => {
      console.log('Heroku has been launched')
      console.log(res)
      store.commit('setFlagLaunchHeroku')
    })
  }
}
