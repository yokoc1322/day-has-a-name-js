<script>
export default {
  created() {
    if (this.$store.state.token) {
      this.$router.replace('/write')
    } else {
      this.$router.replace('/login')
    }
  }
}
</script>
