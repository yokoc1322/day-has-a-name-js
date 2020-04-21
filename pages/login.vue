<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="user name"
            type="text"
            required
            :error="isLoginError"
            :error-messages="usernameErrors"
            @blur="refreshErrors()"
            @input="refreshErrors()"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="password"
            :append-icon="isShownPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShownPassword ? 'text' : 'password'"
            :error="isLoginError"
            :error-messages="passwordErrors"
            @click:append="isShownPassword = !isShownPassword"
            @blur="refreshErrors()"
            @input="refreshErrors()"
          ></v-text-field>
          <div class="d-flex align-center">
            <v-btn :disabled="isDisableSubmit" type="submit">Login</v-btn>
            <p v-if="isLoginError" class="mb-0 ml-3 error--text">
              {{ loginErrorMessage }}
            </p>
            <v-progress-circular
              v-if="isLoggingin"
              class="ml-3"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex'

export default {
  mixins: [validationMixin],
  middleware: ['require-no-login'],
  data() {
    return {
      username: '',
      password: '',
      isShownPassword: false,
      isDisableSubmit: true,
      isLoggingin: false,
      isLoginError: false,
      loginErrorMessage: ''
    }
  },
  validations: {
    username: { required },
    password: { required }
  },
  computed: {
    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('user name is required.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('password is required.')
      return errors
    },
    ...mapState(['serverURL'])
  },
  methods: {
    login(event) {
      this.refreshErrors()
      if (this.$v.$error) return
      this.isLoggingin = true

      this.$axios
        .post('/api-token-auth/', {
          username: this.username,
          password: this.password
        })
        .then((res) => {
          const token = res.data.token
          this.$store.commit('setToken', token)
          this.$router.push('/write')
        })
        .catch((error) => {
          const res = error.response
          this.isLoginError = true
          if (res.status === 400) {
            this.loginErrorMessage = 'Wrong username or password'
          } else {
            this.loginErrorMessage = error.data
          }
        })
        .then(() => {
          this.isLoggingin = false
        })
    },
    refreshErrors() {
      this.$v.$touch()
      this.isDisableSubmit = this.$v.$error
      this.isLoginError = false
    },
    ...mapMutations(['setToken'])
  }
}
</script>
