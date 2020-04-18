<template>
  <v-container>
    <p>{{ count }}</p>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      hello: 'hello'
    }
  },
  computed: {
    ...mapState(['count'])
  }
}
</script>
