<template>
  <div class="col wrapper m-auto">
    <div class="row controls" v-if="displayControls">
      <div class="row">
        <button
          :class="[
            `button button--start`,
            { 'button--active': currentView === 'dashboard' }
          ]"
          @click="changeView('dashboard')"
        >
          Dashboard
        </button>
        <button
          :class="[`button`, { 'button--active': currentView === 'main' }]"
          @click="changeView('main')"
        >
          Main
        </button>
        <button
          :class="[`button`, { 'button--active': currentView === 'chat' }]"
        >
          Chat
        </button>
      </div>
      <div class="row">
        <button
          :class="[
            `button`,
            'button--end',
            { 'button--active': currentView === 'manage' }
          ]"
          @click="changeView('manage')"
          v-if="project.admin === user._id"
        >
          Manage
        </button>
      </div>
    </div>
    <Project></Project>
  </div>
</template>

<script>
import { mapState } from "vuex";
import navigate from "../../mixins/navigate";
import Project from "./Project.vue";

export default {
  components: {
    Project
  },
  mixins: [navigate],
  data() {
    return {
      displayControls: false,
      data: null,
      currentView: ""
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      project: state => state.activeProject
    })
  },
  methods: {
    fetchData() {
      this.$store
        .dispatch("activeProject/fetchProject", {
          project: this.project,
          token: this.token
        })
        .then(({ data }) => {
          this.$store.commit("activeProject/RESET_STATE");
          this.$store.commit("activeProject/SET_PROJECT", data);

          this.showButtons();
          this.changeView("dashboard");
        })
        .catch(err => {
          this.$store.dispatch("alerts/display", {
            message: err.response.data,
            type: "error"
          });
          this.navigate("home");
        });
    },
    changeView(view) {
      this.$eventBus.$emit("changeView", view);
      this.currentView = view;
    },
    showButtons() {
      this.displayControls = true;
    }
  },
  created() {
    this.$eventBus.$on("correct password", this.showButtons());
    this.$eventBus.$on("fetch data", () => {
      this.fetchData();
    });
  },
  beforeRouteLeave(from, to, next) {
    this.$store.commit("activeProject/RESET_STATE");
    next();
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 90%;
  padding: 20px;
}
.controls {
  width: 100%;
  margin-bottom: 20px;
  justify-content: space-between;
}
.button {
  margin: 0 2px;
  border: none;
  background: #000000a2;
  border-radius: 2px;

  &--start {
    margin-left: 0;
  }

  &--end {
    margin-right: 0;
  }

  &:hover,
  &--active {
    background: #000000d2;
    color: #fff;
  }
}
</style>
