<template>
  <form @submit.prevent="submitForm" class="box">
    <h2 class="header">Sign in</h2>
    <input class="input" type="email" placeholder="email" v-model="email" />
    <input
      class="input"
      type="password"
      placeholder="password"
      v-model="password"
    />
    <button name="submit" class="m-auto button">Sign in</button>
  </form>
</template>

<script>
import http from 'Services/api/index'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async submitForm() {
      try {
        const { data } = await http.users.signIn({
          email: this.email,
          password: this.password,
        })

        const { token } = data

        this.$store.commit('auth/SET_TOKEN', token)
        this.$store.commit('auth/SET_STATUS', true)

        await this.$store.dispatch('user/fetchUser', {
          token,
        })

        if (!this.$store.state.user.name) {
          this.$eventBus.$emit('choose-name')
        } else {
          this.$router.push({ name: 'home' })
        }
      } catch (error) {
        this.alert('error', 'Invalid credentials')
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

  .button {
    margin-top: auto;
    margin-bottom: 0;
  }
  .input {
    margin-top: 20px;
  }
}
</style>
