<template>
  <div>
    <p v-if="errorMessage" class="error--text">
      {{ errorMessage }}
    </p>

    <template v-else>
      <div class="d-flex mb-2">
        <v-spacer></v-spacer>
        <router-link :to="{ path: '/record/calendar' }">
          <v-btn>
            <v-icon>mdi-calendar</v-icon>
          </v-btn>
        </router-link>
        <v-btn class="ml-2" @click="dumpRecord">
          <v-icon>mdi-file-download</v-icon>
        </v-btn>
      </div>

      <v-row dense>
        <v-col v-for="(record, index) in records" :key="index" cols="12">
          <v-card>
            <v-card-title>
              <router-link :to="{ path: '' + record.pk }" append>
                {{ record.title }}
              </router-link>
            </v-card-title>
            <v-card-subtitle>
              {{ record.date }}
              <v-icon v-if="record.status === 'great'">
                mdi-weather-sunny
              </v-icon>
              <v-icon v-else-if="record.status === 'good'">
                mdi-weather-hazy
              </v-icon>
              <v-icon v-else-if="record.status === 'bad'">
                mdi-weather-pouring
              </v-icon>
            </v-card-subtitle>
            <v-card-text style="white-space: pre-line"
              >{{ record.content }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import moment from 'moment/moment'
export default {
  middleware: ['require-login'],

  async asyncData({ store, $axios }) {
    try {
      const res = await $axios.get('/api/v1/record/?ordering=-date')
      return { records: res.data }
    } catch (err) {
      return { errorMessage: err.response.data }
    }
  },
  data() {
    return {
      records: [],
      errorMessage: null
    }
  },
  methods: {
    async dumpRecord() {
      try {
        const day = moment().format('YYYY-MM-DD')
        const res = await this.$axios.get('/api/v1/record/?ordering=-date')
        const url = URL.createObjectURL(new Blob([JSON.stringify(res.data)]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `dump-${day}.json`)
        document.body.append(link)
        link.click()
      } catch (err) {
        alert(err)
        console.log(err)
      }
    }
  }
}
</script>
