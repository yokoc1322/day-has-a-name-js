export default function({ $axios }) {
  $axios.get('/').then((res) => {
    console.log(res)
  })
}
