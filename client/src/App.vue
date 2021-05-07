<template>
  <div id="app">
    <side-bar></side-bar>
    <alerts></alerts>
    <router-view class="display"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import sideBar from 'Components/side-bar.vue'
import alerts from 'Components/alerts.vue'

export default {
  components: {
    sideBar,
    alerts,
  },
  computed: {
    ...mapState({
      app: state => state.app,
      user: state => state.user,
      isAuthenticated: state => state.auth.status,
    }),
  },
}
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
