<template>
  <form class="create">
    <form action="" class="form" @submit.prevent>
      <input
        type="text"
        name="name"
        placeholder="project name"
        v-model="project.name"
        class="input"
      />
      <div class="row">
        <button class="button" @click="create">Create</button>
        <button class="button" @click="cancel">Back</button>
      </div>
    </form>
  </form>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      project: {
        name,
        members: []
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token
    })
  },
  methods: {
    create() {
      axios({
        method: "post",
        url: "/api/projects/create",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        data: {
          email: this.user.email,
          project: this.project
        }
      })
        .then(response => {
          return this.$store.dispatch("user/fetchUser", {
            token: this.token,
            email: this.user.email
          });
        })
        .then(() => {
          this.$router.push({ name: "home" });
        });
    },
    addMember() {},
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.create {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
