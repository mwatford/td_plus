<template>
  <form action="" @submit.prevent="chooseName">
    <input
      type="text"
      name=""
      id=""
      class="input"
      placeholder="Choose your name"
      v-model="name"
    />
    <button class="m-auto button" name="submit">OK</button>
  </form>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      name: ""
    };
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    })
  },
  methods: {
    chooseName() {
      this.$store
        .dispatch("user/save", {
          token: this.token,
          changes: {
            name: this.name
          }
        })
        .then(response => {
          const { message, type } = response.data;

          this.$store.commit("user/SET_USER", { name: this.name });
          this.$eventBus.$emit("name chosen");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
