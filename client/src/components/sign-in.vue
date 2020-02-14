<template>
  <form class="form" @submit.prevent="login">
    <div class="col">
      <h2 class="header">Sign in</h2>
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
      <a href="#" class="form__link">Forgot your password?</a>
    </div>
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
      const { email, password } = this;
      this.$store
        .dispatch("auth/login", { email, password })
        .then(({ token }) => {
          return this.$store.dispatch("user/fetchUser", token);
        })
        .then(user => {
          console.log(user);
          this.$store.commit("user/SET_USER", user);
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          this.$store.dispatch("alerts/display", {
            type: "error",
            message: err
          });
          // this.$router.push({ name: "start" });
        });
    },
    submit() {
      return axios({
        method: "post",
        url: "/api/users/login/local",
        data: {
          email: this.email,
          password: this.password
        },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          this.$store.dispatch("alerts/display", {
            message: response.data.message,
            type: response.data.type
          });
          const token = response.data.token;

          if (token) {
            window.localStorage.setItem("auth", token);
            this.$store.commit("auth/SET_TOKEN", token);
            this.$store.dispatch("user/fetchUser", token).then(response => {
              const user = response.data;

              this.$store.commit("user/SET_USER", user);
              this.$store.commit("auth/SET_AUTH", true);
              this.$router.push({ name: "home" });
            });
          }
        })
        .catch(err => {
          this.$store.dispatch("alerts/display", {
            message: err,
            type: "error"
          });
        });
    }
  },
  mounted() {}
};
</script>
