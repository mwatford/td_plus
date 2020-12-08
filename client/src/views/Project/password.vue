<template>
  <form class="box m-auto" @submit.prevent="compare">
    <h3>
      {{ project.name }}
    </h3>
    <input
      type="password"
      v-model="password"
      class="input"
      placeholder="password"
    />
    <button class="button" name="submit">OK</button>
  </form>
</template>

<script>
import { comparePasswords } from 'Utils/password';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      password: '',
    };
  },
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
    }),
  },
  methods: {
    comparePasswords,
    compare() {
      const passwordValid = this.comparePasswords(
        this.password,
        this.project.password
      );
      if (passwordValid) {
        this.$eventBus.$emit('correct-password');
      } else {
        this.alert('error', 'Incorrect password');
        this.password = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  justify-content: space-between;
  padding: 50px;
}
</style>
