<template>
  <v-container>
    <p class="display-1">Logout....</p>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('clearToken')
    setTimeout(() => {
      this.$router.push('/login')
    }, 1000)
  }
}
</script>
