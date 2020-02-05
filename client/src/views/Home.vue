<template>
  <div class="home">{{ user }}</div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({ user: state => state.user })
  }
};
</script>

<style lang="scss" scoped>

</style>
