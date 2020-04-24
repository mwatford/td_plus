<template>
  <div id="app">
    <side-bar></side-bar>
    <alerts></alerts>
    <transition mode="out-in" name="slide">
      <timeline v-if="app.timeline"></timeline>
    </transition>
    <router-view class="display"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import sideBar from './components/side-bar.vue';
import timeline from './components/timeline.vue';
import alerts from './components/alerts.vue';

export default {
  components: {
    'side-bar': sideBar,
    timeline: timeline,
    alerts,
  },
  computed: {
    ...mapState({
      app: state => state.app,
      user: state => state.user,
      isAuthenticated: state => state.auth.status,
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  font-family: Ubuntu;
  width: 100%;
  height: 100%;
  color: #fff;
}
</style>
