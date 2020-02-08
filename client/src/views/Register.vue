<template>
  <form
    action=""
    @submit.prevent="submit"
    :class="['register', { 'register--valid': valid }]"
  >
    <h2 class="header">Register</h2>
    <label for="email">Email:</label>
    <input type="text" class="input" name="email" v-model="form.email" />
    <label for="password">Password:</label>
    <input
      type="password"
      class="input"
      name="password"
      v-model="form.password"
    />
    <label for="passwordRepeat">Repeat password:</label>
    <input
      type="password"
      class="input"
      name="passwordRepeat"
      v-model="form.repeat"
    />
    <button
      name="submit"
      :disabled="!valid"
      :class="['button', { 'button--inactive': !valid }]"
    >
      Register
    </button>
  </form>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        repeat: ""
      },
      validation: {
        email: false,
        passwordLength: false,
        passwordNumber: false,
        passwordCapital: false,
        passwordSpecial: false,
        passwordsMatch: false
      }
    };
  },
  computed: {
    valid() {
      this.validateEmail();
      this.passwordLength();
      this.passwordNumber();
      this.passwordCapital();
      this.passwordSpecial();
      this.passwordsMatch();

      return this.testForm();
    }
  },
  methods: {
    testForm() {
      for (let key in this.validation) {
        if (!this.validation[key]) {
          return false;
        }
      }
      return true;
    },
    validateEmail() {
      const emailReg = new RegExp(
        /^([a-z\d\.-]+?)@([a-z\d-]+?)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
      );
      if (this.form.email && !emailReg.test(this.form.email)) {
        this.validation.email = false;
      } else if (this.form.email) {
        this.validation.email = true;
      }
    },
    passwordLength() {
      if (this.form.password.length > 12) {
        this.validation.passwordLength = true;
      } else {
        this.validation.passwordLength = false;
      }
    },
    passwordNumber() {
      if (this.form.password.match(/\d/)) {
        this.validation.passwordNumber = true;
      } else {
        this.validation.passwordNumber = false;
      }
    },
    passwordCapital() {
      if (this.form.password.match("[A-Z]")) {
        this.validation.passwordCapital = true;
      } else {
        this.validation.passwordCapital = false;
      }
    },
    passwordSpecial() {
      if (this.form.password.match("[!@$#%?_]")) {
        this.validation.passwordSpecial = true;
      } else {
        this.validation.passwordSpecial = false;
      }
    },
    passwordsMatch() {
      if (
        this.form.password.length > 0 &&
        this.form.password === this.form.repeat
      ) {
        this.validation.passwordsMatch = true;
      } else {
        this.validation.passwordsMatch = false;
      }
    },
    submit() {
      return axios({
        method: "post",
        url: "/api/users/register/local",
        data: {
          email: this.form.email,
          password: this.form.password
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
          this.$router.push({ name: "login" });
        })
        .catch(err => {
          this.$store.dispatch("alerts/display", {
            message: response.data.message,
            type: 'error'
          });
        });
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
.register {
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
  transition: all 0.3s ease;

  &--valid {
    box-shadow: 0 0 20px 5px #5ef523b0;
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
}
</style>
