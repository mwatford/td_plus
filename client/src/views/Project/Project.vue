<template>
  <component :is="component" :state="state" :size="60"></component>
</template>

<script>
import { mapState } from 'vuex';
import navigate from '../../mixins/navigate';
import { popUp, scaleDown } from '../../mixins/animations';
import loader from '../../components/loading.vue';
import dashboard from './Dashboard.vue';
import manage from './ProjectManage.vue';
import password from './password.vue';

export default {
  data() {
    return {
      state: 'start',
      component: null,
      views: {
        manage,
        password,
        dashboard,
      },
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      project: state => state.activeProject.data,
      enterAnimation() {
        return this.popUp(300, 0, 'easeInSine');
      },
      leaveAnimation() {
        return this.scaleDown(300, 0, 'linear');
      },
    }),
  },
  methods: {
    popUp,
    scaleDown,
    hideLoader() {
      this.state = 'done';
      setTimeout(() => {
        this.state = 'start';
      }, 500);
    },
    changeView(view) {
      this.component = this.views[view];
    },
    grantAccess() {
      this.$eventBus.$emit('fetch-data');
      this.component = this.views.loader;
    },
  },
  mounted() {
    this.$eventBus.$on('change-view', this.changeView);
    this.$eventBus.$on('correct-password', this.grantAccess);

    if (
      this.project &&
      (!this.project.password || this.user._id === this.project.admin)
    ) {
      this.component = loader;
      this.$eventBus.$emit('fetch-data');
    } else {
      this.component = password;
    }
  },
  beforeDestroy() {
    this.$eventBus.$off('change-view', this.changeView);
    this.$eventBus.$off('correct-password', this.grantAccess);
  },
};
</script>

<style lang="scss"></style>
