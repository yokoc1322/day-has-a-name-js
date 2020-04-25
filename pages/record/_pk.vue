<template>
  <v-container>
    <template v-if="getErrorMessage">
      <p>{{ getErrorMessage }}</p>
    </template>
    <template else>
      <v-form @submit.prevent="update">
        <v-text-field v-model="title" name="title" filled></v-text-field>
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          name="title"
          placeholder="title"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              prepend-icon="mdi-calendar"
              readonly
              filled
              v-on="on"
            ></v-text-field>
          </template>

          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dateMenu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-radio-group v-model="status" row>
          <v-radio label="Great" value="great"></v-radio>
          <v-radio label="Good" value="good"></v-radio>
          <v-radio label="Bad" value="bad"></v-radio>
        </v-radio-group>

        <v-textarea
          v-model="content"
          name="content"
          filled
          auto-grow
          placeholder="content"
          required
        ></v-textarea>

        <div class="d-flex align-center">
          <v-btn type="submit">Write</v-btn>
          <p v-if="sendErrorMessage" class="mb-0 ml-3 error--text">
            {{ sendErrorMessage }}
          </p>
          <v-progress-circular
            v-if="isSending"
            class="ml-3"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-spacer></v-spacer>
          <v-btn type="button" class="error darken-2" @click="deleteRecord">
            Delete
          </v-btn>
        </div>
      </v-form>
    </template>
  </v-container>
</template>

<script>
export default {
  middleware: ['require-login'],
  async asyncData({ store, $axios, params, error }) {
    try {
      const res = await $axios.get(`/api/v1/record/${params.pk}/`, {
        headers: { Authorization: `Token ${store.state.token}` }
      })

      return {
        content: res.data.content,
        title: res.data.title,
        date: res.data.date,
        status: res.data.status
      }
    } catch (err) {
      if (err.response.status === 404) {
        error({ statusCode: 404, message: 'Not found' })
      } else {
        return { getErrorMessage: err.response.data }
      }
    }
  },
  data() {
    return {
      record: null,
      getErrorMessage: null,
      content: '',
      title: '',
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false,
      status: 'good',
      isSending: false,
      sendErrorMessage: null
    }
  },
  validate({ params }) {
    return /^\d+$/.test(params.pk)
  },
  computed: {
    pk() {
      return this.$route.params.pk
    }
  },
  methods: {
    async update() {
      this.isSending = true
      this.sendErrorMessage = null
      try {
        await this.$axios.put(`/api/v1/record/${this.pk}/`, {
          content: this.content,
          title: this.title,
          date: this.date,
          status: this.status
        })
        this.$router.push('/record')
      } catch (err) {
        this.sendErrorMessage = err.response.data
      }

      this.isSending = false
    },
    async deleteRecord() {
      this.isSending = true
      this.sendErrorMessage = null
      try {
        await this.$axios.delete(`/api/v1/record/${this.pk}/`)
        this.$router.push('/record')
      } catch (err) {
        this.sendErrorMessage = err.response.data
      }
      this.isSending = false
    }
  }
}
</script>
