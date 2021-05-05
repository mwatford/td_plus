<template>
  <div class="start row">
    <!-- <transition
      @leave="leaveAnimation"
      @enter="enterAnimation"
      mode="out-in"
      :css="false"
    > -->
    <div class="row">
      <Username v-if="displayUsernameComponent"></Username>
      <template v-else>
        <Register></Register>
        <SignIn></SignIn>
      </template>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import boxAnimations from 'Mixins/boxAnimations';
import SignIn from 'Components/sign-in.vue';
import Register from 'Components/Register.vue';
import Username from 'Components/username.vue';
import loader from 'Components/loading.vue';
import animations from 'Mixins/animations';
import navigate from 'Mixins/navigate';

export default {
  mixins: [boxAnimations, animations, navigate],
  components: {
    SignIn,
    Register,
    Username,
  },
  data() {
    return {
      state: 'loading',
      displayUsernameComponent: false,
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
  methods: {},
  mounted() {
    this.$eventBus.$on('choose-name', () => {
      this.displayUsernameComponent = true;
    });
    this.$eventBus.$on('name-chosen', () => {
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
.box {
  padding: 50px;
  margin: 0 20px;
  justify-content: space-between;
  display: flex;
}
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
