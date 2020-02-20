<template>
  <div class="asd" v-if="loading">
    loading data
  </div>
  <div class="project" v-else>
    <ul class="col">
      <h3>To Do</h3>
      <li v-for="task in project.toDo" :key="task._id"></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      project: null,
      loading: true
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
      this.$http({
        method: "get",
        url: `/api/projects/${this.$route.params.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(({ data }) => {
          this.project = data;
          this.loading = false;
        })
        .catch(err => {
          this.$store.dispatch("alerts/display", {
            message: err.response.data,
            type: "error"
          });
          this.$router.push({ name: "home" });
        });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style></style>
