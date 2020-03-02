<template>
  <div class="col wrapper m-auto">
    <ul class="row controls" v-if="displayControls">
      <li class="button button--start" @click="changeView('dashboard')">
        Dashboard
      </li>
      <li class="button" @click="changeView('main')">Main</li>
      <li class="button">Chat</li>
      <li
        class="button button--end"
        @click="changeView('manage')"
        v-if="project.admin === user._id"
      >
        Manage
      </li>
    </ul>
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
      data: null
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
    margin-left: auto;
  }

  &:hover {
    background: #000000d2;
    color: #fff;
  }
}
</style>
