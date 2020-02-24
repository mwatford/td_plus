<template>
  <form @submit.prevent="login">
    <h2 class="header">Sign in</h2>
    <button name="submit" class="m-auto button">
      Sign in
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      state: "start"
    };
  },
  methods: {
    login() {
      this.$eventBus.$emit("signIn");
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}
</style>
