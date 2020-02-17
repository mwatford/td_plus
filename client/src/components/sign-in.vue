<template>
  <form class="form" @submit.prevent="login">
    <h2 class="header">Sign in</h2>
    <!-- <div class="col">
      <input
        type="text"
        placeholder="email"
        class="input"
        name="email"
        v-model="email"
        required
      />
      <input
        placeholder="password"
        type="password"
        class="input"
        name="password"
        v-model="password"
        required
      />
    </div> -->
    <button name="submit" :class="['button']">
      Sign in
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {},
  methods: {
    login() {
      this.$auth
        .loginWithPopup()
        .then(async () => {
          const { isAuthenticated, user } = this.$auth;
          const token = await this.$auth.getTokenSilently();
          this.$store.commit("auth/SET_TOKEN", token);
          const appUser = await this.$store.dispatch("user/fetchUser", {
            token,
            email: user.email
          });
          this.$store.commit("user/SET_USER", appUser.data);
          this.$store.commit("auth/SET_STATUS", true);
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {}
};
</script>
