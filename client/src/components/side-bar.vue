<template>
  <nav class="navigation">
    <router-link
      :to="{ name: 'home' }"
      :class="[
        `navigation__button`,
        { 'navigation__button--active': $route.name === 'home' },
      ]"
      title="Home"
      @click="navigate('home')"
    >
      <app-icon type="home"></app-icon>
    </router-link>
    <router-link :to="{ name: 'profile' }" title="Profile" v-if="auth">
      <router-link
        :to="{ name: 'profile' }"
        :class="[
          'navigation__button',
          { 'navigation__button--active': $route.name === 'profile' },
        ]"
      >
        <app-icon type="user"></app-icon>
      </router-link>
    </router-link>
    <router-link
      v-if="!auth"
      :to="{ name: 'start' }"
      class="navigation__button"
      title="Sign In"
    >
      <app-icon type="sign-in"></app-icon>
    </router-link>
    <button
      v-if="auth"
      class="navigation__button"
      title="Sign Out"
      @click="logout"
    >
      <app-icon type="power"></app-icon>
    </button>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import navigate from '../mixins/navigate';

export default {
  mixins: [navigate],
  computed: {
    ...mapState({
      app: state => state.app,
      user: state => state.user,
      auth: state => state.auth.status,
    }),
  },
  methods: {
    logout() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  font-family: monospace;
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

    h3 {
      display: flex;
      border-radius: 50%;
      width: 70%;
      height: 70%;
      border: 1px solid #9c9c9c;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
