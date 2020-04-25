<template>
  <div></div>
</template>

<script>
import moment from 'moment/moment'
export default {
  beforeCreate() {
    const year = String(moment().year())
    const month = String(moment().month() + 1).padStart(2, '0')
    this.$router.replace(`/record/calendar/${year}/${month}`)
  }
}
</script>
