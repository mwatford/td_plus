<template>
  <loading v-if="loading !== 'start'" :state="loading" :size="60"></loading>
  <div v-else class="m-auto view">
    <button @click="deleteProject" class="button">delete</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import navigate from "../../mixins/navigate";

export default {
  mixins: [navigate],
  data() {
    return {
      loading: "start",
      task: this.createEmptyTask()
    };
  },
  computed: {
    ...mapState({
      project: state => state.activeProject,
      token: state => state.auth.token,
      auth: state => state.auth.status
    })
  },
  methods: {
    createEmptyTask() {
      return {
        name: "",
        member: ""
      };
    },
    addTask() {
      this.$socket.emit("addTask", this.task);
      this.task = this.createEmptyTask();
    },
    authenticate() {
      this.loading = "loading";
      this.$http({
        method: "get",
        url: `/api/projects/${this.project._id}/admin`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          this.loading = "done";
          setTimeout(() => {
            this.loading = "start";
          }, 500);
        })
        .catch(e => {
          this.loading = "failed";
          this.$store.dispatch("alerts/display", {
            type: "error",
            message: e.response.data
          });

          this.$router.go(-1);
        });
    },
    deleteProject() {
      if (this.openDialog()) {
        return this.auth ? this.deleteFromDB() : this.deleteLocal();
      }
    },
    openDialog() {
      return confirm(
        `Are you absolutely sure you want to delete ${this.project.name}?`
      );
    },
    deleteFromDB() {
      return this.$http({
        method: "delete",
        url: `/api/projects/${this.project._id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      }).then(() => {
        this.$store.dispatch("alerts/display", {
          message: "Project has been deleted",
          type: "success"
        });
        this.navigate({ name: "home" });
      });
    },
    deleteLocal() {
      const project = this.$store.state.projects.data.find(
        el => el.name === this.project.name
      );
      const index = this.$store.state.projects.data.indexOf(project);

      if (index > -1) {
        this.$store.commit("projects/REMOVE", index);
        localStorage.setItem(
          "projects",
          JSON.stringify(this.$store.state.projects.data)
        );
        this.navigate({ name: "home" });
      }
    }
  },
  mounted() {
    if (this.auth) this.authenticate();
  }
};
</script>

<style lang="scss" scoped></style>
