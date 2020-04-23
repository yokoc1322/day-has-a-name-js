<template>
  <v-container>
    <v-form @submit.prevent="write">
      <v-textarea
        v-model="content"
        name="content"
        filled
        auto-grow
        placeholder="content"
        required
      ></v-textarea>
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

      <div class="d-flex align-center">
        <v-btn type="submit">Write</v-btn>
        <p v-if="errorMessage" class="mb-0 ml-3 error--text">
          {{ errorMessage }}
        </p>
        <v-progress-circular
          v-if="isSending"
          class="ml-3"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      content: '',
      title: '',
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false,
      status: 'good',
      errorMessage: null,
      isSending: false
    }
  },
  middleware: ['require-login'],
  computed: {
    ...mapState(['token'])
  },
  methods: {
    async write() {
      this.isSending = true
      this.errorMessage = null
      try {
        await this.$axios.post(
          '/api/v1/record/',
          {
            content: this.content,
            title: this.title,
            date: this.date,
            status: this.status
          },
          {
            headers: { Authorization: `Token ${this.$store.state.token}` }
          }
        )
        this.$router.push('/record')
      } catch (err) {
        this.errorMessage = err.response.data
      }

      this.isSending = false
    }
  }
}
</script>
