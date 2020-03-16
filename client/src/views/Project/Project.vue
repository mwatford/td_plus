<template>

  <component :is="component" :state="state" :size="60"></component>
</template>

<script>
import { mapState } from "vuex";
import navigate from "../../mixins/navigate";
import { popUp, scaleDown } from "../../mixins/animations";
import loader from "../../components/loading.vue";
import dashboard from "./Dashboard.vue";
import manage from "./ProjectManage.vue";
import password from "./password.vue";
import chat from "./Chat.vue";

export default {
  data() {
    return {
      state: "start",
      component: null,
      views: {
        manage,
        password,
        dashboard,
        chat
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
}
</style>
