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
    <button class="button m-auto" name="submit">OK</button>
  </form>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      name: '',
    };
  },
  computed: {
    ...mapState({
      token: state => state.auth.token,
      user: state => state.user,
    }),
  },
  methods: {
    async chooseName() {
      if (!name.trim()) return this.alert('error', 'Choose your name.');

      await this.$store.dispatch('user/save', {
        token: this.token,
        data: { name: this.name },
      });

      this.$eventBus.$emit('name-chosen');
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.button {
  margin-top: 30px;
}
.box {
  padding: 50px;
}
</style>
