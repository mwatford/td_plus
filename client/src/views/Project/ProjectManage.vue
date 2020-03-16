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
      task: ""
    };
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    })
  },
  methods: {
    addTask() {
      this.$socket.emit("addTask", this.task);
      this.task = "";
    },
    auth() {
      this.loading = "loading";
      this.$http({
        method: "get",
        url: `/api/projects/${this.$route.params.id}/admin`,
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
      this.$http({
        method: "delete",
        url: `/api/projects/${this.$route.params.id}`,
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
    }
  },
  mounted() {
    this.auth();
  }
};
</script>

<style lang="scss" scoped></style>
