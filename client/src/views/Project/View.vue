<template>
  <div class="col">
    <ul class="row">
      <li
        class="button"
        @click="changeView('manage')"
        v-if="project.admin === user._id"
      >
        manage
      </li>
    </ul>
    <Project></Project>
    <!-- <router-view></router-view> -->
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
      displayControls: !false,
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
    }
  },
  mounted() {
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

<style></style>
