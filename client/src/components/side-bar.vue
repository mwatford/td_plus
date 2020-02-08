<template>
  <nav class="navigation">
    <div
      class="button"
      title="Profile"
      @mouseenter="displayUser = true"
      @mouseleave="displayUser = false"
    >
      <h4>P</h4>
      <user-details :user="user" v-if="displayUser"></user-details>
    </div>
    <button
      :class="[`button`, { 'button--active': app.timeline }]"
      title="Toggle timeline"
      @click="toggle('TIMELINE')"
    >
      T
    </button>
    <button
      :class="[`button`, { 'button--active': app.projects }]"
      title="Projects"
      @click="toggle('PROJECTS')"
    >
      C
    </button>
    <button class="button" @click="logout">L</button>
    <!-- <button @click="$store.commit('user/RESET_STATE')">as</button> -->
  </nav>
</template>

<script>
import { mapState } from "vuex";
import userDetails from "../components/user-details.vue";

export default {
  components: {
    "user-details": userDetails
  },
  data() {
    return {
      displayUser: false
    };
  },
  computed: {
    ...mapState({
      app: state => state.app,
      user: state => state.user
    })
  },
  methods: {
    toggle(component) {
      this.$store.commit(`app/TOGGLE_${component}`);
    },
    logout() {
      this.$store.dispatch("user/logout");
      this.$store.dispatch("alerts/display", {
        message: "You have been logged out",
        type: "success"
      });
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  height: 100vh;
  min-width: 45px;
  border-right: 1px solid #fff;
  // background: linear-gradient(90deg, #000, #181818);
  background: #000;
  flex-direction: column;
  box-shadow: 0 0 20px 2px #000;
  z-index: 1;
}
.button {
  cursor: pointer;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #9c9c9c;
  color: #fff;
  margin: 0;
  padding: 0;
  position: relative;

  &:hover,
  &--active {
    background: #ffffff22;
  }
}
</style>
