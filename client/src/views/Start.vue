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
import boxAnimations from '../mixins/boxAnimations';
import signIn from '../components/sign-in.vue';
import loader from '../components/loading.vue';
import username from '../components/username.vue';
import animations from '../mixins/animations';
import navigate from '../mixins/navigate';

export default {
  mixins: [boxAnimations, animations, navigate],
  data() {
    return {
      state: 'loading',
      component: signIn,
    };
  },
  computed: {
    enterAnimation() {
      return this.component === loader
        ? this.popUp(200, 0, 'spring')
        : this.fadeIn(200, 0, 'linear');
    },
    leaveAnimation() {
      return this.component !== loader
        ? this.scaleDown(200, 0, 'linear')
        : this.fadeOut(200, 0, 'linear');
    },
  },
  methods: {
    login() {
      this.component = loader;
      this.$auth
        .loginWithPopup()
        .then(async () => {
          const { isAuthenticated, user } = this.$auth;
          const token = await this.$auth.getTokenSilently();

          this.$store.commit('auth/SET_TOKEN', token);
          this.$store.commit('auth/SET_STATUS', true);

          return this.$store.dispatch('user/fetchUser', {
            token,
            email: user.email,
          });
        })
        .then(() => {
          this.state = 'done';

          if (!this.$store.state.user.name) {
            this.component = username;
          } else {
            this.$router.push({ name: 'home' });
          }
        })
        .catch(err => {
          this.state = 'failed';
        });
    },
  },
  mounted() {
    this.$eventBus.$on('signIn', () => {
      this.login();
    });
    this.$eventBus.$on('name chosen', () => {
      this.navigate({ name: 'home' });
    });
    this.boxEnterAnimation(400, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(300, 0, false).then(next);
  },
};
</script>

<style lang="scss" scoped>
.start {
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
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
</style>
