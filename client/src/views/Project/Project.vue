<template>
  <transition
    @enter="enterAnimation"
    @leave="leaveAnimation"
    :css="false"
    mode="out-in"
    appear
  >
    <component :is="component" :state="state" :size="60"></component>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import navigate from "../../mixins/navigate";
import { popUp, scaleDown } from "../../mixins/animations";
import loader from "../../components/loading.vue";
import dashboard from "./Dashboard.vue";
import manage from "./ProjectManage.vue";
import password from "./password.vue";

export default {
  data() {
    return {
      state: "start",
      component: null,
      views: {
        manage,
        password,
        dashboard
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      project: state => state.activeProject,
      enterAnimation() {
        return this.popUp(300, 0, "easeInSine");
      },
      leaveAnimation() {
        return this.scaleDown(300, 0, "linear");
      }
    })
  },
  methods: {
    popUp,
    scaleDown,
    hideLoader() {
      this.state = "done";
      setTimeout(() => {
        this.state = "start";
      }, 500);
    }
  },
  mounted() {
    if (!this.project.password || this.user._id === this.project.admin) {
      this.$eventBus.$emit("fetch data");
      this.component = loader;
    } else {
      this.component = password;
    }
    this.$eventBus.$on("correct password", () => {
      this.$eventBus.$emit("fetch data");
      this.component = this.views.loader;
    });
    this.$eventBus.$on("changeView", view => {
      this.component = this.views[view];
    });
  }
};
</script>

<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}</style>
