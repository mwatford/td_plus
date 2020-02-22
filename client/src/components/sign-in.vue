<template>
  <form class="form" @submit.prevent="login">
    <h2 class="header">Sign in</h2>
    <loading :size="60" :state="state" class="m-auto" v-if="loading"></loading>
    <button name="submit" class="m-auto button" v-else>
      Sign in
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      state: "failed"
    };
  },
  computed: {},
  methods: {
    login() {
      this.loading = true;
      this.state = "loading";
      this.$auth
        .loginWithPopup()
        .then(async () => {
          this.state = "success";
          const { isAuthenticated, user } = this.$auth;
          const token = await this.$auth.getTokenSilently();
          this.$store.commit("auth/SET_TOKEN", token);
          return this.$store.dispatch("user/fetchUser", {
            token,
            email: user.email
          });
        })
        .then(() => {
          this.loading = false;
          this.$store.commit("auth/SET_STATUS", true);
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          this.state = "failed";
          console.log(err);
        });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped></style>
