<template>
  <nav class="navigation">
    <div
      title="Profile"
      @mouseenter="displayUser = true"
      @mouseleave="displayUser = false"
      @click="navigate('profile')"
    >
      <button
        :class="[
          'navigation__button',
          { 'navigation__button--active': $route.name === 'profile' }
        ]"
      >
        P
      </button>
      <user-details :user="user" v-if="displayUser"></user-details>
    </div>
    <button
      :class="[
        `navigation__button`,
        { 'navigation__button--active': $route.name === 'home' }
      ]"
      title="Home"
      @click="navigate('home')"
    >
      H
    </button>
    <button
      :class="[
        `navigation__button`,
        { 'navigation__button--active': app.timeline }
      ]"
      title="Toggle timeline"
      @click="toggle('TIMELINE')"
    >
      T
    </button>
    <button
      :class="[
        `navigation__button`,
        { 'navigation__button--active': app.projects }
      ]"
      title="Projects"
      @click="toggle('PROJECTS')"
    >
      C
    </button>
    <button class="navigation__button" @click="logout">L</button>
    <!-- <button @click="$store.commit('user/RESET_STATE')">as</button> -->
  </nav>
</template>

<script>
import { mapState } from "vuex";
import userDetails from "../components/user-details.vue";
import navigate from "../mixins/navigate";

export default {
  mixins: [navigate],
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
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  font-family: Orbitron;
}
.navigation {
  display: flex;
  height: 100vh;
  min-width: 45px;
  background: #000000;
  flex-direction: column;
  z-index: 1;

  &__button {
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
}
</style>
