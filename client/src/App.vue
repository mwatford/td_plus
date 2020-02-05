<template>
  <div id="app">
    <side-bar></side-bar>
    <router-view class="display"></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import sideBar from "./components/side-bar.vue";

export default {
  components: {
    "side-bar": sideBar
  },
  computed: {},
  methods: {
    ...mapActions({
      fetchUser: actions => actions.fetchUser
    })
  },
  mounted() {
    this.$store.dispatch("user/fetchUser");
  }
};
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(#829e34, #852d52, #254a81);
  background-size: 400% 400%;
  animation: Gradient 20s ease-in-out infinite;
}
#app {
  display: flex;
  width: 100vw;
}
.display {
  width: 100%;
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
</style>
