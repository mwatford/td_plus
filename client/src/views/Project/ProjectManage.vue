<template>
  <loading v-if="loading !== 'start'" :state="loading" :size="60"></loading>
  <div v-else>
    <button @click="deleteProject">delete</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: "start"
    };
  },
  computed: {
    ...mapState({ token: state => state.auth.token })
  },
  methods: {
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
      });
    }
  },
  mounted() {
    this.auth();
  }
};
</script>

<style></style>
