<template>
  <div class="project">
    <p>ID = {{ $route.params.id }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token
    })
  },
  data() {
    return {};
  },
  methods: {
    fetchData() {
      axios({
        method: "get",
        url: `/api/projects/${this.$route.params.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      }).catch(err => {
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
