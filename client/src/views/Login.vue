<template>
  <div class="login">
    <form action="" @submit.prevent="submit" class="login">
      <h2 class="header">Login</h2>
      <label for="email">Email:</label>
      <input type="text" class="input" name="email" v-model="email" required />
      <label for="password">Password:</label>
      <input
        type="password"
        class="input"
        name="password"
        v-model="password"
        required
      />
      <button name="submit" :class="['button']" :active="!valid">
        Login
      </button>
    </form>
    <button class="button button--register" @click="register">Register</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {},
  methods: {
    register() {
      this.$router.push({ name: "register" });
    },
    submit() {
      if (this.valid) {
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
              this.$store.commit("user/ASSIGN_TOKEN", token);
              this.$store.dispatch("user/fetchUser", token);
              this.$router.push({ name: "home" });
            }
          })
          .catch(err => {
            this.$store.dispatch("alerts/display", {
              message: err,
              type: "error"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.login {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  form {
    width: 350px;
    height: 400px;
    display: flex;
    flex-direction: column;
    margin: auto;
    background: #000000a2;
    color: #fff;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
  }
}
.header {
  margin-bottom: 20px;
}
.input {
  width: 200px;
  margin: 10px 0px;
}
.button {
  margin-top: 10px;
  width: 120px;
  height: 30px;

  &--register {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 10px;
    background: #000000f2;
    border: none;
    border-radius: 4px;
    color: #fff;
  }

  &--inactive {
    background: red;
  }
}
</style>
