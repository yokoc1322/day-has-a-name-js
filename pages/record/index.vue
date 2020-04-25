<template>
  <div>
    <v-progress-circular
      v-if="isLoading"
      class="ml-3"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <p v-else-if="errorMessage" class="error--text">
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
export default {
  middleware: ['require-login'],

  async asyncData({ store, $axios }) {
    try {
      const res = await $axios.get('/api/v1/record/?ordering=-date')
      return { records: res.data, isLoading: false }
    } catch (err) {
      return { errorMessage: err.response.data, isLoading: false }
    }
  },
  data() {
    return {
      isLoading: true,
      records: [],
      errorMessage: null
    }
  }
}
</script>
