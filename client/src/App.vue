<template>
  <div id="app">
    <side-bar v-if="user.email"></side-bar>
    <alerts></alerts>
    <transition mode="out-in" name="slide">
      <timeline v-if="app.timeline"></timeline>
    </transition>
    <router-view class="display"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import sideBar from "./components/side-bar.vue";
import timeline from "./components/timeline.vue";
import alerts from "./components/alerts.vue";

export default {
  components: {
    "side-bar": sideBar,
    timeline: timeline,
    alerts
  },
  computed: {
    ...mapState({
      token: state => state.auth.token,
      app: state => state.app,
      user: state => state.user
    })
  },
  methods: {
    tryLogIn() {
      this.getToken();

      if (this.token) {
        this.getUser(this.token).then(this.handleResponse);
      }
    },
    getToken() {
      const token = window.localStorage.getItem("auth");

      if (token) {
        this.$store.commit("auth/SET_TOKEN", token);
        return true;
      }
      return false;
    },
    getUser() {
      return this.$store.dispatch("user/fetchUser");
    },
    handleResponse(response) {
      this.$store.commit("user/SET_USER", response.data);
      this.$store.commit("auth/SET_AUTH", true);
      this.$router.push({ name: "home" });
    }
  },
  mounted() {
    // this.tryLogIn();
    this.getUser();
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Ubuntu&display=swap");
@import url("https://fonts.googleapis.com/css?family=Orbitron&display=swap");
body {
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  // background: radial-gradient(#829e34, #852d52, #254a81);
  background-color: #f4d03f;
  background-image: radial-gradient(#f4d03f 0%, #16a085 100%);

  background-size: 400% 400%;
  animation: Gradient 20s ease-in-out infinite;
}
#app {
  display: flex;
  font-family: Ubuntu;
  width: 100%;
  height: 100%;
  color: #fff;
}
.display {
  display: flex;
  width: 100%;
  height: 100%;
}
.row {
  display: flex;
  flex-direction: row;
}
.col {
  display: flex;
  flex-direction: column;
}
@keyframes Gradient {
  0% {
    background-position: 50% 10%;
  }
  25% {
    background-position: 90% 50%;
  }
  50% {
    background-position: 50% 90%;
  }
  75% {
    background-position: 10% 50%;
  }
  100% {
    background-position: 50% 10%;
  }
}
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
