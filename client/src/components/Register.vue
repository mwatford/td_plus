<template>
  <form
    class="box box--inverted"
    @submit.prevent="submitForm"
    autocomplete="off"
  >
    <h2 class="header">Register</h2>
    <input class="input" type="email" placeholder="email" v-model="email" />
    <input
      class="input"
      type="password"
      placeholder="password"
      v-model="password"
    />
    <input
      class="input"
      type="password"
      placeholder="repeat password"
      v-model="repassword"
    />
    <button class="m-auto button button--inverted">Register</button>
  </form>
</template>

<script>
import http from 'Services/api/index'

export default {
  data() {
    return {
      email: '',
      password: '',
      repassword: '',
    }
  },
  computed: {
    passwordsMatch() {
      return this.password === this.repassword
    },
  },
  methods: {
    async submitForm() {
      try {
        if (!this.passwordsMatch)
          return this.alert('error', 'Passwords do not match')

        const { data } = await http.users.register({
          email: this.email,
          password: this.password,
        })

        const { token } = data

        this.$store.commit('auth/SET_TOKEN', token)
        this.$store.commit('auth/SET_STATUS', true)

        await this.$store.dispatch('user/fetchUser', {
          token,
        })

        if (!this.$store.state.user.name)
          return this.$eventBus.$emit('choose-name')

        this.$router.push({ name: 'home' })
      } catch (error) {
        this.alert('error', error.response.data.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  height: auto;

  .button,
  .input {
    margin-top: 20px;
  }
}
</style>
