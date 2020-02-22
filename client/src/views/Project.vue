<template>
  <loading v-if="state !== 'start'" :size="60" :state="state"></loading>
  <div class="project" v-else-if="project">
    <ul class="col">
      <h3>To Do</h3>
      <li v-for="task in project.toDo" :key="task._id"></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import navigate from "../mixins/navigate";

export default {
  data() {
    return {
      project: null,
      state: "start"
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token
    })
  },
  methods: {
    fetchData() {
      this.state = "loading";
      this.$http({
        method: "get",
        url: `/api/projects/${this.$route.params.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(this.hideLoader)
        .catch(err => {
          this.state = "failed";
          this.$store.dispatch("alerts/display", {
            message: err.response.data,
            type: "error"
          });
          this.navigate("home");
        });
    },
    hideLoader({ data }) {
      this.state = "done";
      setTimeout(() => {
        this.project = data;
        this.state = "start";
      }, 500);
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style></style>
