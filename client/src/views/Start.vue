<template>
  <div class="start col">
    <div class="box">
      <transition
        @leave="leaveAnimation"
        @enter="enterAnimation"
        mode="out-in"
        :css="false"
      >
        <component :is="component" :state="state" :size="60"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import boxAnimations from "../mixins/boxAnimations";
import signIn from "../components/sign-in.vue";
import loader from "../components/loading.vue";
import username from "../components/username.vue";
import animations from "../mixins/animations";

export default {
  mixins: [boxAnimations, animations],
  data() {
    return {
      state: "loading",
      component: signIn
    };
  },
  computed: {
    enterAnimation() {
      return this.component === loader
        ? this.popUp(200, 0, "spring")
        : this.fadeIn(200, 0, "linear");
    },
    leaveAnimation() {
      return this.component !== loader
        ? this.scaleDown(200, 0, "linear")
        : this.fadeOut(200, 0, "linear");
    }
  },
  methods: {
    login() {
      this.component = loader;
      this.$auth
        .loginWithPopup()
        .then(async () => {
          const { isAuthenticated, user } = this.$auth;
          const token = await this.$auth.getTokenSilently();

          this.$store.commit("auth/SET_TOKEN", token);

          return this.$store.dispatch("user/fetchUser", {
            token,
            email: user.email
          });
        })
        .then(() => {
          this.state = "done";

          if (!this.$store.state.user.name) {
            this.component = username;
          } else {
            this.$router.push({ name: "home" });
          }
        })
        .catch(err => {
          this.state = "failed";
        });
    }
  },
  mounted() {
    this.$eventBus.$on("signIn", () => {
      this.login();
    });
    this.$eventBus.$on("name chosen", () => {
      this.$router.push({ name: "home" });
    });
    this.boxEnterAnimation(400, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(300, 0, false).then(next);
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.start {
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
}
.box {
  width: 350px;
  height: 250px;
  display: flex;
  flex-direction: column;
  background: #000000cc;
  color: #fff;
  justify-content: space-between;
  padding: 50px 50px;

  &--inverted {
    background: #fff;
    color: #000;

    & .input {
      color: #000;
      background: #fff;
      border-color: #000;
    }
  }

  &__link {
    color: #fff;
    margin: 20px auto;
    // height: 30px;
  }
}
section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &.register {
    background: #000000cc;
  }
}
.header {
  margin-bottom: 20px;
}
.input {
  height: 30px;
  width: 100%;
  margin: 10px 0px;
  border: none;
  background: none;
  color: #fff;
  border-bottom: 2px solid #fff;
  padding: 2px;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 18px;
  font-family: Ubuntu;
  min-height: 40px;
  max-height: 40px;
  border-radius: 20px;
  border: 2px solid #fff;
  background-color: transparent;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
  }

  &--inverted {
    border-color: #000;
    color: #000;

    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
